package com.bojunka.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnProperty(name = "bojunka.sms.provider", havingValue = "console", matchIfMissing = true)
public class ConsoleSmsService implements SmsService {

    private static final Logger log = LoggerFactory.getLogger(ConsoleSmsService.class);

    @Override
    public void sendThankYouMessage(String phoneNumber, String message) {
        String to = PhoneNumberUtil.normalize(phoneNumber);
        log.info("SMS sent to {}: {}", to, message);
    }
}
