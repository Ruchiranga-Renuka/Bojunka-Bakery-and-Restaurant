package com.bojunka.backend.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "bojunka.sms")
public class SmsProperties {
    private boolean enabled = true;
    /** console (dev) or twilio */
    private String provider = "console";
    private String thankYouMessage = "Thank you! Come again to Bojunka Bakery and Restaurant.";
    private String twilioAccountSid = "";
    private String twilioAuthToken = "";
    private String twilioFromNumber = "";
}
