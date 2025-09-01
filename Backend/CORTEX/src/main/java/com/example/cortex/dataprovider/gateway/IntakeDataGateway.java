package com.example.cortex.dataprovider.gateway;

import com.br.CortexSDK.IIntakeData;
import com.example.cortex.config.BackendSDKStarter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class IntakeDataGateway {

    @Autowired
    BackendSDKStarter backendSDKStarter;

    public void sendDataGateway(IIntakeData intakeRequest, String token) {
        backendSDKStarter.getBackendSDK().intakeData(intakeRequest, token);
    }
}
