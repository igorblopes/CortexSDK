package com.example.cortex.entrypoint.api;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Ping API", description = "API de verificação da conexão do SDK Frontend com chamadas para o backend.")
public class PingApi {

    @PostMapping("/ping")
    public ResponseEntity makePing(@RequestHeader("x-api-key") String token) {
        return new ResponseEntity(HttpStatus.OK);
    }
}
