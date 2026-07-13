package com.ratnika.bootstrap;

import com.ratnika.catalog.category.repository.CategoryRepository;
import com.ratnika.catalog.product.repository.ProductRepository;
import com.ratnika.coupon.repository.CouponRepository;
import com.ratnika.user.entity.Role;
import com.ratnika.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Verifies the DataSeeder populates a coherent demo dataset against H2
 * (enabling the seeder bean explicitly via app.seed.enabled=true).
 */
@SpringBootTest(properties = "app.seed.enabled=true")
@ActiveProfiles("test")
class DataSeederTest {

    @Autowired
    private DataSeeder dataSeeder;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private CouponRepository couponRepository;

    @Test
    void seedsCoherentDataset() {
        dataSeeder.run();

        assertThat(userRepository.count()).isEqualTo(3);
        assertThat(userRepository.countByRole(Role.ADMIN)).isEqualTo(1);
        assertThat(userRepository.findByEmailIgnoreCase("admin@ratnika.in")).isPresent();

        assertThat(categoryRepository.count()).isEqualTo(11);
        assertThat(productRepository.count()).isEqualTo(66); // 11 categories × 6
        assertThat(productRepository.countByActiveTrue()).isEqualTo(66);
        assertThat(couponRepository.findByCodeIgnoreCase("WELCOME15")).isPresent();

        // Idempotent: running again does not duplicate
        dataSeeder.run();
        assertThat(userRepository.count()).isEqualTo(3);
    }
}
