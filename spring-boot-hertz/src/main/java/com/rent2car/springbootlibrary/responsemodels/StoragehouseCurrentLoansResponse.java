package com.rent2car.springbootlibrary.responsemodels;

import com.rent2car.springbootlibrary.entity.Car;
import lombok.Data;

@Data
public class StoragehouseCurrentLoansResponse {

    public StoragehouseCurrentLoansResponse(Car car, int daysLeft) {
        this.car = car;
        this.daysLeft = daysLeft;
    }

    private Car car;

    private int daysLeft;
}
