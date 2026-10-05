package com.canteen.controller;

import com.canteen.dto.ApiResponse;
import com.canteen.dto.OrderRequest;
import com.canteen.dto.OrderResponse;
import com.canteen.dto.OrderStatusUpdateRequest;
import com.canteen.entity.OrderStatus;
import com.canteen.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<OrderResponse>> placeOrder(@Valid @RequestBody OrderRequest request,
                                                                 Authentication authentication) {
        String userEmail = authentication.getName();
        OrderResponse order = orderService.placeOrder(userEmail, request);
        return new ResponseEntity<>(ApiResponse.ok("Order placed successfully! Order ID: " + order.getOrderNumber(), order), HttpStatus.CREATED);
    }

    @GetMapping("/my-orders")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getMyOrders(Authentication authentication) {
        String userEmail = authentication.getName();
        List<OrderResponse> orders = orderService.getMyOrders(userEmail);
        return ResponseEntity.ok(ApiResponse.ok("Order history retrieved successfully", orders));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getAllOrders(
            @RequestParam(required = false) OrderStatus status) {
        List<OrderResponse> orders = orderService.getAllOrders(status);
        return ResponseEntity.ok(ApiResponse.ok("All orders retrieved successfully", orders));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(@PathVariable Long id,
                                                                   Authentication authentication) {
        String userEmail = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        OrderResponse order = orderService.getOrderById(id, userEmail, isAdmin);
        return ResponseEntity.ok(ApiResponse.ok("Order details retrieved successfully", order));
    }

    @GetMapping("/track/{orderNumber}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderByOrderNumber(@PathVariable String orderNumber,
                                                                           Authentication authentication) {
        String userEmail = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        OrderResponse order = orderService.getOrderByOrderNumber(orderNumber, userEmail, isAdmin);
        return ResponseEntity.ok(ApiResponse.ok("Order tracking retrieved successfully", order));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderStatusUpdateRequest request) {
        OrderResponse updated = orderService.updateOrderStatus(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.ok("Order status updated to " + request.getStatus(), updated));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<OrderResponse>> cancelOrder(@PathVariable Long id,
                                                                 Authentication authentication) {
        String userEmail = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        OrderResponse updated = orderService.cancelOrder(id, userEmail, isAdmin);
        return ResponseEntity.ok(ApiResponse.ok("Order cancelled successfully", updated));
    }
}
