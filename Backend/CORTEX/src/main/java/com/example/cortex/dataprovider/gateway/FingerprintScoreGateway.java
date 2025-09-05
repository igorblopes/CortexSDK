package com.example.cortex.dataprovider.gateway;

import com.example.cortex.config.BackendSDKStarter;
import com.example.cortex.entrypoint.dto.request.UpdateFingerprintScoreRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FingerprintScoreGateway {

    @Autowired
    BackendSDKStarter backendSDKStarter;

    public List<Object> getAllFingerprintScore(String token) {
        return backendSDKStarter.getBackendSDK().allFingerprintScores(token);
    }

    public Object updateFingerprintScores(String token, UpdateFingerprintScoreRequest body){
        return backendSDKStarter.getBackendSDK().updateFingerprintScores(token, body);
    }

}
