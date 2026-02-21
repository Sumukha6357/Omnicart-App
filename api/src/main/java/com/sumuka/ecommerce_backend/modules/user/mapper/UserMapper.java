package com.sumuka.ecommerce_backend.modules.user.mapper;

import com.sumuka.ecommerce_backend.dto.response.UserResponse;
import com.sumuka.ecommerce_backend.modules.user.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    UserResponse toDto(User user);
}
