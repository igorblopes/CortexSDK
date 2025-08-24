package com.example.cortex.config;

import com.br.CortexSDK.BackendSDK;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


public class BackendSDKStarter {

    BackendSDK backendSDK = new BackendSDK();

    public BackendSDKStarter(){
        backendSDK = new BackendSDK();
        backendSDK.init();
    }

    public BackendSDK getBackendSDK() {
        return backendSDK;
    }

    public void setBackendSDK(BackendSDK backendSDK) {
        this.backendSDK = backendSDK;
    }
}
