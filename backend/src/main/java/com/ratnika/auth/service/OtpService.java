package com.ratnika.auth.service;

import com.ratnika.auth.entity.VerificationToken;
import com.ratnika.auth.entity.VerificationToken.Purpose;
import com.ratnika.auth.repository.VerificationTokenRepository;
import com.ratnika.config.props.AppProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final VerificationTokenRepository repository;
    private final AppProperties props;
    private final SecureRandom random = new SecureRandom();

    /** Generates and persists a fresh OTP for the given email + purpose. */
    @Transactional
    public String generate(String email, Purpose purpose) {
        repository.deleteAllForEmailAndPurpose(email, purpose);
        String code = randomCode(props.getOtp().getLength());
        VerificationToken token = VerificationToken.builder()
                .email(email.toLowerCase())
                .code(code)
                .purpose(purpose)
                .expiresAt(Instant.now().plus(props.getOtp().getExpirationMinutes(), ChronoUnit.MINUTES))
                .build();
        repository.save(token);
        return code;
    }

    /** Verifies an OTP and consumes it on success. */
    @Transactional
    public boolean verify(String email, String code, Purpose purpose) {
        return repository.findFirstByEmailIgnoreCaseAndPurposeOrderByCreatedAtDesc(email, purpose)
                .filter(t -> !t.isExpired())
                .filter(t -> t.getCode().equals(code))
                .map(t -> {
                    repository.deleteAllForEmailAndPurpose(email, purpose);
                    return true;
                })
                .orElse(false);
    }

    private String randomCode(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(random.nextInt(10));
        }
        return sb.toString();
    }
}
