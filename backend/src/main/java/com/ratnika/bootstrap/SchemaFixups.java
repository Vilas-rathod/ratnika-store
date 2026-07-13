package com.ratnika.bootstrap;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * One-time, idempotent data fix-ups applied at startup.
 *
 * When {@code @Version} was introduced on Product, {@code ddl-auto=update} added
 * the {@code version} column as NULL for existing rows. Hibernate cannot
 * increment a NULL version (throws NullPointerException on the next update), so
 * we backfill NULLs to 0. Runs before request traffic and is a no-op once clean.
 * (In production, prefer a Flyway migration for this.)
 */
@Slf4j
@Component
@Order(0)
@RequiredArgsConstructor
public class SchemaFixups implements ApplicationRunner {

    private final JdbcTemplate jdbc;

    @Override
    public void run(ApplicationArguments args) {
        try {
            int fixed = jdbc.update("UPDATE products SET version = 0 WHERE version IS NULL");
            if (fixed > 0) {
                log.info("SchemaFixups: backfilled version=0 on {} product row(s).", fixed);
            }
        } catch (Exception e) {
            log.warn("SchemaFixups: version backfill skipped ({})", e.getMessage());
        }
    }
}
