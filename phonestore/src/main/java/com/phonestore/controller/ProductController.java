package com.phonestore.controller;

import com.phonestore.dto.ProductDTO;
import com.phonestore.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public List<ProductDTO> getAll(){
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public ProductDTO getById(@PathVariable Long id){
        return productService.getProduct(id);
    }

}