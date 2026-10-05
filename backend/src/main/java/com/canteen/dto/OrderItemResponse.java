package com.canteen.dto;

import java.math.BigDecimal;

public class OrderItemResponse {
    private Long id;
    private Long foodItemId;
    private String foodName;
    private String imageUrl;
    private int quantity;
    private BigDecimal price;
    private BigDecimal subtotal;

    public OrderItemResponse() {
    }

    public OrderItemResponse(Long id, Long foodItemId, String foodName, String imageUrl, int quantity, BigDecimal price, BigDecimal subtotal) {
        this.id = id;
        this.foodItemId = foodItemId;
        this.foodName = foodName;
        this.imageUrl = imageUrl;
        this.quantity = quantity;
        this.price = price;
        this.subtotal = subtotal;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getFoodItemId() {
        return foodItemId;
    }

    public void setFoodItemId(Long foodItemId) {
        this.foodItemId = foodItemId;
    }

    public String getFoodName() {
        return foodName;
    }

    public void setFoodName(String foodName) {
        this.foodName = foodName;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }
}
