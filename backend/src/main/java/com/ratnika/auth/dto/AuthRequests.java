package com.ratnika.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Auth request payloads grouped together for cohesion.
 */
public final class AuthRequests {

    private AuthRequests() {
    }

    public record RegisterRequest(
            @NotBlank @Size(min = 2, max = 60) String firstName,
            @NotBlank @Size(max = 60) String lastName,
            @NotBlank @Email String email,
            @Pattern(regexp = "^[+]?[0-9\\s-]{10,15}$", message = "Enter a valid phone number") String phone,
            @NotBlank @Size(min = 8, message = "Password must be at least 8 characters") String password
    ) {
    }

    public record LoginRequest(
            @NotBlank @Email String email,
            @NotBlank String password
    ) {
    }

    public record RefreshRequest(
            @NotBlank String refreshToken
    ) {
    }

    public record ForgotPasswordRequest(
            @NotBlank @Email String email
    ) {
    }

    public record ResetPasswordRequest(
            @NotBlank @Email String email,
            @NotBlank String otp,
            @NotBlank @Size(min = 8) String password
    ) {
    }

    public record VerifyOtpRequest(
            @NotBlank @Email String email,
            @NotBlank String otp
    ) {
    }

    public record ResendOtpRequest(
            @NotBlank @Email String email
    ) {
    }

    public record ChangePasswordRequest(
            @NotBlank String currentPassword,
            @NotBlank @Size(min = 8) String newPassword
    ) {
    }
}
