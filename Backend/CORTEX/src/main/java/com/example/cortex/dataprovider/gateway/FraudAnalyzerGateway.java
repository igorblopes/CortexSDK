package com.example.cortex.dataprovider.gateway;

import com.br.CortexSDK.BackendSDK;
import com.example.cortex.entrypoint.dto.request.IntakeRequest;
import com.example.cortex.entrypoint.dto.response.FraudValidationResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

@Service
public class FraudAnalyzerGateway {

    public FraudValidationResponse getFraudValidation(String accountHash) {
//        var sdk = new BackendSDK();
//
//        sdk.init();
//        var fraudValidation = sdk.validateFraud(accountHash);
//
//        ObjectMapper mapper = new ObjectMapper();
//
//        return mapper.convertValue(fraudValidation, FraudValidationResponse.class);

        return null;

    }
}
