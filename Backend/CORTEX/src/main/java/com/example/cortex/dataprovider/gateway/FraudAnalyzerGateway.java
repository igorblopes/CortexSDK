package com.example.cortex.dataprovider.gateway;

import com.example.cortex.config.BackendSDKStarter;
import com.example.cortex.entrypoint.dto.response.FraudValidationResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FraudAnalyzerGateway {

    @Autowired
    BackendSDKStarter backendSDKStarter;

    public FraudValidationResponse getFraudValidation(String accountHash, String token) {
        Object sdkResp = backendSDKStarter.getBackendSDK().validateFraud(accountHash, token);

        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        var response = mapper.convertValue(sdkResp, FraudValidationResponse.class);

        return response;

    }

    public Object getFraudCounters(String token) {
        Object sdkResp = backendSDKStarter.getBackendSDK().countersFraudValidationScores(token);

        return sdkResp;
    }

    public List<Object> getFrauds(String token, Object filters) {
        List<Object> sdkResp = backendSDKStarter.getBackendSDK().allFraudValidationsScores(token, filters);

        return sdkResp;
    }
}
