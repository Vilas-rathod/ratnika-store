package com.ratnika.catalog.category.service;

import com.ratnika.catalog.category.dto.CategoryDtos.CategoryRequest;
import com.ratnika.catalog.category.dto.CategoryDtos.CategoryResponse;
import com.ratnika.catalog.category.entity.Category;
import com.ratnika.catalog.category.repository.CategoryRepository;
import com.ratnika.catalog.product.repository.ProductRepository;
import com.ratnika.common.exception.BadRequestException;
import com.ratnika.common.exception.ResourceNotFoundException;
import com.ratnika.common.util.SlugUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    @Cacheable(value = "categories", key = "'active'")
    public List<CategoryResponse> listActive() {
        return categoryRepository.findByActiveTrueOrderBySortOrderAsc().stream()
                .map(c -> toResponse(c, productRepository.countByCategoryAndActiveTrue(c)))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> listAll() {
        return categoryRepository.findAllByOrderBySortOrderAsc().stream()
                .map(c -> toResponse(c, productRepository.countByCategory(c)))
                .toList();
    }

    @Transactional
    @CacheEvict(value = "categories", allEntries = true)
    public CategoryResponse create(CategoryRequest request) {
        String slug = SlugUtils.slugify(request.name());
        if (categoryRepository.existsBySlug(slug)) {
            throw new BadRequestException("A category with this name already exists");
        }
        Category category = Category.builder()
                .name(request.name())
                .slug(slug)
                .description(request.description())
                .imageUrl(request.imageUrl())
                .active(request.active() == null || request.active())
                .sortOrder((int) categoryRepository.count() + 1)
                .build();
        return toResponse(categoryRepository.save(category), 0);
    }

    @Transactional
    @CacheEvict(value = "categories", allEntries = true)
    public CategoryResponse update(UUID id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Category", id));
        category.setName(request.name());
        category.setSlug(SlugUtils.slugify(request.name()));
        category.setDescription(request.description());
        if (request.imageUrl() != null) category.setImageUrl(request.imageUrl());
        if (request.active() != null) category.setActive(request.active());
        return toResponse(categoryRepository.save(category),
                productRepository.countByCategory(category));
    }

    @Transactional
    @CacheEvict(value = "categories", allEntries = true)
    public void delete(UUID id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Category", id));
        if (productRepository.existsByCategory(category)) {
            throw new BadRequestException("Cannot delete a category that has products");
        }
        categoryRepository.delete(category);
    }

    private CategoryResponse toResponse(Category c, long productCount) {
        return new CategoryResponse(c.getId(), c.getName(), c.getSlug(), c.getDescription(),
                c.getImageUrl(), c.isActive(), c.getSortOrder(), productCount);
    }
}
