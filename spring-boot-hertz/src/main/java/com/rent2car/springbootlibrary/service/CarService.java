package com.rent2car.springbootlibrary.service;

import com.rent2car.springbootlibrary.dao.CarRepository;
import com.rent2car.springbootlibrary.dao.CheckoutRepository;
import com.rent2car.springbootlibrary.dao.HistoryRepository;
import com.rent2car.springbootlibrary.dao.PaymentRepository;
import com.rent2car.springbootlibrary.entity.Car;
import com.rent2car.springbootlibrary.entity.Checkout;
import com.rent2car.springbootlibrary.entity.History;
import com.rent2car.springbootlibrary.entity.Payment;
import com.rent2car.springbootlibrary.responsemodels.StoragehouseCurrentLoansResponse;
import net.bytebuddy.asm.Advice;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;


@Service
@Transactional
public class CarService {

    private CarRepository carRepository;

    private CheckoutRepository checkoutRepository;

    private HistoryRepository historyRepository;

    private PaymentRepository paymentRepository;

    public CarService(CarRepository carRepository, CheckoutRepository checkoutRepository,
                       HistoryRepository historyRepository, PaymentRepository paymentRepository) {
        this.carRepository = carRepository;
        this.checkoutRepository = checkoutRepository;
        this.historyRepository = historyRepository;
        this.paymentRepository = paymentRepository;
    }

    public Car checkoutCar (String userEmail, Long carId) throws Exception {

        Optional<Car> car = carRepository.findById(carId);

        Checkout validateCheckout = checkoutRepository.findByUserEmailAndCarId(userEmail, carId);

        if (!car.isPresent() || validateCheckout != null || car.get().getCopiesAvailable() <= 0) {
            throw new Exception("Car doesn't exist or already checked out by user");
        }

        List<Checkout> currentCarsCheckedOut = checkoutRepository.findCarsByUserEmail(userEmail);

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        boolean carNeedsReturned = false;

        for (Checkout checkout: currentCarsCheckedOut) {
            Date d1 = sdf.parse(checkout.getReturnDate());
            Date d2 = sdf.parse(LocalDate.now().toString());

            TimeUnit time = TimeUnit.DAYS;

            double differenceInTime = time.convert(d1.getTime() - d2.getTime(), TimeUnit.MILLISECONDS);

            if (differenceInTime < 0) {
                carNeedsReturned = true;
                break;
            }
        }

        Payment userPayment = paymentRepository.findByUserEmail(userEmail);

        if ((userPayment != null && userPayment.getAmount() > 0) || (userPayment != null && carNeedsReturned)) {
            throw new Exception("Outstanding fees");
        }

        if (userPayment == null) {
            Payment payment = new Payment();
            payment.setAmount(00.00);
            payment.setUserEmail(userEmail);
            paymentRepository.save(payment);
        }

        car.get().setCopiesAvailable(car.get().getCopiesAvailable() - 1);
        carRepository.save(car.get());

        Checkout checkout = new Checkout(
                userEmail,
                LocalDate.now().toString(),
                LocalDate.now().plusDays(7).toString(),
                car.get().getId()
        );

        checkoutRepository.save(checkout);

        return car.get();
    }

    public Boolean checkoutCarByUser(String userEmail, Long carId) {
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndCarId(userEmail, carId);
        if (validateCheckout != null) {
            return true;
        } else {
            return false;
        }
    }

    public int currentLoansCount(String userEmail) {
        return checkoutRepository.findCarsByUserEmail(userEmail).size();
    }

    public List<StoragehouseCurrentLoansResponse> currentLoans(String userEmail) throws Exception {

        List<StoragehouseCurrentLoansResponse> storagehouseCurrentLoansResponses = new ArrayList<>();

        List<Checkout> checkoutList = checkoutRepository.findCarsByUserEmail(userEmail);
        List<Long> carIdList = new ArrayList<>();

        for (Checkout i: checkoutList) {
            carIdList.add(i.getCarId());
        }

        List<Car> cars = carRepository.findCarsByCarIds(carIdList);

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        for (Car car : cars) {
            Optional<Checkout> checkout = checkoutList.stream()
                    .filter(x -> x.getCarId() == car.getId()).findFirst();

            if (checkout.isPresent()) {

                Date d1 = sdf.parse(checkout.get().getReturnDate());
                Date d2 = sdf.parse(LocalDate.now().toString());

                TimeUnit time = TimeUnit.DAYS;

                long difference_In_Time = time.convert(d1.getTime() - d2.getTime(),
                        TimeUnit.MILLISECONDS);

                storagehouseCurrentLoansResponses.add(new StoragehouseCurrentLoansResponse(car, (int) difference_In_Time));
            }
        }
        return storagehouseCurrentLoansResponses;
    }

    public void returnCar (String userEmail, Long carId) throws Exception {

        Optional<Car> car = carRepository.findById(carId);

        Checkout validateCheckout = checkoutRepository.findByUserEmailAndCarId(userEmail, carId);

        if (!car.isPresent() || validateCheckout == null) {
            throw new Exception("Book does not exist or not checked out by user");
        }

        car.get().setCopiesAvailable(car.get().getCopiesAvailable() + 1);

        carRepository.save(car.get());

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        Date d1 = sdf.parse(validateCheckout.getReturnDate());
        Date d2 = sdf.parse(LocalDate.now().toString());

        TimeUnit time = TimeUnit.DAYS;

        double differenceInTime = time.convert(d1.getTime() - d2.getTime(), TimeUnit.MILLISECONDS);

        if (differenceInTime < 0) {
            Payment payment = paymentRepository.findByUserEmail(userEmail);

            payment.setAmount(payment.getAmount() + (differenceInTime * -1));
            paymentRepository.save(payment);
        }

        checkoutRepository.deleteById(validateCheckout.getId());

        History history = new History(
                userEmail,
                validateCheckout.getCheckoutDate(),
                LocalDate.now().toString(),
                car.get().getTitle(),
                car.get().getAuthor(),
                car.get().getDescription(),
                car.get().getImg()
        );

        historyRepository.save(history);
    }

    public void renewLoan(String userEmail, Long bookId) throws Exception {

        Checkout validateCheckout = checkoutRepository.findByUserEmailAndCarId(userEmail, bookId);

        if (validateCheckout == null) {
            throw new Exception("Book does not exist or not checked out by user");
        }

        SimpleDateFormat sdFormat = new SimpleDateFormat("yyyy-MM-dd");

        Date d1 = sdFormat.parse(validateCheckout.getReturnDate());
        Date d2 = sdFormat.parse(LocalDate.now().toString());

        if (d1.compareTo(d2) > 0 || d1.compareTo(d2) == 0) {
            validateCheckout.setReturnDate(LocalDate.now().plusDays(7).toString());
            checkoutRepository.save(validateCheckout);
        }
    }

}















