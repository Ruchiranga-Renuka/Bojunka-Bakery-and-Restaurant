package com.bojunka.backend.service;

public final class PhoneNumberUtil {

    private PhoneNumberUtil() {
    }

    public static String normalize(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.isBlank()) {
            throw new IllegalArgumentException("Phone number is required");
        }

        String trimmed = phoneNumber.trim().replaceAll("[\\s-]", "");
        if (trimmed.startsWith("+")) {
            return trimmed;
        }
        if (trimmed.startsWith("94")) {
            return "+" + trimmed;
        }
        if (trimmed.startsWith("0")) {
            return "+94" + trimmed.substring(1);
        }
        return "+94" + trimmed;
    }
}
