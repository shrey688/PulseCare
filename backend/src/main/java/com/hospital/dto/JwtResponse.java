package com.hospital.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String email;
    private String role;
    private String name;
    private Long profileId; // doctorId, patientId, or receptionistId if applicable

    public JwtResponse(String token, Long id, String email, String role, String name, Long profileId) {
        this.token = token;
        this.id = id;
        this.email = email;
        this.role = role;
        this.name = name;
        this.profileId = profileId;
    }
}
