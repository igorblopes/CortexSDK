package com.example.cortex.entrypoint.api;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class LoginApi {

    @PostMapping("/login")
    public ResponseEntity makeLogin() {
        return new ResponseEntity(HttpStatus.OK);
    }
}
