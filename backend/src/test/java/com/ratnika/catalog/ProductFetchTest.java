package com.ratnika.catalog;

import com.ratnika.catalog.category.entity.Category;
import com.ratnika.catalog.category.repository.CategoryRepository;
import com.ratnika.catalog.product.dto.ProductDtos.ProductResponse;
import com.ratnika.catalog.product.entity.Material;
import com.ratnika.catalog.product.entity.Occasion;
import com.ratnika.catalog.product.entity.Product;
import com.ratnika.catalog.product.entity.ProductAttributes;
import com.ratnika.catalog.product.entity.ProductImage;
import com.ratnika.catalog.product.entity.ProductVariant;
import com.ratnika.catalog.product.repository.ProductRepository;
import com.ratnika.catalog.product.service.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Guards against the Hibernate MultipleBagFetchException that occurred when a
 * product carrying both images and variants was loaded via findWithDetailsById.
 */
@SpringBootTest
@ActiveProfiles("test")
class ProductFetchTest {

    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private ProductService productService;

    @Test
    void loadsProductWithImagesAndVariants() {
        Category category = categoryRepository.save(Category.builder()
                .name("Rings").slug("rings-fetch-test").active(true).sortOrder(1).build());

        Product product = Product.builder()
                .name("Test Ring").slug("test-ring-fetch")
                .description("A ring with images and variants")
                .category(category)
                .price(BigDecimal.valueOf(999)).mrp(BigDecimal.valueOf(1299))
                .sku("VC-TEST-1").stock(10)
                .attributes(ProductAttributes.builder()
                        .material(Material.GOLD_PLATED).occasion(Occasion.FESTIVE)
                        .color("Gold").weightGrams(3).build())
                .active(true)
                .build();
        product.addImage(ProductImage.builder().url("img1").altText("v1").sortOrder(0).build());
        product.addImage(ProductImage.builder().url("img2").altText("v2").sortOrder(1).build());
        product.addVariant(ProductVariant.builder().name("Size").value("16")
                .priceDelta(BigDecimal.ZERO).stock(5).sku("VC-TEST-1-S16").build());
        product.addVariant(ProductVariant.builder().name("Size").value("18")
                .priceDelta(BigDecimal.valueOf(40)).stock(3).sku("VC-TEST-1-S18").build());
        product = productRepository.save(product);

        // This is the path that previously threw MultipleBagFetchException.
        ProductResponse response = productService.getById(product.getId());

        assertThat(response.images()).hasSize(2);
        assertThat(response.variants()).hasSize(2);
    }
}
