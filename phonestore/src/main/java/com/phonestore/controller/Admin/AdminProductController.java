package com.phonestore.controller.Admin;

import com.phonestore.dto.CreateProductImageRequest;
import com.phonestore.dto.CreateProductRequest;
import com.phonestore.entity.Category;
import com.phonestore.entity.Product;
import com.phonestore.entity.ProductImage;
import com.phonestore.repository.CategoryRepository;
import com.phonestore.repository.ProductImageRepository;
import com.phonestore.repository.ProductRepository;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api/admin/products")
@CrossOrigin
public class AdminProductController {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductImageRepository productImageRepository;

    public AdminProductController(ProductRepository productRepository,
                                  CategoryRepository categoryRepository,
                                  ProductImageRepository productImageRepository) {

        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.productImageRepository = productImageRepository;
    }

    // tạo sản phẩm
    @PostMapping
    public Product create(@RequestBody CreateProductRequest request){

        Category category = categoryRepository
                .findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Product product = new Product();

        product.setName(request.getName());
        product.setPrice(request.getPrice());
        product.setDescription(request.getDescription());
        product.setStock(request.getStock());
        product.setCategory(category);

        return productRepository.save(product);
    }

    // lấy danh sách
    @GetMapping
    public List<Product> getAll(){
        return productRepository.findAll();
    }

    // xóa
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        productRepository.deleteById(id);
    }

    @PostMapping("/{id}/images")
    public ProductImage addImage(@PathVariable Long id,
                                 @RequestBody CreateProductImageRequest request) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        ProductImage image = new ProductImage();

        image.setColor(request.getColor());
        image.setImageUrl(request.getImageUrl());
        image.setProduct(product);

        return productImageRepository.save(image);
    }

}