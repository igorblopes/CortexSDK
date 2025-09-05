package com.example.cortex.entrypoint.api;

import com.example.cortex.dataprovider.gateway.FingerprintScoreGateway;
import com.example.cortex.dataprovider.gateway.SenseScoreGateway;
import com.example.cortex.entrypoint.dto.request.UpdateFingerprintScoreRequest;
import com.example.cortex.entrypoint.dto.request.UpdateSenseScoreRequest;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Fingerprint Score API", description = "API`s de gerenciamento do fingerprint de scores do SDK de validação de fraude")
public class FingerprintScoreApi {

    @Autowired
    private FingerprintScoreGateway fingerprintScoreGateway;

    @GetMapping("/fingerprint-scores")
    public ResponseEntity getAllFingerprintScores(@RequestHeader("x-api-key") String token) {
        var response = fingerprintScoreGateway.getAllFingerprintScore(token);
        return new ResponseEntity(response, HttpStatus.OK);
    }

    @PutMapping("/fingerprint-scores")
    public ResponseEntity updateFingerprintScores(@RequestHeader("x-api-key") String token, @RequestBody UpdateFingerprintScoreRequest body) {
        var response = fingerprintScoreGateway.updateFingerprintScores(token, body);
        return new ResponseEntity(response, HttpStatus.OK);
    }

}
