package com.ratnika.notification;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Delivers transactional notifications (OTP codes, order updates).
 *
 * Email sending has been removed for now — notifications are logged instead,
 * so OTP codes remain visible for local testing. To re-enable email, add
 * spring-boot-starter-mail and replace these log calls with a JavaMailSender.
 */
@Slf4j
@Service
public class NotificationService {

    public void sendOtp(String to, String purpose, String code) {
        log.info("[OTP] {} code for {} → {}", purpose, to, code);
    }

    public void sendOrderConfirmation(String to, String customerName, String orderNumber, String total) {
        log.info("[ORDER] Confirmation for {} ({}) — order {} total {}", customerName, to, orderNumber, total);
    }

    public void sendOrderStatusUpdate(String to, String orderNumber, String status) {
        log.info("[ORDER] {} status update for {} → {}", orderNumber, to, status);
    }
}
