package com.hospital;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.beans.factory.annotation.Value;
import java.io.File;

@SpringBootApplication
public class HospitalApplication implements CommandLineRunner {

    @Value("${app.upload.dir}")
    private String uploadDir;

    public static void main(String[] args) {
        SpringApplication.run(HospitalApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            boolean created = directory.mkdirs();
            if (created) {
                System.out.println("Created uploads directory at: " + directory.getAbsolutePath());
            } else {
                System.err.println("Failed to create uploads directory at: " + directory.getAbsolutePath());
            }
        }
    }
}
