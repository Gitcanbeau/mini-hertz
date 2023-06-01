class ReviewRequestModel {
    rating: number;
    carId: number;
    reviewDescription?: string;

    constructor(rating: number, carId: number, reviewDescription: string) {
        this.rating = rating;
        this.carId = carId;
        this.reviewDescription = reviewDescription;
    }
}

export default ReviewRequestModel;