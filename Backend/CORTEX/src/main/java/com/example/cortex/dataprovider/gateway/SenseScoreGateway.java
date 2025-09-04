package com.example.cortex.dataprovider.gateway;

import com.example.cortex.config.BackendSDKStarter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SenseScoreGateway {

    @Autowired
    BackendSDKStarter backendSDKStarter;

    public List<Object> getAllSenseScore() {
        return backendSDKStarter.getBackendSDK().allSenseScores();
    }
}
