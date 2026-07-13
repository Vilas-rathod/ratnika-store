package com.ratnika.address.controller;

import com.ratnika.address.dto.AddressRequest;
import com.ratnika.address.dto.AddressResponse;
import com.ratnika.address.service.AddressService;
import com.ratnika.common.dto.ApiResponse;
import com.ratnika.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("${app.api-prefix}/addresses")
@RequiredArgsConstructor
@Tag(name = "Addresses", description = "Customer delivery addresses")
public class AddressController {

    private final AddressService addressService;

    @GetMapping
    @Operation(summary = "List my addresses")
    public ApiResponse<List<AddressResponse>> list(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.success(addressService.list(principal.getUser()));
    }

    @PostMapping
    @Operation(summary = "Add an address")
    public ApiResponse<AddressResponse> create(@AuthenticationPrincipal UserPrincipal principal,
                                               @Valid @RequestBody AddressRequest request) {
        return ApiResponse.success("Address added", addressService.create(principal.getUser(), request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an address")
    public ApiResponse<AddressResponse> update(@AuthenticationPrincipal UserPrincipal principal,
                                               @PathVariable UUID id,
                                               @Valid @RequestBody AddressRequest request) {
        return ApiResponse.success("Address updated", addressService.update(principal.getUser(), id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an address")
    public ApiResponse<Void> delete(@AuthenticationPrincipal UserPrincipal principal,
                                    @PathVariable UUID id) {
        addressService.delete(principal.getUser(), id);
        return ApiResponse.success("Address removed", null);
    }
}
