package com.rent2car.springbootlibrary.requestmodels;

import lombok.Data;

@Data
public class AddCarRequest {

    private String title;

    private String author;

    private String description;

    private int copies;

    private String category;

    private String img;

}
