package com.ratnika.config.props;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Strongly-typed binding for all {@code app.*} configuration.
 */
@Data
@Component
@ConfigurationProperties(prefix = "app")
public class AppProperties {

    private String apiPrefix = "/api/v1";
    private Cors cors = new Cors();
    private Jwt jwt = new Jwt();
    private Otp otp = new Otp();
    private Store store = new Store();
    private Razorpay razorpay = new Razorpay();
    private Checkout checkout = new Checkout();
    private Storage storage = new Storage();
    private Seed seed = new Seed();

    @Data
    public static class Cors {
        private List<String> allowedOrigins;
    }

    @Data
    public static class Jwt {
        private String secret;
        private long accessTokenExpiration;
        private long refreshTokenExpiration;
        private String issuer;
    }

    @Data
    public static class Otp {
        private int expirationMinutes = 10;
        private int length = 6;
    }

    @Data
    public static class Store {
        private String name;
        private String supportEmail;
        private String supportPhone;
        private String addressLine;
        private long freeShippingThreshold;
        private long shippingFee;
        private boolean codEnabled;
        private String frontendUrl;
    }

    @Data
    public static class Razorpay {
        private String keyId;
        private String keySecret;
        /** Secret configured in the Razorpay Dashboard → Webhooks. */
        private String webhookSecret;
        private boolean enabled;
    }

    @Data
    public static class Checkout {
        /** Pending-payment orders older than this are auto-cancelled and stock released. */
        private int paymentTimeoutMinutes = 15;
    }

    @Data
    public static class Storage {
        private String provider = "local";
        private String publicBaseUrl;
    }

    @Data
    public static class Seed {
        private boolean enabled = false;
    }
}
