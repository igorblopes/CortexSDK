package com.example.cortex.dataprovider.gateway;

import com.example.cortex.config.BackendSDKStarter;
import com.example.cortex.entrypoint.dto.request.IntakeRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class IntakeDataGateway {

    @Autowired
    BackendSDKStarter backendSDKStarter;

    public void sendDataGateway(IntakeRequest intakeRequest) {
        backendSDKStarter.getBackendSDK().intakeData(intakeRequest);
    }
}
