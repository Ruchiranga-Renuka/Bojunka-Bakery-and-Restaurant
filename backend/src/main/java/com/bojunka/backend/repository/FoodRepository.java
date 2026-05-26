package com.bojunka.backend.repository;

import com.bojunka.backend.model.Food;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface FoodRepository extends MongoRepository<Food, String> {
    List<Food> findByCategory(String category);
}
