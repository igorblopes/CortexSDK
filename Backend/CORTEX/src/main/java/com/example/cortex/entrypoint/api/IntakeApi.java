package com.example.cortex.entrypoint.api;

import com.example.cortex.dataprovider.gateway.IntakeDataGateway;
import com.example.cortex.entrypoint.dto.request.IntakeRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class IntakeApi {

    @Autowired
    private IntakeDataGateway intakeDataGateway;

    @PostMapping("/intake/data")
    public ResponseEntity makeIntakeData(@RequestBody IntakeRequest intakeRequest) {
        intakeDataGateway.sendDataGateway(intakeRequest);
        return new ResponseEntity(HttpStatus.OK);
    }
}
