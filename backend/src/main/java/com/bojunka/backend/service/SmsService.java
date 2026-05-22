package com.bojunka.backend.service;

public interface SmsService {
    void sendThankYouMessage(String phoneNumber, String message);
}
