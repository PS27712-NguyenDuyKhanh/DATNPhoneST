package com.phonestore.dto;

import lombok.Data;

@Data
public class CreateProductRequest {

    private String name;

    private Double price;

    private String description;

    private Integer stock;

    private Long categoryId;

}