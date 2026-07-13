package com.ratnika.payment.repository;

import com.ratnika.payment.entity.ProcessedWebhookEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ProcessedWebhookEventRepository extends JpaRepository<ProcessedWebhookEvent, UUID> {

    boolean existsByEventId(String eventId);
}
