package com.rent2car.springbootlibrary.service;

import com.rent2car.springbootlibrary.dao.CarRepository;
import com.rent2car.springbootlibrary.dao.CheckoutRepository;
import com.rent2car.springbootlibrary.dao.ReviewRepository;
import com.rent2car.springbootlibrary.entity.Car;
import com.rent2car.springbootlibrary.requestmodels.AddCarRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class AdminService {

    private CarRepository carRepository;
    private ReviewRepository reviewRepository;
    private CheckoutRepository checkoutRepository;

    @Autowired
    public AdminService (CarRepository carRepository,
                         ReviewRepository reviewRepository,
                         CheckoutRepository checkoutRepository) {
        this.carRepository = carRepository;
        this.reviewRepository = reviewRepository;
        this.checkoutRepository = checkoutRepository;
    }

    public void increaseBookQuantity(Long carId) throws Exception {

        Optional<Car> car = carRepository.findById(carId);

        if (!car.isPresent()) {
            throw new Exception("Car not found");
        }

        car.get().setCopiesAvailable(car.get().getCopiesAvailable() + 1);
        car.get().setCopies(car.get().getCopies() + 1);

        carRepository.save(car.get());
    }

    public void decreaseBookQuantity(Long bookId) throws Exception {

        Optional<Car> car = carRepository.findById(bookId);

        if (!car.isPresent() || car.get().getCopiesAvailable() <= 0 || car.get().getCopies() <= 0) {
            throw new Exception("Book not found or quantity locked");
        }

        car.get().setCopiesAvailable(car.get().getCopiesAvailable() - 1);
        car.get().setCopies(car.get().getCopies() - 1);

        carRepository.save(car.get());
    }

    public void postCar(AddCarRequest addCarRequest) {
        Car car = new Car();
        car.setTitle(addCarRequest.getTitle());
        car.setAuthor(addCarRequest.getAuthor());
        car.setDescription(addCarRequest.getDescription());
        car.setCopies(addCarRequest.getCopies());
        car.setCopiesAvailable(addCarRequest.getCopies());
        car.setCategory(addCarRequest.getCategory());
        car.setImg(addCarRequest.getImg());
        carRepository.save(car);
    }

    public void deleteBook(Long carId) throws Exception {

        Optional<Car> car = carRepository.findById(carId);

        if (!car.isPresent()) {
            throw new Exception("Book not found");
        }

        carRepository.delete(car.get());
        checkoutRepository.deleteAllByCarId(carId);
        reviewRepository.deleteAllByCarId(carId);
    }
}
