package com.example.cortex.entrypoint.dto.request;

import com.example.cortex.core.TypeData;

public class IntakeRequest {

    private TypeData typeData;
    private Object data;


    public TypeData getTypeData() {
        return typeData;
    }

    public void setTypeData(TypeData typeData) {
        this.typeData = typeData;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}
