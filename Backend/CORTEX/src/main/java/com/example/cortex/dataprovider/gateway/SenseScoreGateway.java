package com.example.cortex.dataprovider.gateway;

import com.br.CortexSDK.BackendSDK;
import org.springframework.stereotype.Service;

@Service
public class SenseScoreGateway {

    public void getAllSenseScore() {
        var sdk = new BackendSDK();

        sdk.init();
        var json = sdk.test();



        var e = 3;
    }
}
