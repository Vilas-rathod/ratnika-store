package com.ratnika.user.service;

import com.ratnika.common.exception.ResourceNotFoundException;
import com.ratnika.user.dto.UpdateProfileRequest;
import com.ratnika.user.dto.UserResponse;
import com.ratnika.user.entity.User;
import com.ratnika.user.mapper.UserMapper;
import com.ratnika.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Transactional(readOnly = true)
    public UserResponse getProfile(User user) {
        return userMapper.toResponse(user);
    }

    @Transactional
    public UserResponse updateProfile(UUID userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> ResourceNotFoundException.of("User", userId));
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setPhone(request.phone());
        return userMapper.toResponse(userRepository.save(user));
    }
}
