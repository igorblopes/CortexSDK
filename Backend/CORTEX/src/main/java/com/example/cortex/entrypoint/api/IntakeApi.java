package com.example.cortex.entrypoint.api;

import com.example.cortex.dataprovider.gateway.IntakeDataGateway;
import com.example.cortex.entrypoint.dto.request.IntakeRequest;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Intake API", description = "API de recebimento da coleta dos dados do client e envio para o SDK Backend.")
public class IntakeApi {

    @Autowired
    private IntakeDataGateway intakeDataGateway;

    @PostMapping("/intake/data")
    public ResponseEntity makeIntakeData(@RequestBody IntakeRequest intakeRequest, @RequestHeader("x-api-key") String token) {
        intakeDataGateway.sendDataGateway(intakeRequest, token);
        return new ResponseEntity(HttpStatus.OK);
    }
}
