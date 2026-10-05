package com.canteen.controller;

import com.canteen.dto.ApiResponse;
import com.canteen.dto.FoodItemDto;
import com.canteen.dto.FoodItemRequest;
import com.canteen.service.FoodItemService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/foods")
public class FoodItemController {

    private final FoodItemService foodItemService;

    public FoodItemController(FoodItemService foodItemService) {
        this.foodItemService = foodItemService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FoodItemDto>>> getAllFoods(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "false") Boolean availableOnly) {

        List<FoodItemDto> foods;
        if (search != null && !search.trim().isEmpty()) {
            foods = foodItemService.searchFoods(search.trim());
        } else if (categoryId != null) {
            foods = foodItemService.getFoodsByCategory(categoryId, availableOnly);
        } else {
            foods = foodItemService.getAllFoods(availableOnly);
        }

        return ResponseEntity.ok(ApiResponse.ok("Food items retrieved successfully", foods));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FoodItemDto>> getFoodById(@PathVariable Long id) {
        FoodItemDto food = foodItemService.getFoodById(id);
        return ResponseEntity.ok(ApiResponse.ok("Food item retrieved successfully", food));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<FoodItemDto>> createFood(@Valid @RequestBody FoodItemRequest request) {
        FoodItemDto created = foodItemService.createFood(request);
        return new ResponseEntity<>(ApiResponse.ok("Food item created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<FoodItemDto>> updateFood(@PathVariable Long id, @Valid @RequestBody FoodItemRequest request) {
        FoodItemDto updated = foodItemService.updateFood(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Food item updated successfully", updated));
    }

    @PatchMapping("/{id}/toggle-availability")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<FoodItemDto>> toggleAvailability(@PathVariable Long id) {
        FoodItemDto updated = foodItemService.toggleAvailability(id);
        return ResponseEntity.ok(ApiResponse.ok("Food availability updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteFood(@PathVariable Long id) {
        foodItemService.deleteFood(id);
        return ResponseEntity.ok(ApiResponse.ok("Food item deleted successfully"));
    }
}
