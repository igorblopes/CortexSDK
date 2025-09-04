package com.example.cortex.entrypoint.dto.request;


import com.br.CortexSDK.IUpdateSenseScore;
import org.jetbrains.annotations.NotNull;

public class UpdateSenseScoreRequest implements IUpdateSenseScore {

    private Object id;
    private Object minScore;
    private Object maxScore;


    @Override
    public @NotNull Object getId() {
        return id;
    }

    @Override
    public void setId(Object id) {
        this.id = id;
    }

    @Override
    public @NotNull Object getMinScore() {
        return minScore;
    }

    @Override
    public void setMinScore(Object minScore) {
        this.minScore = minScore;
    }

    @Override
    public @NotNull Object getMaxScore() {
        return maxScore;
    }

    @Override
    public void setMaxScore(Object maxScore) {
        this.maxScore = maxScore;
    }
}
