package com.bojunka.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ThankYouSmsResponse {
    private String message;
    private String phoneNumber;
    private String receiptNumber;
    private boolean alreadySent;
}
