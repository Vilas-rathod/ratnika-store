package com.ratnika.payment.entity;

import com.ratnika.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Records every processed gateway webhook event id so re-delivered webhooks are
 * ignored (idempotency) — Razorpay may deliver the same event more than once.
 */
@Entity
@Table(name = "processed_webhook_events", indexes = {
        @Index(name = "idx_webhook_event_id", columnList = "eventId", unique = true)
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProcessedWebhookEvent extends BaseEntity {

    @Column(nullable = false, unique = true, length = 120)
    private String eventId;

    @Column(length = 60)
    private String eventType;
}
