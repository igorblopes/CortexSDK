package com.example.cortex.entrypoint.api;

import com.example.cortex.dataprovider.gateway.FraudAnalyzerGateway;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class FraudDetectionApi {

    @Autowired
    private FraudAnalyzerGateway fraudAnalyzerGateway;

    @GetMapping("/fraud/detect")
    public ResponseEntity makeFraudDetection(
            @RequestHeader("accountHash") String accountHash
    ) {
        var response = fraudAnalyzerGateway.getFraudValidation(accountHash);

        if(response != null){
            return new ResponseEntity(response,HttpStatus.OK);
        }

        return new ResponseEntity(HttpStatus.NOT_FOUND);
    }
}