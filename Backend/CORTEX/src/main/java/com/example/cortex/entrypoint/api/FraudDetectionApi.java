package com.example.cortex.entrypoint.api;

import com.example.cortex.dataprovider.gateway.FraudAnalyzerGateway;
import com.example.cortex.entrypoint.dto.request.FraudFiltersRequest;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Tag(name = "Fraud Detection API", description = "API de validação de validação de fraude de uma conta.")
@RequestMapping("/api/v1")
public class FraudDetectionApi {

    @Autowired
    private FraudAnalyzerGateway fraudAnalyzerGateway;

    @GetMapping("/fraud/detect")
    public ResponseEntity makeFraudDetection(
            @RequestHeader("accountHash") String accountHash,
            @RequestHeader("x-api-key") String token
    ) {
        var response = fraudAnalyzerGateway.getFraudValidation(accountHash, token);

        if(response != null){
            return new ResponseEntity(response,HttpStatus.OK);
        }

        return new ResponseEntity(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/fraud/counters")
    public ResponseEntity getFraudCounters(
            @RequestHeader("x-api-key") String token
    ) {
        var response = fraudAnalyzerGateway.getFraudCounters(token);

        if(response != null){
            return new ResponseEntity(response,HttpStatus.OK);
        }

        return new ResponseEntity(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/fraud")
    public ResponseEntity getFrauds(
            @RequestHeader("x-api-key") String token,
            @RequestBody FraudFiltersRequest request
    ) {
        var response = fraudAnalyzerGateway.getFrauds(token, request);

        if(response != null){
            return new ResponseEntity(response,HttpStatus.OK);
        }

        return new ResponseEntity(HttpStatus.NOT_FOUND);
    }
}