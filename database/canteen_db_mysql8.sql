-- =========================================================
-- College Canteen Food Ordering System - MySQL 8 Database Script
-- =========================================================

CREATE DATABASE IF NOT EXISTS canteen_db;
USE canteen_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'STUDENT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- 3. Food Items Table
CREATE TABLE IF NOT EXISTS food_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(500),
    available BOOLEAN NOT NULL DEFAULT TRUE,
    category_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_food_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PLACED',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    food_item_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_orderitem_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_orderitem_food FOREIGN KEY (food_item_id) REFERENCES food_items(id) ON DELETE CASCADE
);

-- =========================================================
-- Sample Initial Data Seeding
-- Note: Passwords are BCrypt hashed for 'admin123' and 'student123'
-- =========================================================

-- Admin: admin@canteen.com / admin123
-- Student: student@canteen.com / student123
INSERT INTO users (name, email, phone, password, role) VALUES 
('Canteen Admin', 'admin@canteen.com', '9876543210', '$2a$10$wq8az1RLP05i9RVBEg2S/uWIezpoKYgovgemEMNlhXtMMbd/GoknG', 'ADMIN'),
('Premkumar (Student)', 'student@canteen.com', '9876543211', '$2a$10$wq8az1RLP05i9RVBEg2S/uWIezpoKYgovgemEMNlhXtMMbd/GoknG', 'STUDENT')
ON DUPLICATE KEY UPDATE password=VALUES(password);

-- Categories
INSERT INTO categories (id, name, description) VALUES
(1, 'Breakfast', 'Delicious South Indian and hot breakfast items'),
(2, 'Lunch', 'Nutritious full meals, variety rice, and lunch combos'),
(3, 'Fast Food', 'Burgers, pizzas, sandwiches and quick bites'),
(4, 'Snacks', 'Crispy evening snacks, samosas, and fries'),
(5, 'Beverages', 'Hot tea, coffee, cold fresh juices, and soft drinks'),
(6, 'Desserts', 'Sweet treats, ice creams, and sundaes')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Food Items
INSERT INTO food_items (id, name, description, price, image_url, available, category_id) VALUES
(1, 'Idli (2 Pcs)', 'Soft steamed rice cakes served with coconut chutney & piping hot sambar', 30.00, 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80', true, 1),
(2, 'Masala Dosa', 'Crispy golden crepe filled with spiced mashed potato served with chutneys', 50.00, 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80', true, 1),
(3, 'Veg Meals', 'Traditional full thali with rice, sambar, rasam, kootu, poriyal, curd & appalam', 100.00, 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&auto=format&fit=crop&q=80', true, 2),
(4, 'Veg Fried Rice', 'Aromatic wok-tossed basmati rice with crunchy fresh garden vegetables', 90.00, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&auto=format&fit=crop&q=80', true, 2),
(5, 'Vegetable Burger', 'Crispy spiced vegetable patty layered with lettuce, cheese & special sauce', 80.00, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80', true, 3),
(6, 'Cheese Pizza', 'Freshly baked 8-inch hand-tossed pizza topped with mozzarella and herbs', 120.00, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80', true, 3),
(7, 'Crispy Samosa (2 Pcs)', 'Deep-fried flaky pastry filled with spiced potato and peas, with mint chutney', 20.00, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80', true, 4),
(8, 'French Fries', 'Golden salted crispy potato fries served with creamy mayo & tangy ketchup', 60.00, 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=80', true, 4),
(9, 'Masala Tea', 'Authentic Indian milk tea brewed with cardamom, ginger, and aromatic spices', 15.00, 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80', true, 5),
(10, 'Filter Coffee', 'Traditional South Indian frothy filter kaapi brewed with fresh chicory blend', 25.00, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80', true, 5),
(11, 'Fresh Orange Juice', 'Chilled freshly squeezed sweet orange juice packed with natural Vitamin C', 50.00, 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80', true, 5),
(12, 'Vanilla Sundae Ice Cream', 'Rich vanilla scoop drizzled with chocolate fudge sauce and toasted nuts', 40.00, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80', true, 6)
ON DUPLICATE KEY UPDATE name=VALUES(name);
