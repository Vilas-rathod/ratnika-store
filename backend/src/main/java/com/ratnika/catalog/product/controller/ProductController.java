package com.ratnika.catalog.product.controller;

import com.ratnika.catalog.product.dto.ProductDtos.ProductResponse;
import com.ratnika.catalog.product.dto.ProductFilter;
import com.ratnika.catalog.product.entity.Material;
import com.ratnika.catalog.product.entity.Occasion;
import com.ratnika.catalog.product.service.ProductService;
import com.ratnika.common.dto.ApiResponse;
import com.ratnika.common.dto.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("${app.api-prefix}/products")
@RequiredArgsConstructor
@Tag(name = "Products", description = "Public product catalogue with search, filter & sort")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    @Operation(summary = "List products with filters and pagination")
    public ApiResponse<PageResponse<ProductResponse>> list(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String category,
            @RequestParam(name = "material", required = false) List<Material> materials,
            @RequestParam(name = "occasion", required = false) List<Occasion> occasions,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false, defaultValue = "newest") String sort,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(required = false) Boolean trending,
            @RequestParam(required = false) Boolean bestSeller,
            @RequestParam(required = false) Boolean newArrival,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        ProductFilter filter = new ProductFilter(q, category, materials, occasions,
                minPrice, maxPrice, sort, featured, trending, bestSeller, newArrival);
        return ApiResponse.success(productService.list(filter, page, size));
    }

    @GetMapping("/slug/{slug}")
    @Operation(summary = "Get a product by slug")
    public ApiResponse<ProductResponse> getBySlug(@PathVariable String slug) {
        return ApiResponse.success(productService.getBySlug(slug));
    }

    @GetMapping("/{id}/related")
    @Operation(summary = "Get related products in the same category")
    public ApiResponse<List<ProductResponse>> related(@PathVariable UUID id) {
        return ApiResponse.success(productService.related(id));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a product by id")
    public ApiResponse<ProductResponse> getById(@PathVariable UUID id) {
        return ApiResponse.success(productService.getById(id));
    }
}
