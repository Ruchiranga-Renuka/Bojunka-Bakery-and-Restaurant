package com.bojunka.backend.config;

import com.bojunka.backend.model.Food;
import com.bojunka.backend.model.User;
import com.bojunka.backend.repository.FoodRepository;
import com.bojunka.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner seedData(UserRepository userRepository, FoodRepository foodRepository,
                             PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByUsername("admin").isEmpty()) {
                User admin = new User();
                admin.setName("Bojunka Admin");
                admin.setIdNumber("ADM001");
                admin.setPhoneNumber("0000000000");
                admin.setUsername("admin");
                admin.setPasswordHash(passwordEncoder.encode("admin123"));
                admin.setRole("admin");
                userRepository.save(admin);
            }

            if (foodRepository.count() == 0) {
                foodRepository.save(new Food(null, "Grilled Chicken Rice", 12.99, "restaurant", 50));
                foodRepository.save(new Food(null, "Vegetable Curry", 9.50, "restaurant", 40));
                foodRepository.save(new Food(null, "Chocolate Croissant", 3.25, "bakery", 60));
                foodRepository.save(new Food(null, "Sourdough Loaf", 5.99, "bakery", 30));
            }
        };
    }
}
