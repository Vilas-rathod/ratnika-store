package com.ratnika.order.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Embeddable
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderTimelineEvent {

    @Enumerated(EnumType.STRING)
    @Column(name = "event_status", length = 30, nullable = false)
    private OrderStatus status;

    @Column(name = "event_note", length = 300)
    private String note;

    @Column(name = "event_at", nullable = false)
    private Instant at;
}
