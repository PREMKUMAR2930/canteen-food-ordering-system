package com.canteen.dto;

import java.math.BigDecimal;
import java.util.List;

public class DashboardStatsResponse {
    private long totalOrders;
    private long todayOrders;
    private BigDecimal totalRevenue;
    private BigDecimal todayRevenue;
    private long totalFoodItems;
    private long availableFoodItems;
    private long totalStudents;
    private List<OrderResponse> recentOrders;

    public DashboardStatsResponse() {
    }

    public DashboardStatsResponse(long totalOrders, long todayOrders, BigDecimal totalRevenue, BigDecimal todayRevenue, long totalFoodItems, long availableFoodItems, long totalStudents, List<OrderResponse> recentOrders) {
        this.totalOrders = totalOrders;
        this.todayOrders = todayOrders;
        this.totalRevenue = totalRevenue;
        this.todayRevenue = todayRevenue;
        this.totalFoodItems = totalFoodItems;
        this.availableFoodItems = availableFoodItems;
        this.totalStudents = totalStudents;
        this.recentOrders = recentOrders;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public long getTodayOrders() {
        return todayOrders;
    }

    public void setTodayOrders(long todayOrders) {
        this.todayOrders = todayOrders;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public BigDecimal getTodayRevenue() {
        return todayRevenue;
    }

    public void setTodayRevenue(BigDecimal todayRevenue) {
        this.todayRevenue = todayRevenue;
    }

    public long getTotalFoodItems() {
        return totalFoodItems;
    }

    public void setTotalFoodItems(long totalFoodItems) {
        this.totalFoodItems = totalFoodItems;
    }

    public long getAvailableFoodItems() {
        return availableFoodItems;
    }

    public void setAvailableFoodItems(long availableFoodItems) {
        this.availableFoodItems = availableFoodItems;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public List<OrderResponse> getRecentOrders() {
        return recentOrders;
    }

    public void setRecentOrders(List<OrderResponse> recentOrders) {
        this.recentOrders = recentOrders;
    }
}
