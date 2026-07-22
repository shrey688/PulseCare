package com.hospital.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SignupRequest {
    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;

    @NotBlank
    private String name;

    @NotNull
    private Integer age;

    @NotBlank
    private String gender;

    @NotBlank
    private String bloodGroup;

    @NotBlank
    private String address;

    @NotBlank
    private String contactNumber;

    @NotBlank
    private String emergencyContact;

    private String insuranceDetails;
    private String medicalHistory;
}
