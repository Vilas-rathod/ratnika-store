package com.ratnika.checkout;

import com.ratnika.address.entity.AddressType;
import com.ratnika.catalog.category.entity.Category;
import com.ratnika.catalog.category.repository.CategoryRepository;
import com.ratnika.catalog.product.entity.Material;
import com.ratnika.catalog.product.entity.Occasion;
import com.ratnika.catalog.product.entity.Product;
import com.ratnika.catalog.product.entity.ProductAttributes;
import com.ratnika.catalog.product.repository.ProductRepository;
import com.ratnika.checkout.dto.CheckoutDtos.ConfirmPaymentRequest;
import com.ratnika.checkout.dto.CheckoutDtos.InitiateCheckoutRequest;
import com.ratnika.checkout.dto.CheckoutDtos.InitiateCheckoutResponse;
import com.ratnika.checkout.service.CheckoutSagaOrchestrator;
import com.ratnika.common.exception.BadRequestException;
import com.ratnika.order.dto.OrderDtos.OrderItemRequest;
import com.ratnika.order.dto.OrderDtos.ShippingAddressDto;
import com.ratnika.order.entity.OrderStatus;
import com.ratnika.order.entity.PaymentMethod;
import com.ratnika.order.entity.PaymentStatus;
import com.ratnika.order.repository.OrderRepository;
import com.ratnika.payment.dto.PaymentDtos.RazorpayOrderResponse;
import com.ratnika.payment.entity.Payment;
import com.ratnika.payment.repository.PaymentRepository;
import com.ratnika.payment.service.RazorpayService;
import com.ratnika.user.entity.Role;
import com.ratnika.user.entity.User;
import com.ratnika.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

/**
 * End-to-end saga tests against H2: happy paths and — most importantly — the
 * compensating transactions (bad signature, customer cancel, expiry sweep) that
 * must release reserved stock even when the caller throws.
 */
@SpringBootTest
@ActiveProfiles("test")
class CheckoutSagaTest {

    @Autowired CheckoutSagaOrchestrator saga;
    @Autowired ProductRepository productRepository;
    @Autowired CategoryRepository categoryRepository;
    @Autowired UserRepository userRepository;
    @Autowired OrderRepository orderRepository;
    @Autowired PaymentRepository paymentRepository;
    @Autowired JdbcTemplate jdbc;

    @MockBean RazorpayService razorpayService;

    private User user;
    private Product product;

    private static final int INITIAL_STOCK = 10;
    private static final int QTY = 3;

    @BeforeEach
    void setup() {
        paymentRepository.deleteAll();
        orderRepository.deleteAll();
        productRepository.deleteAll();
        categoryRepository.deleteAll();
        userRepository.deleteAll();

        Category category = categoryRepository.save(Category.builder()
                .name("Rings").slug("rings-saga").active(true).sortOrder(1).build());
        product = productRepository.save(Product.builder()
                .name("Saga Ring").slug("saga-ring").description("Test ring")
                .category(category).price(BigDecimal.valueOf(1000)).mrp(BigDecimal.valueOf(1200))
                .sku("RTN-SAGA-1").stock(INITIAL_STOCK)
                .attributes(ProductAttributes.builder()
                        .material(Material.GOLD_PLATED).occasion(Occasion.FESTIVE)
                        .color("Gold").weightGrams(3).build())
                .active(true).build());
        user = userRepository.save(User.builder()
                .firstName("Test").lastName("Buyer").email("buyer@ratnika.in")
                .password("x").phone("+91 90000 00000").role(Role.CUSTOMER)
                .emailVerified(true).build());

        // Gateway stub — createOrder always returns a test order.
        when(razorpayService.createOrder(any()))
                .thenReturn(new RazorpayOrderResponse("order_TEST", 0L, "INR", "rzp_test"));
    }

    private InitiateCheckoutResponse initiate(PaymentMethod method) {
        return saga.initiate(user, new InitiateCheckoutRequest(
                List.of(new OrderItemRequest(product.getId(), QTY, null, null)),
                new ShippingAddressDto("Test Buyer", "+91 90000 00000", "12 Lane", null,
                        "Pune", "Maharashtra", "411001", "India", AddressType.HOME),
                method, null));
    }

    private int stock() {
        return productRepository.findById(product.getId()).orElseThrow().getStock();
    }

    private OrderStatus orderStatus(java.util.UUID orderId) {
        return orderRepository.findById(orderId).orElseThrow().getStatus();
    }

    // ── Happy paths ───────────────────────────────────────────────
    @Test
    void codCheckoutConfirmsImmediately() {
        InitiateCheckoutResponse init = initiate(PaymentMethod.COD);

        assertThat(init.requiresPayment()).isFalse();
        assertThat(init.razorpayOrderId()).isNull();
        assertThat(orderStatus(init.orderId())).isEqualTo(OrderStatus.CONFIRMED);
        assertThat(orderRepository.findById(init.orderId()).orElseThrow().getPaymentStatus())
                .isEqualTo(PaymentStatus.COD_PENDING);
        assertThat(stock()).isEqualTo(INITIAL_STOCK - QTY);
    }

