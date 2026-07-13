package com.ratnika.catalog.review.controller;

import com.ratnika.catalog.review.dto.ReviewDtos.ReviewRequest;
import com.ratnika.catalog.review.dto.ReviewDtos.ReviewResponse;
import com.ratnika.catalog.review.service.ReviewService;
import com.ratnika.common.dto.ApiResponse;
import com.ratnika.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("${app.api-prefix}")
@RequiredArgsConstructor
@Tag(name = "Reviews", description = "Product ratings & reviews")
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/products/{productId}/reviews")
    @Operation(summary = "List approved reviews for a product")
    public ApiResponse<List<ReviewResponse>> forProduct(@PathVariable UUID productId) {
        return ApiResponse.success(reviewService.forProduct(productId));
    }

    @PostMapping("/products/{productId}/reviews")
    @Operation(summary = "Add a review (pending approval)")
    public ApiResponse<ReviewResponse> add(@AuthenticationPrincipal UserPrincipal principal,
                                           @PathVariable UUID productId,
                                           @Valid @RequestBody ReviewRequest request) {
        return ApiResponse.success("Review submitted", reviewService.add(principal.getUser(), productId, request));
    }

    @PutMapping("/reviews/{reviewId}")
    @Operation(summary = "Edit my review")
    public ApiResponse<ReviewResponse> update(@AuthenticationPrincipal UserPrincipal principal,
                                              @PathVariable UUID reviewId,
                                              @Valid @RequestBody ReviewRequest request) {
        return ApiResponse.success("Review updated", reviewService.update(principal.getUser(), reviewId, request));
    }

    @DeleteMapping("/reviews/{reviewId}")
    @Operation(summary = "Delete my review")
    public ApiResponse<Void> delete(@AuthenticationPrincipal UserPrincipal principal,
                                    @PathVariable UUID reviewId) {
        reviewService.delete(principal.getUser(), reviewId);
        return ApiResponse.success("Review deleted", null);
    }

    @GetMapping("/reviews/mine")
    @Operation(summary = "List my reviews")
    public ApiResponse<List<ReviewResponse>> mine(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.success(reviewService.myReviews(principal.getUser()));
    }
}
