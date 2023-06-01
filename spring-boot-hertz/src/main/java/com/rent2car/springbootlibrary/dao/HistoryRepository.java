package com.rent2car.springbootlibrary.dao;

import com.rent2car.springbootlibrary.entity.History;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.RequestParam;

public interface HistoryRepository extends JpaRepository<History, Long> {
    Page<History> findCarsByUserEmail(@RequestParam("email") String userEmail, Pageable pageable);
}
