package com.bojunka.backend;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import com.bojunka.backend.repository.UserRepository;
import com.bojunka.backend.model.User;

@SpringBootTest
public class IdTest {
    @Autowired
    UserRepository userRepository;

    @Test
    public void testSave() {
        User u = new User();
        u.setUsername("testuser");
        userRepository.save(u);
    }
}
