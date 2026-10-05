package com.canteen.service;

import com.canteen.dto.DashboardStatsResponse;
import com.canteen.dto.OrderResponse;
import com.canteen.entity.OrderStatus;
import com.canteen.entity.Role;
import com.canteen.repository.FoodItemRepository;
import com.canteen.repository.OrderRepository;
import com.canteen.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final OrderRepository orderRepository;
    private final FoodItemRepository foodItemRepository;
    private final UserRepository userRepository;
    private final OrderService orderService;

    public DashboardService(OrderRepository orderRepository,
                            FoodItemRepository foodItemRepository,
                            UserRepository userRepository,
                            OrderService orderService) {
        this.orderRepository = orderRepository;
        this.foodItemRepository = foodItemRepository;
        this.userRepository = userRepository;
        this.orderService = orderService;
    }

    public DashboardStatsResponse getDashboardStats() {
        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
        LocalDateTime endOfToday = LocalDate.now().atTime(LocalTime.MAX);

        long totalOrders = orderRepository.count();
        long todayOrders = orderRepository.countByOrderDateBetween(startOfToday, endOfToday);

        BigDecimal totalRevenue = orderRepository.calculateTotalRevenue(OrderStatus.CANCELLED);
        BigDecimal todayRevenue = orderRepository.calculateRevenueBetween(OrderStatus.CANCELLED, startOfToday, endOfToday);

        long totalFoodItems = foodItemRepository.count();
        long availableFoodItems = foodItemRepository.countByAvailableTrue();

        long totalStudents = userRepository.countByRole(Role.STUDENT);

        List<OrderResponse> recentOrders = orderRepository.findAllByOrderByOrderDateDesc().stream()
                .limit(10)
                .map(orderService::mapToResponse)
                .collect(Collectors.toList());

        return new DashboardStatsResponse(
                totalOrders,
                todayOrders,
                totalRevenue != null ? totalRevenue : BigDecimal.ZERO,
                todayRevenue != null ? todayRevenue : BigDecimal.ZERO,
                totalFoodItems,
                availableFoodItems,
                totalStudents,
                recentOrders
        );
    }
}
