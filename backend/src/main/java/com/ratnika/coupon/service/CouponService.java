package com.ratnika.coupon.service;

import com.ratnika.common.exception.BadRequestException;
import com.ratnika.common.exception.ResourceNotFoundException;
import com.ratnika.coupon.dto.CouponDtos.CouponRequest;
import com.ratnika.coupon.dto.CouponDtos.CouponResponse;
import com.ratnika.coupon.dto.CouponDtos.CouponValidationResponse;
import com.ratnika.coupon.entity.Coupon;
import com.ratnika.coupon.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;

    /** Validate a coupon against a cart subtotal and compute the discount. */
    @Transactional(readOnly = true)
    public CouponValidationResponse validate(String code, BigDecimal subtotal) {
        Coupon coupon = couponRepository.findByCodeIgnoreCase(code)
                .filter(Coupon::isActive)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid coupon code"));
        if (coupon.isExpired()) {
            throw new BadRequestException("This coupon has expired");
        }
        if (coupon.getUsedCount() >= coupon.getUsageLimit()) {
            throw new BadRequestException("This coupon has reached its usage limit");
        }
        if (subtotal.compareTo(coupon.getMinOrderAmount()) < 0) {
            BigDecimal gap = coupon.getMinOrderAmount().subtract(subtotal);
            throw new BadRequestException("Add items worth ₹" + gap.setScale(0, RoundingMode.CEILING)
                    + " more to use this coupon");
        }
        return new CouponValidationResponse(toResponse(coupon), computeDiscount(coupon, subtotal));
    }

    public BigDecimal computeDiscount(Coupon coupon, BigDecimal subtotal) {
        BigDecimal discount;
        if (coupon.getType() == Coupon.Type.PERCENT) {
            discount = subtotal.multiply(coupon.getValue())
                    .divide(BigDecimal.valueOf(100), 0, RoundingMode.HALF_UP);
            if (coupon.getMaxDiscount() != null && discount.compareTo(coupon.getMaxDiscount()) > 0) {
                discount = coupon.getMaxDiscount();
            }
        } else {
            discount = coupon.getValue();
        }
        return discount.min(subtotal);
    }

    // ── Admin operations ──────────────────────────────────────────
    @Transactional(readOnly = true)
    public List<CouponResponse> listAll() {
        return couponRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional
    public CouponResponse create(CouponRequest request) {
        String code = request.code().toUpperCase();
        if (couponRepository.existsByCodeIgnoreCase(code)) {
            throw new BadRequestException("A coupon with this code already exists");
        }
        Coupon coupon = Coupon.builder()
                .code(code)
                .description(request.description())
                .type(request.type())
                .value(request.value())
                .minOrderAmount(request.minOrderAmount() == null ? BigDecimal.ZERO : request.minOrderAmount())
                .maxDiscount(request.maxDiscount())
                .expiresAt(request.expiresAt())
                .usageLimit(request.usageLimit())
                .usedCount(0)
                .active(request.active() == null || request.active())
                .build();
        return toResponse(couponRepository.save(coupon));
    }

    @Transactional
    public CouponResponse update(UUID id, CouponRequest request) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Coupon", id));
        coupon.setCode(request.code().toUpperCase());
        coupon.setDescription(request.description());
        coupon.setType(request.type());
        coupon.setValue(request.value());
        coupon.setMinOrderAmount(request.minOrderAmount() == null ? BigDecimal.ZERO : request.minOrderAmount());
        coupon.setMaxDiscount(request.maxDiscount());
        coupon.setExpiresAt(request.expiresAt());
        coupon.setUsageLimit(request.usageLimit());
        if (request.active() != null) coupon.setActive(request.active());
        return toResponse(couponRepository.save(coupon));
    }

    @Transactional
    public void delete(UUID id) {
        couponRepository.deleteById(id);
    }

    public CouponResponse toResponse(Coupon c) {
        return new CouponResponse(c.getId(), c.getCode(), c.getDescription(), c.getType(),
                c.getValue(), c.getMinOrderAmount(), c.getMaxDiscount(), c.getExpiresAt(),
                c.getUsageLimit(), c.getUsedCount(), c.isActive());
    }
}
