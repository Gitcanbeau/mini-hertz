package com.rent2car.springbootlibrary.dao;

import com.rent2car.springbootlibrary.entity.Checkout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CheckoutRepository extends JpaRepository<Checkout, Long> {

    Checkout findByUserEmailAndCarId(String userEmail, Long carId);

    List<Checkout> findCarsByUserEmail(String userEmail);

    @Modifying
    @Query("delete from Checkout where car_id in :car_id")
    void deleteAllByCarId(@Param("car_id") Long carId);
}
