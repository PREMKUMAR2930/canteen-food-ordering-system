package com.canteen.service;

import com.canteen.dto.CategoryDto;
import com.canteen.dto.CategoryRequest;
import com.canteen.entity.Category;
import com.canteen.exception.BadRequestException;
import com.canteen.exception.ResourceNotFoundException;
import com.canteen.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public CategoryDto getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));
        return mapToDto(category);
    }

    @Transactional
    public CategoryDto createCategory(CategoryRequest request) {
        if (categoryRepository.existsByNameIgnoreCase(request.getName().trim())) {
            throw new BadRequestException("Category with name '" + request.getName().trim() + "' already exists");
        }

        Category category = new Category();
        category.setName(request.getName().trim());
        category.setDescription(request.getDescription());

        Category saved = categoryRepository.save(category);
        return mapToDto(saved);
    }

    @Transactional
    public CategoryDto updateCategory(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));

        String newName = request.getName().trim();
        if (!category.getName().equalsIgnoreCase(newName) && categoryRepository.existsByNameIgnoreCase(newName)) {
            throw new BadRequestException("Category with name '" + newName + "' already exists");
        }

        category.setName(newName);
        category.setDescription(request.getDescription());

        Category saved = categoryRepository.save(category);
        return mapToDto(saved);
    }

    @Transactional
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found with ID: " + id);
        }
        categoryRepository.deleteById(id);
    }

    public CategoryDto mapToDto(Category category) {
        return new CategoryDto(category.getId(), category.getName(), category.getDescription());
    }
}
