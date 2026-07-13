package com.ratnika.catalog.review.repository;

import com.ratnika.catalog.product.entity.Product;
import com.ratnika.catalog.review.entity.Review;
import com.ratnika.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ReviewRepository extends JpaRepository<Review, UUID> {

    List<Review> findByProductAndApprovedTrueOrderByCreatedAtDesc(Product product);

    List<Review> findByProductAndApprovedTrue(Product product);

    List<Review> findByUserOrderByCreatedAtDesc(User user);

    List<Review> findAllByOrderByCreatedAtDesc();

    Optional<Review> findByIdAndUser(UUID id, User user);
}
