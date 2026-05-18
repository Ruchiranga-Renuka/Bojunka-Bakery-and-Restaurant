package com.bojunka.backend.repository;

import com.bojunka.backend.model.Food;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FoodRepository extends JpaRepository<Food, String> {
    List<Food> findByCategory(String category);
}
