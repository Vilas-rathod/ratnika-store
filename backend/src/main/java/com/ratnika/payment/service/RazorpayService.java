package com.ratnika.payment.service;

import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import com.ratnika.common.exception.BadRequestException;
import com.ratnika.config.props.AppProperties;
import com.ratnika.payment.dto.PaymentDtos.RazorpayOrderResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Razorpay integration. When {@code app.razorpay.enabled=false} (e.g. local dev
 * without live keys), it returns a mock order and accepts any signature so the
 * end-to-end checkout flow remains testable.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RazorpayService {

    private final AppProperties props;

    public RazorpayOrderResponse createOrder(BigDecimal amountInr) {
        long paise = amountInr.multiply(BigDecimal.valueOf(100)).longValueExact();
        AppProperties.Razorpay cfg = props.getRazorpay();

        if (!cfg.isEnabled()) {
            return new RazorpayOrderResponse("order_MOCK" + shortId(), paise, "INR", cfg.getKeyId());
        }
        try {
            RazorpayClient client = new RazorpayClient(cfg.getKeyId(), cfg.getKeySecret());
            JSONObject request = new JSONObject()
                    .put("amount", paise)
                    .put("currency", "INR")
                    .put("receipt", "rcpt_" + shortId());
            com.razorpay.Order order = client.orders.create(request);
            return new RazorpayOrderResponse(order.get("id"), paise, "INR", cfg.getKeyId());
        } catch (Exception e) {
            log.error("Razorpay order creation failed", e);
            throw new BadRequestException("Unable to initiate payment. Please try again.");
        }
    }

    /** Verifies the checkout callback signature (HMAC of orderId|paymentId). */
    public boolean verifySignature(String razorpayOrderId, String razorpayPaymentId, String signature) {
        AppProperties.Razorpay cfg = props.getRazorpay();
        if (!cfg.isEnabled()) {
            return true; // mock mode accepts
        }
        try {
            JSONObject attributes = new JSONObject()
                    .put("razorpay_order_id", razorpayOrderId)
                    .put("razorpay_payment_id", razorpayPaymentId)
                    .put("razorpay_signature", signature);
            return Utils.verifyPaymentSignature(attributes, cfg.getKeySecret());
        } catch (Exception e) {
            log.warn("Razorpay signature verification failed: {}", e.getMessage());
            return false;
        }
    }

    /** Verifies a webhook payload against the X-Razorpay-Signature header. */
    public boolean verifyWebhookSignature(String rawBody, String signature) {
        AppProperties.Razorpay cfg = props.getRazorpay();
        if (!cfg.isEnabled()) {
            return true; // mock mode accepts
        }
        try {
            String secret = cfg.getWebhookSecret() != null ? cfg.getWebhookSecret() : cfg.getKeySecret();
            return Utils.verifyWebhookSignature(rawBody, signature, secret);
        } catch (Exception e) {
            log.warn("Razorpay webhook signature verification failed: {}", e.getMessage());
            return false;
        }
    }

    /** Issues a refund for a captured payment. Returns the gateway refund id. */
    public String refund(String gatewayPaymentId, BigDecimal amountInr) {
        AppProperties.Razorpay cfg = props.getRazorpay();
        if (!cfg.isEnabled() || gatewayPaymentId == null) {
            return "rfnd_MOCK" + shortId();
        }
        try {
            RazorpayClient client = new RazorpayClient(cfg.getKeyId(), cfg.getKeySecret());
            long paise = amountInr.multiply(BigDecimal.valueOf(100)).longValueExact();
            JSONObject request = new JSONObject()
                    .put("payment_id", gatewayPaymentId)
                    .put("amount", paise);
            com.razorpay.Refund refund = client.refunds.create(request);
            return refund.get("id");
        } catch (Exception e) {
            log.error("Razorpay refund failed for payment {}", gatewayPaymentId, e);
            return null;
        }
    }

    private String shortId() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 14);
    }
}
