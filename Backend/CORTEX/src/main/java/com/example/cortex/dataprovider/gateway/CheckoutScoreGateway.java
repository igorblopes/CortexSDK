package com.example.cortex.dataprovider.gateway;

import com.example.cortex.config.BackendSDKStarter;
import com.example.cortex.entrypoint.dto.request.UpdateCheckoutScoreRequest;
import com.example.cortex.entrypoint.dto.request.UpdateUserBehaviorScoreRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CheckoutScoreGateway {

    @Autowired
    BackendSDKStarter backendSDKStarter;

    public List<Object> getAllCheckoutScore(String token) {
        return backendSDKStarter.getBackendSDK().allCheckoutScores(token);
    }

    public Object updateCheckoutScores(String token, UpdateCheckoutScoreRequest body){
        return backendSDKStarter.getBackendSDK().updateCheckoutScores(token, body);
    }

}
