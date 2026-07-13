package com.ratnika.auth.service;

import com.ratnika.auth.dto.AuthRequests.ChangePasswordRequest;
import com.ratnika.auth.dto.AuthRequests.LoginRequest;
import com.ratnika.auth.dto.AuthRequests.RegisterRequest;
import com.ratnika.auth.dto.AuthRequests.ResetPasswordRequest;
import com.ratnika.auth.dto.AuthResponse;
import com.ratnika.auth.dto.TokenResponse;
import com.ratnika.auth.entity.VerificationToken.Purpose;
import com.ratnika.common.exception.BadRequestException;
import com.ratnika.common.exception.ConflictException;
import com.ratnika.common.exception.UnauthorizedException;
import com.ratnika.notification.NotificationService;
import com.ratnika.user.dto.UserResponse;
import com.ratnika.user.entity.Role;
import com.ratnika.user.entity.User;
import com.ratnika.user.mapper.UserMapper;
import com.ratnika.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;
    private final OtpService otpService;
    private final NotificationService notificationService;
    private final UserMapper userMapper;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.email())) {
            throw new ConflictException("An account with this email already exists");
        }
        User user = User.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .email(request.email().toLowerCase())
                .phone(request.phone())
                .password(passwordEncoder.encode(request.password()))
                .role(Role.CUSTOMER)
                .emailVerified(false)
                .blocked(false)
                .build();
        user = userRepository.save(user);

        String otp = otpService.generate(user.getEmail(), Purpose.EMAIL_VERIFICATION);
        notificationService.sendOtp(user.getEmail(), "email verification", otp);

        TokenResponse tokens = tokenService.issue(user);
        return new AuthResponse(userMapper.toResponse(user), tokens);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmailIgnoreCase(request.email())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));
        if (user.isBlocked()) {
            throw new UnauthorizedException("Your account has been blocked");
        }
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));

        TokenResponse tokens = tokenService.issue(user);
        return new AuthResponse(userMapper.toResponse(user), tokens);
    }

    @Transactional
    public TokenResponse refresh(String refreshToken) {
        return tokenService.rotate(refreshToken);
    }

    @Transactional
    public void logout(User user) {
        tokenService.revokeAll(user);
    }

    @Transactional
    public void forgotPassword(String email) {
        // Always respond success to avoid leaking which emails are registered.
        userRepository.findByEmailIgnoreCase(email).ifPresent(user -> {
            String otp = otpService.generate(user.getEmail(), Purpose.PASSWORD_RESET);
            notificationService.sendOtp(user.getEmail(), "password reset", otp);
        });
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByEmailIgnoreCase(request.email())
                .orElseThrow(() -> new BadRequestException("Invalid or expired reset code"));
        if (!otpService.verify(user.getEmail(), request.otp(), Purpose.PASSWORD_RESET)) {
            throw new BadRequestException("Invalid or expired reset code");
        }
        user.setPassword(passwordEncoder.encode(request.password()));
        userRepository.save(user);
        tokenService.revokeAll(user);
    }

    @Transactional
    public UserResponse verifyEmail(String email, String otp) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new BadRequestException("Invalid verification code"));
        if (!otpService.verify(user.getEmail(), otp, Purpose.EMAIL_VERIFICATION)) {
            throw new BadRequestException("Invalid verification code");
        }
        user.setEmailVerified(true);
        return userMapper.toResponse(userRepository.save(user));
    }

    @Transactional
    public void resendOtp(String email) {
        userRepository.findByEmailIgnoreCase(email).ifPresent(user -> {
            String otp = otpService.generate(user.getEmail(), Purpose.EMAIL_VERIFICATION);
            notificationService.sendOtp(user.getEmail(), "email verification", otp);
        });
    }

    @Transactional
    public void changePassword(User user, ChangePasswordRequest request) {
        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }
}
