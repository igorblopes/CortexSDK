package com.example.cortex.dataprovider.gateway;

import com.example.cortex.config.BackendSDKStarter;
import com.example.cortex.entrypoint.dto.request.UpdateSenseScoreRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SenseScoreGateway {

    @Autowired
    BackendSDKStarter backendSDKStarter;

    public List<Object> getAllSenseScore(String token) {
        return backendSDKStarter.getBackendSDK().allSenseScores(token);
    }

    public Object updateSenseScore(String token, UpdateSenseScoreRequest body){
        return backendSDKStarter.getBackendSDK().updateSenseScores(token, body);
    }

    public Object getSenseScoreLevelByScore(String token, Long score){
        return backendSDKStarter.getBackendSDK().getSenseScoreByScore(token, score);
    }
}