    @Test
    void razorpayInitiateReservesStock() {
        InitiateCheckoutResponse init = initiate(PaymentMethod.RAZORPAY);

        assertThat(init.requiresPayment()).isTrue();
        assertThat(init.razorpayOrderId()).isEqualTo("order_TEST");
        assertThat(orderStatus(init.orderId())).isEqualTo(OrderStatus.PENDING_PAYMENT);
        assertThat(stock()).isEqualTo(INITIAL_STOCK - QTY); // reserved
        Payment payment = paymentRepository.findByOrderId(init.orderId()).orElseThrow();
        assertThat(payment.getStatus()).isEqualTo(PaymentStatus.PENDING);
        assertThat(payment.getGatewayOrderId()).isEqualTo("order_TEST");
    }

    @Test
    void confirmSuccessMarksOrderPaid() {
        InitiateCheckoutResponse init = initiate(PaymentMethod.RAZORPAY);
        when(razorpayService.verifySignature(anyString(), anyString(), anyString())).thenReturn(true);

        saga.confirm(user, new ConfirmPaymentRequest(init.orderId(), "order_TEST", "pay_1", "sig"));

        assertThat(orderStatus(init.orderId())).isEqualTo(OrderStatus.CONFIRMED);
        assertThat(orderRepository.findById(init.orderId()).orElseThrow().getPaymentStatus())
                .isEqualTo(PaymentStatus.PAID);
        assertThat(paymentRepository.findByOrderId(init.orderId()).orElseThrow().getStatus())
                .isEqualTo(PaymentStatus.PAID);
        assertThat(stock()).isEqualTo(INITIAL_STOCK - QTY); // stays reserved (sold)
    }

    // ── Compensations ─────────────────────────────────────────────
    @Test
    void badSignatureCompensatesAndReleasesStock() {
        InitiateCheckoutResponse init = initiate(PaymentMethod.RAZORPAY);
        when(razorpayService.verifySignature(anyString(), anyString(), anyString())).thenReturn(false);

        assertThatThrownBy(() -> saga.confirm(user,
                new ConfirmPaymentRequest(init.orderId(), "order_TEST", "pay_bad", "bad_sig")))
                .isInstanceOf(BadRequestException.class);

        assertThat(orderStatus(init.orderId())).isEqualTo(OrderStatus.PAYMENT_FAILED);
        assertThat(orderRepository.findById(init.orderId()).orElseThrow().getPaymentStatus())
                .isEqualTo(PaymentStatus.FAILED);
        assertThat(stock()).isEqualTo(INITIAL_STOCK); // released back
    }

    @Test
    void cancelReleasesReservedStock() {
        InitiateCheckoutResponse init = initiate(PaymentMethod.RAZORPAY);
        assertThat(stock()).isEqualTo(INITIAL_STOCK - QTY);

        saga.cancel(user, init.orderId());

        assertThat(orderStatus(init.orderId())).isEqualTo(OrderStatus.PAYMENT_FAILED);
        assertThat(stock()).isEqualTo(INITIAL_STOCK);
    }

    @Test
    void expiredPaymentIsSweptAndStockReleased() {
        InitiateCheckoutResponse init = initiate(PaymentMethod.RAZORPAY);
        // Backdate the order well beyond the payment window.
        jdbc.update("UPDATE orders SET created_at = ? WHERE id = ?",
                OffsetDateTime.ofInstant(Instant.now().minus(30, ChronoUnit.MINUTES), ZoneOffset.UTC),
                init.orderId());

        saga.sweepExpiredPayments();

        assertThat(orderStatus(init.orderId())).isEqualTo(OrderStatus.PAYMENT_FAILED);
        assertThat(stock()).isEqualTo(INITIAL_STOCK);
    }

    // ── Webhook reconciliation ────────────────────────────────────
    @Test
    void webhookCapturedConfirmsOrderIdempotently() {
        InitiateCheckoutResponse init = initiate(PaymentMethod.RAZORPAY);
        when(razorpayService.verifyWebhookSignature(anyString(), any())).thenReturn(true);

        String body = "{\"event\":\"payment.captured\",\"payload\":{\"payment\":{\"entity\":"
                + "{\"id\":\"pay_wh\",\"order_id\":\"order_TEST\"}}}}";

        saga.handleWebhook(body, "sig", "evt_1");
        assertThat(orderStatus(init.orderId())).isEqualTo(OrderStatus.CONFIRMED);
        assertThat(orderRepository.findById(init.orderId()).orElseThrow().getPaymentStatus())
                .isEqualTo(PaymentStatus.PAID);

        // Re-delivering the same event must not change anything.
        saga.handleWebhook(body, "sig", "evt_1");
        assertThat(orderStatus(init.orderId())).isEqualTo(OrderStatus.CONFIRMED);
    }
}
