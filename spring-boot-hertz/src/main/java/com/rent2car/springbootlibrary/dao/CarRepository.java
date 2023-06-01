package com.rent2car.springbootlibrary.dao;

import com.rent2car.springbootlibrary.entity.Car;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

public interface CarRepository extends JpaRepository<Car, Long> {

    Page<Car> findByTitleContaining(@RequestParam("title") String title, Pageable pageable);

    Page<Car> findByCategory(@RequestParam("category") String category, Pageable pageable);

    @Query("select o from Car o where id in :car_ids")
    List<Car> findCarsByCarIds (@Param("car_ids") List<Long> carId);
}
