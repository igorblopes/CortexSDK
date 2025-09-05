package com.example.cortex.dataprovider.gateway;

import com.example.cortex.config.BackendSDKStarter;
import com.example.cortex.entrypoint.dto.request.UpdateFingerprintScoreRequest;
import com.example.cortex.entrypoint.dto.request.UpdateUserBehaviorScoreRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserBehaviorScoreGateway {

    @Autowired
    BackendSDKStarter backendSDKStarter;

    public List<Object> getAllUserBehaviorScore(String token) {
        return backendSDKStarter.getBackendSDK().allUserBehaviorScores(token);
    }

    public Object updateUserBehaviorScores(String token, UpdateUserBehaviorScoreRequest body){
        return backendSDKStarter.getBackendSDK().updateUserBehaviorScores(token, body);
    }

}
