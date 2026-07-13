package com.ratnika.catalog.category.controller;

import com.ratnika.catalog.category.dto.CategoryDtos.CategoryResponse;
import com.ratnika.catalog.category.service.CategoryService;
import com.ratnika.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("${app.api-prefix}/categories")
@RequiredArgsConstructor
@Tag(name = "Categories", description = "Public category catalogue")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    @Operation(summary = "List active categories with product counts")
    public ApiResponse<List<CategoryResponse>> list() {
        return ApiResponse.success(categoryService.listActive());
    }
}
