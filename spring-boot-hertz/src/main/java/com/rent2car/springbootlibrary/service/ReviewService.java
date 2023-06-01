package com.rent2car.springbootlibrary.service;

import com.rent2car.springbootlibrary.dao.CarRepository;
import com.rent2car.springbootlibrary.dao.ReviewRepository;
import com.rent2car.springbootlibrary.entity.Review;
import com.rent2car.springbootlibrary.requestmodels.ReviewRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.LocalDate;

@Service
@Transactional
public class ReviewService {

    private ReviewRepository reviewRepository;

    @Autowired
    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    public void postReview(String userEmail, ReviewRequest reviewRequest) throws Exception {
        Review validateReview = reviewRepository.findByUserEmailAndCarId(userEmail, reviewRequest.getCarId());
        if (validateReview != null) {
            throw new Exception("Review already created");
        }

        Review review = new Review();
        review.setCarId(reviewRequest.getCarId());
        review.setRating(reviewRequest.getRating());
        review.setUserEmail(userEmail);
        if (reviewRequest.getReviewDescription().isPresent()) {
            review.setReviewDescription(reviewRequest.getReviewDescription().map(
                    Object::toString
            ).orElse(null));
        }
        review.setDate(Date.valueOf(LocalDate.now()));
        reviewRepository.save(review);
    }

    public Boolean userReviewListed(String userEmail, Long carId) {
        Review validateReview = reviewRepository.findByUserEmailAndCarId(userEmail, carId);
        if (validateReview != null) {
            return true;
        } else {
            return false;
        }
    }

}









