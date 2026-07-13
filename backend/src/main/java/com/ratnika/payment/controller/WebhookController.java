package com.ratnika.payment.controller;

import com.ratnika.checkout.service.CheckoutSagaOrchestrator;
import com.ratnika.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Public Razorpay webhook receiver. Reads the RAW body (needed for signature
 * verification) and the signature + event-id headers. This is the authoritative,
 * idempotent source of payment truth. Configure the URL in the Razorpay
 * Dashboard → Webhooks with the same secret as app.razorpay.webhook-secret.
 */
@Slf4j
@RestController
@RequestMapping("${app.api-prefix}/payments/razorpay")
@RequiredArgsConstructor
@Tag(name = "Payments", description = "Razorpay webhook")
public class WebhookController {

    private final CheckoutSagaOrchestrator saga;

    @PostMapping("/webhook")
    @Operation(summary = "Razorpay webhook (public; signature-verified)")
    public ApiResponse<Void> webhook(
            @RequestBody String rawBody,
            @RequestHeader(value = "X-Razorpay-Signature", required = false) String signature,
            @RequestHeader(value = "X-Razorpay-Event-Id", required = false) String eventId) {
        saga.handleWebhook(rawBody, signature, eventId);
        return ApiResponse.success("ok", null);
    }
}
