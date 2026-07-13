package com.ratnika.address.mapper;

import com.ratnika.address.dto.AddressResponse;
import com.ratnika.address.entity.Address;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper
public interface AddressMapper {

    @Mapping(target = "userId", source = "user.id")
    AddressResponse toResponse(Address address);
}
