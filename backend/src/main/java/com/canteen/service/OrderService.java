package com.canteen.service;

import com.canteen.dto.*;
import com.canteen.entity.*;
import com.canteen.exception.BadRequestException;
import com.canteen.exception.ResourceNotFoundException;
import com.canteen.repository.FoodItemRepository;
import com.canteen.repository.OrderItemRepository;
import com.canteen.repository.OrderRepository;
import com.canteen.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final FoodItemRepository foodItemRepository;
    private final UserRepository userRepository;

    public OrderService(OrderRepository orderRepository,
                        OrderItemRepository orderItemRepository,
                        FoodItemRepository foodItemRepository,
                        UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.foodItemRepository = foodItemRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public OrderResponse placeOrder(String userEmail, OrderRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new BadRequestException("Order cannot be empty. Please add items to cart.");
        }

        Order order = new Order();
        order.setUser(user);
        order.setStatus(OrderStatus.PLACED);
        order.setOrderDate(LocalDateTime.now());
        order.setOrderNumber(generateOrderNumber());

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<OrderItem> items = new ArrayList<>();

        for (OrderItemRequest itemReq : request.getItems()) {
            FoodItem foodItem = foodItemRepository.findById(itemReq.getFoodItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("Food item not found with ID: " + itemReq.getFoodItemId()));

            if (!foodItem.isAvailable()) {
                throw new BadRequestException("Item '" + foodItem.getName() + "' is currently out of stock / unavailable.");
            }

            if (itemReq.getQuantity() == null || itemReq.getQuantity() <= 0) {
                throw new BadRequestException("Quantity for item '" + foodItem.getName() + "' must be at least 1.");
            }

            BigDecimal itemPrice = foodItem.getPrice();
            BigDecimal subtotal = itemPrice.multiply(BigDecimal.valueOf(itemReq.getQuantity()));

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setFoodItem(foodItem);
            orderItem.setQuantity(itemReq.getQuantity());
            orderItem.setPrice(itemPrice);
            orderItem.setSubtotal(subtotal);

            items.add(orderItem);
            totalAmount = totalAmount.add(subtotal);
        }

        order.setTotalAmount(totalAmount);
        order.setOrderItems(items);

        Order savedOrder = orderRepository.save(order);
        return mapToResponse(savedOrder);
    }

    public List<OrderResponse> getMyOrders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        return orderRepository.findByUserIdOrderByOrderDateDesc(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getAllOrders(OrderStatus status) {
        List<Order> orders;
        if (status != null) {
            orders = orderRepository.findByStatusOrderByOrderDateDesc(status);
        } else {
            orders = orderRepository.findAllByOrderByOrderDateDesc();
        }
        return orders.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public OrderResponse getOrderById(Long id, String currentUserEmail, boolean isAdmin) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + id));

        if (!isAdmin && !order.getUser().getEmail().equalsIgnoreCase(currentUserEmail)) {
            throw new BadRequestException("You are not authorized to view this order.");
        }

        return mapToResponse(order);
    }

    public OrderResponse getOrderByOrderNumber(String orderNumber, String currentUserEmail, boolean isAdmin) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with Order Number: " + orderNumber));

        if (!isAdmin && !order.getUser().getEmail().equalsIgnoreCase(currentUserEmail)) {
            throw new BadRequestException("You are not authorized to view this order.");
        }

        return mapToResponse(order);
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));

        order.setStatus(newStatus);
        Order updated = orderRepository.save(order);
        return mapToResponse(updated);
    }

    @Transactional
    public OrderResponse cancelOrder(Long orderId, String userEmail, boolean isAdmin) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));

        if (!isAdmin) {
            if (!order.getUser().getEmail().equalsIgnoreCase(userEmail)) {
                throw new BadRequestException("You cannot cancel another user's order.");
            }
            if (order.getStatus() != OrderStatus.PLACED) {
                throw new BadRequestException("Order cannot be cancelled as it is already " + order.getStatus());
            }
        }

        order.setStatus(OrderStatus.CANCELLED);
        Order updated = orderRepository.save(order);
        return mapToResponse(updated);
    }

    private String generateOrderNumber() {
        int randomNum = ThreadLocalRandom.current().nextInt(1000, 9999);
        String datePart = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMdd"));
        return "ORD" + datePart + randomNum;
    }

    public OrderResponse mapToResponse(Order order) {
        List<OrderItemResponse> itemResponses = new ArrayList<>();
        if (order.getOrderItems() != null) {
            itemResponses = order.getOrderItems().stream().map(item -> new OrderItemResponse(
                    item.getId(),
                    item.getFoodItem().getId(),
                    item.getFoodItem().getName(),
                    item.getFoodItem().getImageUrl(),
                    item.getQuantity(),
                    item.getPrice(),
                    item.getSubtotal()
            )).collect(Collectors.toList());
        }

        return new OrderResponse(
                order.getId(),
                order.getOrderNumber(),
                order.getUser().getId(),
                order.getUser().getName(),
                order.getUser().getEmail(),
                order.getUser().getPhone(),
                order.getTotalAmount(),
                order.getStatus(),
                order.getOrderDate(),
                itemResponses
        );
    }
}
