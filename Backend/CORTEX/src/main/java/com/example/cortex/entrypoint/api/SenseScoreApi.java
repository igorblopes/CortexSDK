package com.example.cortex.entrypoint.api;

import com.example.cortex.dataprovider.gateway.SenseScoreGateway;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class SenseScoreApi {

    @Autowired
    private SenseScoreGateway senseScoreGateway;

    @GetMapping("/sense-scores")
    public ResponseEntity getAllSenseScores() {
        senseScoreGateway.getAllSenseScore();
        return new ResponseEntity(HttpStatus.OK);
    }

    @GetMapping("/sense-scores/level/{level}")
    public ResponseEntity getAllSenseScores(@PathVariable("level") String level) {
        return new ResponseEntity(HttpStatus.OK);
    }
}
