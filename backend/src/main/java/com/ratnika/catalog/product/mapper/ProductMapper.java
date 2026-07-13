package com.ratnika.catalog.product.mapper;

import com.ratnika.catalog.product.dto.ProductDtos.ProductResponse;
import com.ratnika.catalog.product.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper
public interface ProductMapper {

    /** Public view — hides supplier & cost fields from customers. */
    @Named("public")
    @Mapping(target = "categoryId", source = "category.id")
    @Mapping(target = "categoryName", source = "category.name")
    @Mapping(target = "supplierName", ignore = true)
    @Mapping(target = "supplierUrl", ignore = true)
    @Mapping(target = "costPrice", ignore = true)
    ProductResponse toPublic(Product product);

    /** Admin view — includes dropshipping supplier & cost fields. */
    @Named("admin")
    @Mapping(target = "categoryId", source = "category.id")
    @Mapping(target = "categoryName", source = "category.name")
    ProductResponse toAdmin(Product product);
}
