package com.ratnika.admin.product.service;

import com.ratnika.admin.product.dto.ProductInput.CreateOrUpdate;
import com.ratnika.admin.product.dto.ProductInput.VariantInput;
import com.ratnika.catalog.category.entity.Category;
import com.ratnika.catalog.category.repository.CategoryRepository;
import com.ratnika.catalog.product.dto.ProductDtos.ProductResponse;
import com.ratnika.catalog.product.entity.Product;
import com.ratnika.catalog.product.entity.ProductAttributes;
import com.ratnika.catalog.product.entity.ProductImage;
import com.ratnika.catalog.product.entity.ProductVariant;
import com.ratnika.catalog.product.mapper.ProductMapper;
import com.ratnika.catalog.product.repository.ProductRepository;
import com.ratnika.common.dto.PageResponse;
import com.ratnika.common.exception.ResourceNotFoundException;
import com.ratnika.common.util.SlugUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;

    @Transactional(readOnly = true)
    public PageResponse<ProductResponse> list(String q, int page, int size) {
        var pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Specification<Product> spec = (root, query, cb) -> {
            if (q == null || q.isBlank()) return cb.conjunction();
            String like = "%" + q.toLowerCase() + "%";
            return cb.or(cb.like(cb.lower(root.get("name")), like),
                    cb.like(cb.lower(root.get("sku")), like));
        };
        Page<Product> result = productRepository.findAll(spec, pageable);
        return PageResponse.from(result, productMapper::toAdmin);
    }

    @Transactional
    public ProductResponse create(CreateOrUpdate input) {
        Category category = categoryRepository.findById(input.categoryId())
                .orElseThrow(() -> ResourceNotFoundException.of("Category", input.categoryId()));

        Product product = Product.builder()
                .name(input.name())
                .slug(SlugUtils.uniqueSlug(input.name()))
                .description(input.description())
                .category(category)
                .price(input.price())
                .mrp(input.mrp())
                .sku(input.sku() != null ? input.sku() : "VC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .stock(input.stock())
                .attributes(toAttributes(input))
                .featured(input.featured())
                .trending(input.trending())
                .bestSeller(input.bestSeller())
                .newArrival(input.newArrival())
                .active(input.active())
                .supplierName(input.supplierName())
                .supplierUrl(input.supplierUrl())
                .costPrice(input.costPrice())
                .build();

        applyImages(product, input);
        applyVariants(product, input);

        return productMapper.toAdmin(productRepository.save(product));
    }

    @Transactional
    public ProductResponse update(UUID id, CreateOrUpdate input) {
        Product product = productRepository.findWithDetailsById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Product", id));
        if (input.categoryId() != null) {
            Category category = categoryRepository.findById(input.categoryId())
                    .orElseThrow(() -> ResourceNotFoundException.of("Category", input.categoryId()));
            product.setCategory(category);
        }
        product.setName(input.name());
        product.setDescription(input.description());
        product.setPrice(input.price());
        product.setMrp(input.mrp());
        if (input.sku() != null) product.setSku(input.sku());
        product.setStock(input.stock());
        product.setAttributes(toAttributes(input));
        product.setFeatured(input.featured());
        product.setTrending(input.trending());
        product.setBestSeller(input.bestSeller());
        product.setNewArrival(input.newArrival());
        product.setActive(input.active());
        product.setSupplierName(input.supplierName());
        product.setSupplierUrl(input.supplierUrl());
        product.setCostPrice(input.costPrice());

        if (input.images() != null && !input.images().isEmpty()) {
            product.getImages().clear();
            applyImages(product, input);
        }
        return productMapper.toAdmin(productRepository.save(product));
    }

    @Transactional
    public void delete(UUID id) {
        if (!productRepository.existsById(id)) {
            throw ResourceNotFoundException.of("Product", id);
        }
        productRepository.deleteById(id);
    }

    private ProductAttributes toAttributes(CreateOrUpdate input) {
        var a = input.attributes();
        return ProductAttributes.builder()
                .material(a.material())
                .stoneType(a.stoneType())
                .weightGrams(a.weightGrams())
                .color(a.color())
                .occasion(a.occasion())
                .build();
    }

    private void applyImages(Product product, CreateOrUpdate input) {
        if (input.images() == null) return;
        int order = 0;
        for (String url : input.images()) {
            product.addImage(ProductImage.builder()
                    .url(url).altText(product.getName()).sortOrder(order++).build());
        }
    }

    private void applyVariants(Product product, CreateOrUpdate input) {
        if (input.variants() == null) return;
        for (VariantInput v : input.variants()) {
            product.addVariant(ProductVariant.builder()
                    .name(v.name()).value(v.value())
                    .priceDelta(v.priceDelta() == null ? BigDecimal.ZERO : v.priceDelta())
                    .stock(v.stock()).sku(v.sku()).build());
        }
    }
}
