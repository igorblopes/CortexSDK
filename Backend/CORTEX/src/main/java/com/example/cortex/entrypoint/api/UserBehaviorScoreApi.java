package com.example.cortex.entrypoint.api;

import com.example.cortex.dataprovider.gateway.FingerprintScoreGateway;
import com.example.cortex.dataprovider.gateway.UserBehaviorScoreGateway;
import com.example.cortex.entrypoint.dto.request.UpdateFingerprintScoreRequest;
import com.example.cortex.entrypoint.dto.request.UpdateUserBehaviorScoreRequest;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "User Behavior Score API", description = "API`s de gerenciamento do user behavior de scores do SDK de validação de fraude")
public class UserBehaviorScoreApi {

    @Autowired
    private UserBehaviorScoreGateway userBehaviorScoreGateway;

    @GetMapping("/user-behavior-scores")
    public ResponseEntity getAllUserBehaviorsScores(@RequestHeader("x-api-key") String token) {
        var response = userBehaviorScoreGateway.getAllUserBehaviorScore(token);
        return new ResponseEntity(response, HttpStatus.OK);
    }

    @PutMapping("/user-behavior-scores")
    public ResponseEntity updateUserBehaviorScores(@RequestHeader("x-api-key") String token, @RequestBody UpdateUserBehaviorScoreRequest body) {
        var response = userBehaviorScoreGateway.updateUserBehaviorScores(token, body);
        return new ResponseEntity(response, HttpStatus.OK);
    }

}
