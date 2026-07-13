package com.ratnika.user.mapper;

import com.ratnika.user.dto.UserResponse;
import com.ratnika.user.entity.User;
import org.mapstruct.Mapper;

@Mapper
public interface UserMapper {

    UserResponse toResponse(User user);
}
