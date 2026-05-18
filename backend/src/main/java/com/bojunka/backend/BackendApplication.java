package com.bojunka.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	CommandLineRunner initDatabase(com.bojunka.backend.repository.UserRepository userRepository,
								   com.bojunka.backend.repository.FoodRepository foodRepository,
								   org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
		return args -> {
			if(userRepository.count() == 0) {
				com.bojunka.backend.model.User admin = new com.bojunka.backend.model.User();
				admin.setUsername("admin");
				admin.setPasswordHash(passwordEncoder.encode("password"));
				admin.setRole("admin");
				userRepository.save(admin);

				com.bojunka.backend.model.Food f1 = new com.bojunka.backend.model.Food(null, "Vegetable Noodles", 450.0, "restaurant", 100);
				com.bojunka.backend.model.Food f2 = new com.bojunka.backend.model.Food(null, "Veg Thali", 800.0, "restaurant", 50);
				com.bojunka.backend.model.Food f3 = new com.bojunka.backend.model.Food(null, "Shahi Paneer", 1200.0, "restaurant", 20);
				com.bojunka.backend.model.Food f4 = new com.bojunka.backend.model.Food(null, "Chicken Fried Rice", 650.0, "restaurant", 100);
				com.bojunka.backend.model.Food b1 = new com.bojunka.backend.model.Food(null, "Chocolate Cake", 1500.0, "bakery", 10);
				foodRepository.save(f1); foodRepository.save(f2); foodRepository.save(f3); foodRepository.save(f4); foodRepository.save(b1);
			}
		};
	}
}
