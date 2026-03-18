package com.sumuka.ecommerce_backend.modules.procurement.mapper;

import com.sumuka.ecommerce_backend.dto.response.ProductResponse;
import com.sumuka.ecommerce_backend.modules.procurement.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(source = "seller.name", target = "sellerName")
    @Mapping(source = "category.name", target = "categoryName")
    @Mapping(source = "createdAt", target = "createdAt")
    ProductResponse toDto(Product product);
}
