package com.example.cortex.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BackendSDKConfig {

    @Value("${sdk.token}")
    private String sdkToken;



    @Bean
    public BackendSDKStarter backendSDK() {
        var backendSDK = new BackendSDKStarter(this.sdkToken);
        return backendSDK;
    }
}
