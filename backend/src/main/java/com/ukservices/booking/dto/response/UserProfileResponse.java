package com.ukservices.booking.dto.response;

import com.ukservices.booking.entity.User;
import com.ukservices.booking.entity.enums.Role;

public class UserProfileResponse {

    private Long id;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private String postcode;
    private Role role;

    public UserProfileResponse() {
    }

    public UserProfileResponse(Long id, String firstName, String lastName, String email,
                               String phone, String address, String postcode, Role role) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.fullName = firstName + " " + lastName;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.postcode = postcode;
        this.role = role;
    }

    public static UserProfileResponse fromEntity(User user) {
        return new UserProfileResponse(
            user.getId(),
            user.getFirstName(),
            user.getLastName(),
            user.getEmail(),
            user.getPhone(),
            user.getAddress(),
            user.getPostcode(),
            user.getRole()
        );
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPostcode() {
        return postcode;
    }

    public void setPostcode(String postcode) {
        this.postcode = postcode;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
