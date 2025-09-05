package com.example.cortex.entrypoint.api;

import com.example.cortex.dataprovider.gateway.CheckoutScoreGateway;
import com.example.cortex.dataprovider.gateway.UserBehaviorScoreGateway;
import com.example.cortex.entrypoint.dto.request.UpdateCheckoutScoreRequest;
import com.example.cortex.entrypoint.dto.request.UpdateUserBehaviorScoreRequest;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Checkout Score API", description = "API`s de gerenciamento do checkout de scores do SDK de validação de fraude")
public class CheckoutScoreApi {

    @Autowired
    private CheckoutScoreGateway checkoutScoreGateway;

    @GetMapping("/checkout-scores")
    public ResponseEntity getAllCheckoutScores(@RequestHeader("x-api-key") String token) {
        var response = checkoutScoreGateway.getAllCheckoutScore(token);
        return new ResponseEntity(response, HttpStatus.OK);
    }

    @PutMapping("/checkout-scores")
    public ResponseEntity updateCheckoutScores(@RequestHeader("x-api-key") String token, @RequestBody UpdateCheckoutScoreRequest body) {
        var response = checkoutScoreGateway.updateCheckoutScores(token, body);
        return new ResponseEntity(response, HttpStatus.OK);
    }

}
