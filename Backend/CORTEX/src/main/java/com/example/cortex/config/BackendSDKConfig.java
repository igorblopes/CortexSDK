package com.example.cortex.config;

import com.br.CortexSDK.BackendSDK;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BackendSDKConfig {

    @Bean
    public BackendSDKStarter backendSDK() {
        var backendSDK = new BackendSDKStarter();
        return backendSDK;
    }
}
