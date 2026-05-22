package com.bojunka.backend.service;

import com.bojunka.backend.config.SmsProperties;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
@ConditionalOnProperty(name = "bojunka.sms.provider", havingValue = "twilio")
public class TwilioSmsService implements SmsService {

    private final SmsProperties smsProperties;
    private final RestTemplate restTemplate = new RestTemplate();

    public TwilioSmsService(SmsProperties smsProperties) {
        this.smsProperties = smsProperties;
    }

    @Override
    public void sendThankYouMessage(String phoneNumber, String message) {
        if (smsProperties.getTwilioAccountSid().isBlank()
                || smsProperties.getTwilioAuthToken().isBlank()
                || smsProperties.getTwilioFromNumber().isBlank()) {
            throw new IllegalStateException("Twilio is not configured. Set account SID, auth token, and from number.");
        }

        String to = PhoneNumberUtil.normalize(phoneNumber);
        String url = "https://api.twilio.com/2010-04-01/Accounts/"
                + smsProperties.getTwilioAccountSid()
                + "/Messages.json";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.setBasicAuth(smsProperties.getTwilioAccountSid(), smsProperties.getTwilioAuthToken());

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("To", to);
        body.add("From", smsProperties.getTwilioFromNumber());
        body.add("Body", message);

        ResponseEntity<String> response = restTemplate.postForEntity(
                url,
                new HttpEntity<>(body, headers),
                String.class
        );

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new IllegalStateException("Failed to send SMS via Twilio");
        }
    }
}
