package com.ratnika.address.service;

import com.ratnika.address.dto.AddressRequest;
import com.ratnika.address.dto.AddressResponse;
import com.ratnika.address.entity.Address;
import com.ratnika.address.mapper.AddressMapper;
import com.ratnika.address.repository.AddressRepository;
import com.ratnika.common.exception.ResourceNotFoundException;
import com.ratnika.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;
    private final AddressMapper addressMapper;

    @Transactional(readOnly = true)
    public List<AddressResponse> list(User user) {
        return addressRepository.findByUserOrderByIsDefaultDescCreatedAtDesc(user)
                .stream().map(addressMapper::toResponse).toList();
    }

    @Transactional
    public AddressResponse create(User user, AddressRequest request) {
        boolean makeDefault = Boolean.TRUE.equals(request.isDefault())
                || addressRepository.countByUser(user) == 0;
        if (makeDefault) {
            addressRepository.clearDefaultForUser(user);
        }
        Address address = Address.builder()
                .user(user)
                .fullName(request.fullName())
                .phone(request.phone())
                .line1(request.line1())
                .line2(request.line2())
                .city(request.city())
                .state(request.state())
                .pincode(request.pincode())
                .country(request.country() == null ? "India" : request.country())
                .type(request.type())
                .isDefault(makeDefault)
                .build();
        return addressMapper.toResponse(addressRepository.save(address));
    }

    @Transactional
    public AddressResponse update(User user, UUID id, AddressRequest request) {
        Address address = addressRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> ResourceNotFoundException.of("Address", id));
        if (Boolean.TRUE.equals(request.isDefault())) {
            addressRepository.clearDefaultForUser(user);
        }
        address.setFullName(request.fullName());
        address.setPhone(request.phone());
        address.setLine1(request.line1());
        address.setLine2(request.line2());
        address.setCity(request.city());
        address.setState(request.state());
        address.setPincode(request.pincode());
        address.setCountry(request.country() == null ? "India" : request.country());
        address.setType(request.type());
        address.setDefault(Boolean.TRUE.equals(request.isDefault()) || address.isDefault());
        return addressMapper.toResponse(addressRepository.save(address));
    }

    @Transactional
    public void delete(User user, UUID id) {
        Address address = addressRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> ResourceNotFoundException.of("Address", id));
        addressRepository.delete(address);
    }
}
