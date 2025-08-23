package com.example.cortex.dataprovider.gateway;

import com.br.CortexSDK.BackendSDK;
import com.example.cortex.entrypoint.dto.request.IntakeRequest;
import org.springframework.stereotype.Service;

@Service
public class IntakeDataGateway {

    public void sendDataGateway(IntakeRequest intakeRequest) {
        var sdk = new BackendSDK();

        sdk.init();
        sdk.intakeData(intakeRequest);
    }
}
