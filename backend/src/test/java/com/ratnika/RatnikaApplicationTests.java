package com.ratnika;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * Smoke test: verifies the full Spring application context loads with all
 * beans wired (controllers, services, security, JPA) against H2.
 */
@SpringBootTest
@ActiveProfiles("test")
class RatnikaApplicationTests {

    @Test
    void contextLoads() {
    }
}
