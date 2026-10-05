package com.canteen.repository;

import com.canteen.entity.FoodItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodItemRepository extends JpaRepository<FoodItem, Long> {
    List<FoodItem> findByAvailableTrue();
    List<FoodItem> findByCategoryId(Long categoryId);
    List<FoodItem> findByCategoryIdAndAvailableTrue(Long categoryId);
    List<FoodItem> findByNameContainingIgnoreCase(String name);
    long countByAvailableTrue();
}
