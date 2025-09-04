package com.example.cortex.entrypoint.api;

import com.example.cortex.dataprovider.gateway.SenseScoreGateway;
import com.example.cortex.entrypoint.dto.request.UpdateSenseScoreRequest;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Sense Score API", description = "API`s de gerenciamento da sensibilidade de scores do SDK de validação de fraude")
public class SenseScoreApi {

    @Autowired
    private SenseScoreGateway senseScoreGateway;

    @GetMapping("/sense-scores")
    public ResponseEntity getAllSenseScores(@RequestHeader("x-api-key") String token) {
        var response = senseScoreGateway.getAllSenseScore(token);
        return new ResponseEntity(response, HttpStatus.OK);
    }

    @PutMapping("/sense-scores")
    public ResponseEntity updateSenseScores(@RequestHeader("x-api-key") String token, @RequestBody UpdateSenseScoreRequest body) {
        var response = senseScoreGateway.updateSenseScore(token, body);
        return new ResponseEntity(response, HttpStatus.OK);
    }

    @GetMapping("/sense-scores/level/score/{score}")
    public ResponseEntity getSenseScoresLevelByScore(@RequestHeader("x-api-key") String token, @PathVariable("score") Long score) {
        var response = senseScoreGateway.getSenseScoreLevelByScore(token, score);
        return new ResponseEntity(response, HttpStatus.OK);
    }
}
