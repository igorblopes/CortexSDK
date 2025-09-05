package com.example.cortex.entrypoint.dto.request;


import com.br.CortexSDK.IUpdateFingerprintScore;
import com.br.CortexSDK.IUpdateSenseScore;
import org.jetbrains.annotations.NotNull;

public class UpdateFingerprintScoreRequest implements IUpdateFingerprintScore {

    private Object id;
    private Object score;
    private Object status;

    @Override
    public @NotNull Object getId() {
        return id;
    }

    @Override
    public void setId(Object id) {
        this.id = id;
    }

    @Override
    public @NotNull Object getScore() {
        return score;
    }

    @Override
    public void setScore(Object score) {
        this.score = score;
    }

    @Override
    public @NotNull Object getStatus() {
        return status;
    }

    @Override
    public void setStatus(Object status) {
        this.status = status;
    }
}
