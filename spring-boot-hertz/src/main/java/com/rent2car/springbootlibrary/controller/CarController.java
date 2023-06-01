package com.rent2car.springbootlibrary.controller;

import com.rent2car.springbootlibrary.entity.Car;
import com.rent2car.springbootlibrary.responsemodels.StoragehouseCurrentLoansResponse;
import com.rent2car.springbootlibrary.service.CarService;
import com.rent2car.springbootlibrary.utils.ExtractJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("https://localhost:3000")
@RestController
@RequestMapping("/api/cars")
public class CarController {

    private CarService carService;

    @Autowired
    public CarController(CarService carService) {
        this.carService = carService;
    }

    @GetMapping("/secure/currentloans")
    public List<StoragehouseCurrentLoansResponse> currentLoans(@RequestHeader(value = "Authorization") String token)
        throws Exception
    {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        return carService.currentLoans(userEmail);
    }

    @GetMapping("/secure/currentloans/count")
    public int currentLoansCount(@RequestHeader(value = "Authorization") String token) {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        return carService.currentLoansCount(userEmail);
    }

    @GetMapping("/secure/ischeckedout/byuser")
    public Boolean checkoutCarByUser(@RequestHeader(value = "Authorization") String token,
                                      @RequestParam Long carId) {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        return carService.checkoutCarByUser(userEmail, carId);
    }

    @PutMapping("/secure/checkout")
    public Car checkoutCar (@RequestHeader(value = "Authorization") String token,
                              @RequestParam Long carId) throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        return carService.checkoutCar(userEmail, carId);
    }

    @PutMapping("/secure/return")
    public void returnBook(@RequestHeader(value = "Authorization") String token,
                           @RequestParam Long carId) throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        carService.returnCar(userEmail, carId);
    }

    @PutMapping("/secure/renew/loan")
    public void renewLoan(@RequestHeader(value = "Authorization") String token,
                          @RequestParam Long bookId) throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        carService.renewLoan(userEmail, bookId);
    }

}












