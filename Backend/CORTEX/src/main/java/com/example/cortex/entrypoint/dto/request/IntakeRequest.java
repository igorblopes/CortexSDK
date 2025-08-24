package com.example.cortex.entrypoint.dto.request;

import com.example.cortex.core.TypeData;

public class IntakeRequest {

    private String typeData;
    private Object data;


    public String getTypeData() {
        return typeData;
    }

    public void setTypeData(String typeData) {
        this.typeData = typeData;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}
