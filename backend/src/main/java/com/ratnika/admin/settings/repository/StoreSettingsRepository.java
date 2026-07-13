package com.ratnika.admin.settings.repository;

import com.ratnika.admin.settings.entity.StoreSettings;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface StoreSettingsRepository extends JpaRepository<StoreSettings, UUID> {

    Optional<StoreSettings> findFirstByOrderByCreatedAtAsc();
}
