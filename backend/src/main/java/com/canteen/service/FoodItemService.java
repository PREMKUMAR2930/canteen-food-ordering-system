package com.canteen.service;

import com.canteen.dto.FoodItemDto;
import com.canteen.dto.FoodItemRequest;
import com.canteen.entity.Category;
import com.canteen.entity.FoodItem;
import com.canteen.exception.ResourceNotFoundException;
import com.canteen.repository.CategoryRepository;
import com.canteen.repository.FoodItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FoodItemService {

    private final FoodItemRepository foodItemRepository;
    private final CategoryRepository categoryRepository;

    public FoodItemService(FoodItemRepository foodItemRepository, CategoryRepository categoryRepository) {
        this.foodItemRepository = foodItemRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<FoodItemDto> getAllFoods(Boolean onlyAvailable) {
        List<FoodItem> items;
        if (Boolean.TRUE.equals(onlyAvailable)) {
            items = foodItemRepository.findByAvailableTrue();
        } else {
            items = foodItemRepository.findAll();
        }
        return items.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<FoodItemDto> getFoodsByCategory(Long categoryId, Boolean onlyAvailable) {
        List<FoodItem> items;
        if (Boolean.TRUE.equals(onlyAvailable)) {
            items = foodItemRepository.findByCategoryIdAndAvailableTrue(categoryId);
        } else {
            items = foodItemRepository.findByCategoryId(categoryId);
        }
        return items.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<FoodItemDto> searchFoods(String query) {
        return foodItemRepository.findByNameContainingIgnoreCase(query)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public FoodItemDto getFoodById(Long id) {
        FoodItem item = foodItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Food item not found with ID: " + id));
        return mapToDto(item);
    }

    @Transactional
    public FoodItemDto createFood(FoodItemRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));

        FoodItem item = new FoodItem();
        item.setName(request.getName().trim());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setImageUrl(request.getImageUrl());
        item.setAvailable(request.isAvailable());
        item.setCategory(category);

        FoodItem saved = foodItemRepository.save(item);
        return mapToDto(saved);
    }

    @Transactional
    public FoodItemDto updateFood(Long id, FoodItemRequest request) {
        FoodItem item = foodItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Food item not found with ID: " + id));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));

        item.setName(request.getName().trim());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setImageUrl(request.getImageUrl());
        item.setAvailable(request.isAvailable());
        item.setCategory(category);

        FoodItem saved = foodItemRepository.save(item);
        return mapToDto(saved);
    }

    @Transactional
    public FoodItemDto toggleAvailability(Long id) {
        FoodItem item = foodItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Food item not found with ID: " + id));
        item.setAvailable(!item.isAvailable());
        FoodItem saved = foodItemRepository.save(item);
        return mapToDto(saved);
    }

    @Transactional
    public void deleteFood(Long id) {
        if (!foodItemRepository.existsById(id)) {
            throw new ResourceNotFoundException("Food item not found with ID: " + id);
        }
        foodItemRepository.deleteById(id);
    }

    public FoodItemDto mapToDto(FoodItem item) {
        return new FoodItemDto(
                item.getId(),
                item.getName(),
                item.getDescription(),
                item.getPrice(),
                item.getImageUrl(),
                item.isAvailable(),
                item.getCategory() != null ? item.getCategory().getId() : null,
                item.getCategory() != null ? item.getCategory().getName() : null,
                item.getCreatedAt()
        );
    }
}
