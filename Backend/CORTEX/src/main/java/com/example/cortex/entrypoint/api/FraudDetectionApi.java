package com.example.cortex.entrypoint.api;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class FraudDetectionApi {

    @GetMapping("/fraud")
    public ResponseEntity makeFraudDetection(
            @RequestHeader("accountHash") String accountHash
    ) {
        return new ResponseEntity(HttpStatus.OK);
    }
}