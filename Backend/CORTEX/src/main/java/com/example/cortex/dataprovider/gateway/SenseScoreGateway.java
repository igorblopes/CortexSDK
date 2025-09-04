package com.example.cortex.dataprovider.gateway;

import com.br.CortexSDK.BackendSDK;
import com.example.cortex.config.BackendSDKStarter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SenseScoreGateway {

    @Autowired
    BackendSDKStarter backendSDKStarter;

    public void getAllSenseScore() {

        var senses = backendSDKStarter.getBackendSDK().allSenseScores();




        var e = 3;
    }
}
