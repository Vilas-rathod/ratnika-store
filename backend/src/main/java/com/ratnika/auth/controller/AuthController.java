package com.ratnika.auth.controller;

import com.ratnika.auth.dto.AuthRequests.ChangePasswordRequest;
import com.ratnika.auth.dto.AuthRequests.ForgotPasswordRequest;
import com.ratnika.auth.dto.AuthRequests.LoginRequest;
import com.ratnika.auth.dto.AuthRequests.RefreshRequest;
import com.ratnika.auth.dto.AuthRequests.RegisterRequest;
import com.ratnika.auth.dto.AuthRequests.ResendOtpRequest;
import com.ratnika.auth.dto.AuthRequests.ResetPasswordRequest;
import com.ratnika.auth.dto.AuthRequests.VerifyOtpRequest;
import com.ratnika.auth.dto.AuthResponse;
import com.ratnika.auth.dto.MessageResponse;
import com.ratnika.auth.dto.TokenResponse;
import com.ratnika.auth.service.AuthService;
import com.ratnika.common.dto.ApiResponse;
import com.ratnika.security.UserPrincipal;
import com.ratnika.user.dto.UserResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${app.api-prefix}/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Registration, login, tokens, OTP & password flows")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register a new customer")
    public ApiResponse<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ApiResponse.success("Registration successful", authService.register(request));
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate and receive tokens")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.success("Login successful", authService.login(request));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Rotate refresh token and issue a new access token")
    public ApiResponse<TokenResponse> refresh(@Valid @RequestBody RefreshRequest request) {
        return ApiResponse.success(authService.refresh(request.refreshToken()));
    }

    @PostMapping("/logout")
    @Operation(summary = "Revoke all refresh tokens for the current user")
    public ApiResponse<MessageResponse> logout(@AuthenticationPrincipal UserPrincipal principal) {
        if (principal != null) {
            authService.logout(principal.getUser());
        }
        return ApiResponse.success(new MessageResponse("Logged out"));
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Send a password-reset code")
    public ApiResponse<MessageResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request.email());
        return ApiResponse.success(new MessageResponse("If the email exists, a reset code has been sent."));
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password using an OTP")
    public ApiResponse<MessageResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ApiResponse.success(new MessageResponse("Password updated. You can now sign in."));
    }

    @PostMapping("/verify-otp")
    @Operation(summary = "Verify email using an OTP")
    public ApiResponse<UserResponse> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        return ApiResponse.success("Email verified", authService.verifyEmail(request.email(), request.otp()));
    }

    @PostMapping("/resend-otp")
    @Operation(summary = "Resend the email-verification OTP")
    public ApiResponse<MessageResponse> resendOtp(@Valid @RequestBody ResendOtpRequest request) {
        authService.resendOtp(request.email());
        return ApiResponse.success(new MessageResponse("Verification code sent."));
    }

    @PostMapping("/change-password")
    @Operation(summary = "Change password for the authenticated user")
    public ApiResponse<MessageResponse> changePassword(@AuthenticationPrincipal UserPrincipal principal,
                                                        @Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(principal.getUser(), request);
        return ApiResponse.success(new MessageResponse("Password changed successfully"));
    }
}
