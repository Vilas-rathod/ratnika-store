package com.ratnika.admin.catalog;

import com.ratnika.catalog.review.dto.ReviewDtos.ReviewResponse;
import com.ratnika.catalog.review.service.ReviewService;
import com.ratnika.common.dto.ApiResponse;
import com.ratnika.security.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("${app.api-prefix}/admin/reviews")
@RequiredArgsConstructor
@Tag(name = "Admin · Reviews", description = "Review moderation")
public class AdminReviewController {

    private final ReviewService reviewService;

    public record ApproveRequest(@NotNull Boolean approved) {
    }

    @GetMapping
    @Operation(summary = "List all reviews")
    public ApiResponse<List<ReviewResponse>> list() {
        return ApiResponse.success(reviewService.listAll());
    }

    @PutMapping("/{id}/approve")
    @Operation(summary = "Approve or unpublish a review")
    public ApiResponse<ReviewResponse> approve(@PathVariable UUID id, @RequestBody ApproveRequest request) {
        boolean approved = request.approved() == null || request.approved();
        return ApiResponse.success(reviewService.approve(id, approved));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a review")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        reviewService.delete(SecurityUtils.currentUser(), id);
        return ApiResponse.success("Review deleted", null);
    }
}
