package com.canteen.repository;

import com.canteen.entity.Order;
import com.canteen.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByOrderDateDesc(Long userId);
    List<Order> findAllByOrderByOrderDateDesc();
    List<Order> findByStatusOrderByOrderDateDesc(OrderStatus status);
    Optional<Order> findByOrderNumber(String orderNumber);
    long countByStatus(OrderStatus status);
    long countByOrderDateBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status != :cancelledStatus")
    BigDecimal calculateTotalRevenue(@Param("cancelledStatus") OrderStatus cancelledStatus);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status != :cancelledStatus AND o.orderDate BETWEEN :start AND :end")
    BigDecimal calculateRevenueBetween(@Param("cancelledStatus") OrderStatus cancelledStatus, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
