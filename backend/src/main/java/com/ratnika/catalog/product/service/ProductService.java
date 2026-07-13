package com.ratnika.catalog.product.service;

import com.ratnika.catalog.product.dto.ProductDtos.ProductResponse;
import com.ratnika.catalog.product.dto.ProductFilter;
import com.ratnika.catalog.product.entity.Product;
import com.ratnika.catalog.product.mapper.ProductMapper;
import com.ratnika.catalog.product.repository.ProductRepository;
import com.ratnika.catalog.product.repository.ProductSpecifications;
import com.ratnika.common.dto.PageResponse;
import com.ratnika.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @Transactional(readOnly = true)
    public PageResponse<ProductResponse> list(ProductFilter filter, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, resolveSort(filter.sort()));
        Specification<Product> spec = ProductSpecifications.withFilter(filter);
        Page<Product> result = productRepository.findAll(spec, pageable);
        return PageResponse.from(result, productMapper::toPublic);
    }

    @Transactional(readOnly = true)
    public ProductResponse getBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .filter(Product::isActive)
                .orElseThrow(() -> ResourceNotFoundException.of("Product", slug));
        return productMapper.toPublic(product);
    }

    @Transactional(readOnly = true)
    public ProductResponse getById(UUID id) {
        Product product = productRepository.findWithDetailsById(id)
                .filter(Product::isActive)
                .orElseThrow(() -> ResourceNotFoundException.of("Product", id));
        return productMapper.toPublic(product);
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> related(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Product", id));
        return productRepository
                .findTop8ByCategoryAndActiveTrueAndIdNot(product.getCategory(), product.getId())
                .stream().map(productMapper::toPublic).toList();
    }

    private Sort resolveSort(String sort) {
        return switch (sort == null ? "newest" : sort) {
            case "price_asc" -> Sort.by(Sort.Direction.ASC, "price");
            case "price_desc" -> Sort.by(Sort.Direction.DESC, "price");
            case "rating" -> Sort.by(Sort.Direction.DESC, "rating");
            case "popularity" -> Sort.by(Sort.Direction.DESC, "reviewCount");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };
    }
}
