package com.ratnika.coupon;

import com.ratnika.common.exception.BadRequestException;
import com.ratnika.coupon.entity.Coupon;
import com.ratnika.coupon.repository.CouponRepository;
import com.ratnika.coupon.service.CouponService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CouponServiceTest {

    @Mock
    private CouponRepository couponRepository;

    @InjectMocks
    private CouponService couponService;

    private Coupon percentCoupon(int value, Integer maxDiscount, long minOrder) {
        return Coupon.builder()
                .code("SAVE").description("test").type(Coupon.Type.PERCENT)
                .value(BigDecimal.valueOf(value))
                .maxDiscount(maxDiscount == null ? null : BigDecimal.valueOf(maxDiscount))
                .minOrderAmount(BigDecimal.valueOf(minOrder))
                .expiresAt(Instant.now().plus(1, ChronoUnit.DAYS))
                .usageLimit(100).usedCount(0).active(true).build();
    }

    @Test
    void computesPercentDiscountWithinCap() {
        Coupon coupon = percentCoupon(15, 300, 799);
        BigDecimal discount = couponService.computeDiscount(coupon, BigDecimal.valueOf(1000));
        assertThat(discount).isEqualByComparingTo("150");
    }

    @Test
    void capsPercentDiscountAtMax() {
        Coupon coupon = percentCoupon(15, 300, 799);
        BigDecimal discount = couponService.computeDiscount(coupon, BigDecimal.valueOf(5000));
        assertThat(discount).isEqualByComparingTo("300");
    }

    @Test
    void flatDiscountNeverExceedsSubtotal() {
        Coupon coupon = Coupon.builder()
                .code("FLAT").description("t").type(Coupon.Type.FLAT)
                .value(BigDecimal.valueOf(500)).minOrderAmount(BigDecimal.ZERO)
                .expiresAt(Instant.now().plus(1, ChronoUnit.DAYS))
                .usageLimit(100).usedCount(0).active(true).build();
        BigDecimal discount = couponService.computeDiscount(coupon, BigDecimal.valueOf(300));
        assertThat(discount).isEqualByComparingTo("300");
    }

    @Test
    void rejectsWhenBelowMinimumOrder() {
        when(couponRepository.findByCodeIgnoreCase("SAVE"))
                .thenReturn(Optional.of(percentCoupon(15, 300, 799)));
        assertThatThrownBy(() -> couponService.validate("SAVE", BigDecimal.valueOf(500)))
                .isInstanceOf(BadRequestException.class);
    }
}
