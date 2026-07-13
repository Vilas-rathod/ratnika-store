package com.ratnika.admin.customer.service;

import com.ratnika.admin.customer.dto.AdminCustomerResponse;
import com.ratnika.common.exception.ResourceNotFoundException;
import com.ratnika.order.repository.OrderRepository;
import com.ratnika.user.entity.Role;
import com.ratnika.user.entity.User;
import com.ratnika.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminCustomerService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    @Transactional(readOnly = true)
    public List<AdminCustomerResponse> list() {
        return userRepository.findByRole(Role.CUSTOMER).stream()
                .sorted(Comparator.comparing(User::getCreatedAt).reversed())
                .map(u -> new AdminCustomerResponse(
                        u.getId(), u.getFirstName(), u.getLastName(), u.getEmail(), u.getPhone(),
                        u.getRole(), u.isEmailVerified(), u.isBlocked(), u.getCreatedAt(),
                        orderRepository.countByUser(u), orderRepository.sumSpentByUser(u)))
                .toList();
    }

    @Transactional
    public void setBlocked(UUID id, boolean blocked) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Customer", id));
        user.setBlocked(blocked);
        userRepository.save(user);
    }
}
