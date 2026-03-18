package com.sumuka.ecommerce_backend.modules.common;

import com.sumuka.ecommerce_backend.modules.common.enums.UserRole;
import com.sumuka.ecommerce_backend.modules.user.entity.User;
import com.sumuka.ecommerce_backend.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedUser("admin@gmail.com", "Titanium Admin", UserRole.ADMIN);
        seedUser("seller@gmail.com", "Titanium Seller", UserRole.SELLER);
        seedUser("customer@gmail.com", "Titanium Customer", UserRole.CUSTOMER);
    }

    private void seedUser(String email, String name, UserRole role) {
        if (userRepository.findByEmail(email).isEmpty()) {
            User user = User.builder()
                    .email(email)
                    .name(name)
                    .password(passwordEncoder.encode("password"))
                    .role(role)
                    .build();
            userRepository.save(user);
        }
    }
}
