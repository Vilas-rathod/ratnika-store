package com.ratnika.catalog.review.service;

import com.ratnika.catalog.product.entity.Product;
import com.ratnika.catalog.product.repository.ProductRepository;
import com.ratnika.catalog.review.dto.ReviewDtos.ReviewRequest;
import com.ratnika.catalog.review.dto.ReviewDtos.ReviewResponse;
import com.ratnika.catalog.review.entity.Review;
import com.ratnika.catalog.review.repository.ReviewRepository;
import com.ratnika.common.exception.ResourceNotFoundException;
import com.ratnika.common.exception.UnauthorizedException;
import com.ratnika.user.entity.Role;
import com.ratnika.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public List<ReviewResponse> forProduct(UUID productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> ResourceNotFoundException.of("Product", productId));
        return reviewRepository.findByProductAndApprovedTrueOrderByCreatedAtDesc(product)
                .stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> myReviews(User user) {
        return reviewRepository.findByUserOrderByCreatedAtDesc(user)
                .stream().map(this::toResponse).toList();
    }

    // ── Admin ─────────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public List<ReviewResponse> listAll() {
        return reviewRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public ReviewResponse approve(UUID reviewId, boolean approved) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> ResourceNotFoundException.of("Review", reviewId));
        review.setApproved(approved);
        review = reviewRepository.save(review);
        recomputeRating(review.getProduct());
        return toResponse(review);
    }

    @Transactional
    public ReviewResponse add(User user, UUID productId, ReviewRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> ResourceNotFoundException.of("Product", productId));
        Review review = Review.builder()
                .product(product)
                .user(user)
                .userName(user.fullName())
                .productName(product.getName())
                .rating(request.rating())
                .title(request.title())
                .comment(request.comment())
                .approved(false)   // requires admin approval
                .build();
        review = reviewRepository.save(review);
        recomputeRating(product);
        return toResponse(review);
    }

    @Transactional
    public ReviewResponse update(User user, UUID reviewId, ReviewRequest request) {
        Review review = reviewRepository.findByIdAndUser(reviewId, user)
                .orElseThrow(() -> ResourceNotFoundException.of("Review", reviewId));
        review.setRating(request.rating());
        review.setTitle(request.title());
        review.setComment(request.comment());
        review.setApproved(false);
        review = reviewRepository.save(review);
        recomputeRating(review.getProduct());
        return toResponse(review);
    }

    @Transactional
    public void delete(User user, UUID reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> ResourceNotFoundException.of("Review", reviewId));
        if (!review.getUser().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Not allowed to delete this review");
        }
        Product product = review.getProduct();
        reviewRepository.delete(review);
        recomputeRating(product);
    }

    /** Recompute the denormalised rating & count from approved reviews. */
    @Transactional
    public void recomputeRating(Product product) {
        List<Review> approved = reviewRepository.findByProductAndApprovedTrue(product);
        int count = approved.size();
        double avg = count == 0 ? 0
                : Math.round(approved.stream().mapToInt(Review::getRating).average().orElse(0) * 10.0) / 10.0;
        product.setReviewCount(count);
        product.setRating(avg);
        productRepository.save(product);
    }

    private ReviewResponse toResponse(Review r) {
        return new ReviewResponse(r.getId(), r.getProduct().getId(), r.getProductName(),
                r.getUser().getId(), r.getUserName(), r.getRating(), r.getTitle(),
                r.getComment(), r.isApproved(), r.getCreatedAt());
    }
}
