package com.company.golive;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories
public class GoLiveManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(GoLiveManagementApplication.class, args);
    }
}
