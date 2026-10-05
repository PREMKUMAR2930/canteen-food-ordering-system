package com.canteen.config;

import com.canteen.entity.*;
import com.canteen.repository.CategoryRepository;
import com.canteen.repository.FoodItemRepository;
import com.canteen.repository.OrderRepository;
import com.canteen.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final FoodItemRepository foodItemRepository;
    private final OrderRepository orderRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           CategoryRepository categoryRepository,
                           FoodItemRepository foodItemRepository,
                           OrderRepository orderRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.foodItemRepository = foodItemRepository;
        this.orderRepository = orderRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Checking canteen default accounts & database data...");

        // 1. Ensure Admin always has valid BCrypt password 'admin123'
        User admin = userRepository.findByEmail("admin@canteen.com").orElseGet(() -> {
            User u = new User();
            u.setEmail("admin@canteen.com");
            return u;
        });
        admin.setName("Canteen Administrator");
        admin.setPhone("9876543210");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(Role.ADMIN);
        userRepository.save(admin);

        // 2. Ensure Default Student always has valid BCrypt password 'student123'
        User student = userRepository.findByEmail("student@canteen.com").orElseGet(() -> {
            User u = new User();
            u.setEmail("student@canteen.com");
            return u;
        });
        student.setName("Premkumar");
        student.setPhone("9876543211");
        student.setPassword(passwordEncoder.encode("student123"));
        student.setRole(Role.STUDENT);
        userRepository.save(student);

        // 3. Seed Categories if empty
        if (categoryRepository.count() == 0) {
            Category breakfast = categoryRepository.save(new Category(null, "Breakfast", "Fresh hot morning breakfast items & South Indian staples"));
            Category lunch = categoryRepository.save(new Category(null, "Lunch", "Nutritious full meals, variety rice, and hearty combos"));
            Category fastFood = categoryRepository.save(new Category(null, "Fast Food", "Burgers, cheesy pizzas, wraps, and quick comfort bites"));
            Category snacks = categoryRepository.save(new Category(null, "Snacks", "Crispy evening samosas, French fries, and savory snacks"));
            Category beverages = categoryRepository.save(new Category(null, "Beverages", "Hot masala tea, South Indian filter coffee, and fresh juices"));
            Category desserts = categoryRepository.save(new Category(null, "Desserts", "Ice cream sundaes, pastries, and sweet delights"));

            // 4. Create 12 Food Items
            List<FoodItem> items = new ArrayList<>();
            items.add(new FoodItem(null, "Idli (2 Pcs)", "Soft steamed rice cakes served with coconut chutney & piping hot sambar", new BigDecimal("30.00"), "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80", true, breakfast, LocalDateTime.now()));
            items.add(new FoodItem(null, "Masala Dosa", "Crispy golden crepe filled with spiced mashed potato served with coconut & tomato chutney", new BigDecimal("50.00"), "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80", true, breakfast, LocalDateTime.now()));
            items.add(new FoodItem(null, "Veg Meals (Thali)", "Traditional full thali with rice, sambar, rasam, kootu, poriyal, curd & appalam", new BigDecimal("100.00"), "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&auto=format&fit=crop&q=80", true, lunch, LocalDateTime.now()));
            items.add(new FoodItem(null, "Veg Fried Rice", "Aromatic wok-tossed basmati rice with crunchy fresh garden vegetables & savory seasonings", new BigDecimal("90.00"), "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&auto=format&fit=crop&q=80", true, lunch, LocalDateTime.now()));
            items.add(new FoodItem(null, "Vegetable Burger", "Crispy spiced vegetable patty layered with crisp lettuce, tomato, cheese & chef sauce", new BigDecimal("80.00"), "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80", true, fastFood, LocalDateTime.now()));
            items.add(new FoodItem(null, "Cheese Margherita Pizza", "Freshly baked 8-inch crust loaded with rich tomato marinara, mozzarella and oregano", new BigDecimal("120.00"), "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80", true, fastFood, LocalDateTime.now()));
            items.add(new FoodItem(null, "Crispy Samosa (2 Pcs)", "Flaky golden pastry crust filled with spiced potatoes and green peas, served with mint chutney", new BigDecimal("20.00"), "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80", true, snacks, LocalDateTime.now()));
            items.add(new FoodItem(null, "French Fries", "Golden salted crispy potato fries served with creamy mayo & tangy tomato ketchup", new BigDecimal("60.00"), "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=80", true, snacks, LocalDateTime.now()));
            items.add(new FoodItem(null, "Masala Tea", "Authentic Indian spiced milk tea brewed with cardamom, ginger, and aromatic herbs", new BigDecimal("15.00"), "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80", true, beverages, LocalDateTime.now()));
            items.add(new FoodItem(null, "Filter Coffee", "Traditional South Indian frothy filter kaapi brewed with rich freshly roasted chicory blend", new BigDecimal("25.00"), "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80", true, beverages, LocalDateTime.now()));
            items.add(new FoodItem(null, "Fresh Orange Juice", "Chilled freshly squeezed sweet orange juice packed with natural Vitamin C and freshness", new BigDecimal("50.00"), "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80", true, beverages, LocalDateTime.now()));
            items.add(new FoodItem(null, "Vanilla Sundae Ice Cream", "Rich double vanilla scoop drizzled with dark chocolate fudge sauce and toasted crunchy nuts", new BigDecimal("40.00"), "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80", true, desserts, LocalDateTime.now()));

            foodItemRepository.saveAll(items);
        }

        log.info("Canteen accounts and data validated successfully!");
    }
}
