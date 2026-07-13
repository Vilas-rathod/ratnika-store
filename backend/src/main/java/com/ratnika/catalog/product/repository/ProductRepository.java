package com.ratnika.catalog.product.repository;

import com.ratnika.catalog.category.entity.Category;
import com.ratnika.catalog.product.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID>, JpaSpecificationExecutor<Product> {

    @EntityGraph(attributePaths = {"images", "category"})
    Optional<Product> findBySlug(String slug);

    // Fetch only the "images" bag eagerly here. Fetching "variants" too would
    // join two bags at once → Hibernate MultipleBagFetchException. Variants are
    // loaded lazily on access inside the @Transactional service methods.
    @EntityGraph(attributePaths = {"images", "category"})
    Optional<Product> findWithDetailsById(UUID id);

    @EntityGraph(attributePaths = {"images", "category"})
    List<Product> findTop8ByCategoryAndActiveTrueAndIdNot(Category category, UUID id);

    long countByActiveTrue();

    long countByActiveTrueAndStockLessThan(int threshold);

    long countByCategory(Category category);

    long countByCategoryAndActiveTrue(Category category);

    boolean existsByCategory(Category category);
}
