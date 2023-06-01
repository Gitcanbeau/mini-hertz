import { useEffect, useState } from "react";
import CarModel from "../../models/CarModel";
import ReviewModel from "../../models/ReviewModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import { LatestReviews } from "./LatestReviews";
import { useOktaAuth } from "@okta/okta-react";
import ReviewRequestModel from "../../models/ReviewRequestModel";

export const CarCheckoutPage = () => {

    const { authState } = useOktaAuth();

    const [car, setCar] = useState<CarModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // Review State
    const [reviews, setReviews] = useState<ReviewModel[]>([])
    const [totalStars, setTotalStars] = useState(0);
    const [isLoadingReview, setIsLoadingReview] = useState(true);

    const [isReviewLeft, setIsReviewLeft] = useState(false);
    const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);

    // Loans Count State
    const [currentLoansCount, setCurrentLoansCount] = useState(0);
    const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] = useState(true);

    // Is Car Check Out?
    const [isCheckedOut, setIsCheckedOut] = useState(false);
    const [isLoadingCarCheckedOut, setIsLoadingCarCheckedOut] = useState(true);

    // Payment
    const [displayError, setDisplayError] = useState(false);

    const carId = (window.location.pathname).split('/')[2];

    useEffect(() => {
        const fetchCar = async () => {
            const baseUrl: string = `${process.env.REACT_APP_API}/cars/${carId}`;

            const response = await fetch(baseUrl);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();

            const loadedCar: CarModel = {
                id: responseJson.id,
                title: responseJson.title,
                author: responseJson.author,
                description: responseJson.description,
                copies: responseJson.copies,
                copiesAvailable: responseJson.copiesAvailable,
                category: responseJson.category,
                img: responseJson.img,
            };

            setCar(loadedCar);
            setIsLoading(false);
        };
        fetchCar().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, [isCheckedOut]);

    useEffect(() => {
        const fetchCarReviews = async () => {
            const reviewUrl: string = `${process.env.REACT_APP_API}/reviews/search/findByCarId?carId=${carId}`;

            const responseReviews = await fetch(reviewUrl);

            if (!responseReviews.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJsonReviews = await responseReviews.json();

            const responseData = responseJsonReviews._embedded.reviews;

            const loadedReviews: ReviewModel[] = [];

            let weightedStarReviews: number = 0;

            for (const key in responseData) {
                loadedReviews.push({
                    id: responseData[key].id,
                    userEmail: responseData[key].userEmail,
                    date: responseData[key].date,
                    rating: responseData[key].rating,
                    car_id: responseData[key].carId,
                    reviewDescription: responseData[key].reviewDescription,
                });
                weightedStarReviews = weightedStarReviews + responseData[key].rating;
            }

            if (loadedReviews) {
                const round = (Math.round((weightedStarReviews / loadedReviews.length) * 2) / 2).toFixed(1);
                setTotalStars(Number(round));
            }

            setReviews(loadedReviews);
            setIsLoadingReview(false);
        };

        fetchCarReviews().catch((error: any) => {
            setIsLoadingReview(false);
            setHttpError(error.message);
        })
    }, [isReviewLeft]);

    useEffect(() => {
        const fetchUserReviewcar = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `${process.env.REACT_APP_API}/reviews/secure/user/car/?carId=${carId}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const userReview = await fetch(url, requestOptions);
                if (!userReview.ok) {
                    throw new Error('Something went wrong');
                }
                const userReviewResponseJson = await userReview.json();
                setIsReviewLeft(userReviewResponseJson);
            }
            setIsLoadingUserReview(false);
        }
        fetchUserReviewcar().catch((error: any) => {
            setIsLoadingUserReview(false);
            setHttpError(error.message);
        })
    }, [authState]);

    useEffect(() => {
        const fetchUserCurrentLoansCount = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `${process.env.REACT_APP_API}/cars/secure/currentloans/count`;
                const requestOptions = {
                    method: 'GET',
                    headers: { 
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                     }
                };
                const currentLoansCountResponse = await fetch(url, requestOptions);
                if (!currentLoansCountResponse.ok)  {
                    throw new Error('Something went wrong!');
                }
                const currentLoansCountResponseJson = await currentLoansCountResponse.json();
                setCurrentLoansCount(currentLoansCountResponseJson);
            }
            setIsLoadingCurrentLoansCount(false);
        }
        fetchUserCurrentLoansCount().catch((error: any) => {
            setIsLoadingCurrentLoansCount(false);
            setHttpError(error.message);
        })
    }, [authState, isCheckedOut]);

    useEffect(() => {
        const fetchUserCheckedOutCar = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `${process.env.REACT_APP_API}/cars/secure/ischeckedout/byuser/?carId=${carId}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const carCheckedOut = await fetch(url, requestOptions);

                if (!carCheckedOut.ok) {
                    throw new Error('Something went wrong!');
                }

                const carCheckedOutResponseJson = await carCheckedOut.json();
                setIsCheckedOut(carCheckedOutResponseJson);
            }
            setIsLoadingCarCheckedOut(false);
        }
        fetchUserCheckedOutCar().catch((error: any) => {
            setIsLoadingCarCheckedOut(false);
            setHttpError(error.message);
        })
    }, [authState]);

    if (isLoading || isLoadingReview || isLoadingCurrentLoansCount || isLoadingCarCheckedOut || isLoadingUserReview) {
        return (
            <SpinnerLoading />
        )
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        )
    }

    async function checkoutCar() {
        const url = `${process.env.REACT_APP_API}/cars/secure/checkout/?carId=${car?.id}`;
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };
        const checkoutResponse = await fetch(url, requestOptions);
        if (!checkoutResponse.ok) {
            setDisplayError(true);
            throw new Error('Something went wrong!');
        }
        setDisplayError(false);
        setIsCheckedOut(true);
    }

    async function submitReview(starInput: number, reviewDescription: string) {
        let carId: number = 0;
        if (car?.id) {
            carId = car.id;
        }

        const reviewRequestModel = new ReviewRequestModel(starInput, carId, reviewDescription);
        const url = `${process.env.REACT_APP_API}/reviews/secure`;
        const requestOptions = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewRequestModel)
        };
        const returnResponse = await fetch(url, requestOptions);
        if (!returnResponse.ok) {
            throw new Error('Something went wrong!');
        }
        setIsReviewLeft(true);
    }

    return (
        <div>
            <div className='container d-none d-lg-block'>
                {displayError && <div className='alert alert-danger mt-3' role='alert'>
                    Please pay outstanding fees and/or return late car(s).
                </div>
                }
                <div className='row mt-5'>
                    <div className='col-sm-2 col-md-2'>
                        {car?.img ?
                            <img src={car?.img} width='226' height='349' alt='car' />
                            :
                            <img src={require('./../../Images/carsImages/car-rent2car-1000.png')} width='226'
                                height='349' alt='car' />
                        }
                    </div>
                    <div className='col-4 col-md-4 container'>
                        <div className='ml-2'>
                            <h2>{car?.title}</h2>
                            <h5 className='text-primary'>{car?.author}</h5>
                            <p className='lead'>{car?.description}</p>
                            <StarsReview rating={totalStars} size={32} />
                        </div>
                    </div>
                    <CheckoutAndReviewBox car={car} mobile={false} currentLoansCount={currentLoansCount} 
                        isAuthenticated={authState?.isAuthenticated} isCheckedOut={isCheckedOut} 
                        checkoutCar={checkoutCar} isReviewLeft={isReviewLeft} submitReview={submitReview}/>
                </div>
                <hr />
                <LatestReviews reviews={reviews} carId={car?.id} mobile={false} />
            </div>
            <div className='container d-lg-none mt-5'>
            {displayError && <div className='alert alert-danger mt-3' role='alert'>
                    Please pay outstanding fees and/or return late car(s).
                </div>
                }
                <div className='d-flex justify-content-center alighn-items-center'>
                    {car?.img ?
                        <img src={car?.img} width='226' height='349' alt='car' />
                        :
                        <img src={require('./../../Images/carsImages/car-rent2car-1000.png')} width='226'
                            height='349' alt='car' />
                    }
                </div>
                <div className='mt-4'>
                    <div className='ml-2'>
                        <h2>{car?.title}</h2>
                        <h5 className='text-primary'>{car?.author}</h5>
                        <p className='lead'>{car?.description}</p>
                        <StarsReview rating={totalStars} size={32} />
                    </div>
                </div>
                <CheckoutAndReviewBox car={car} mobile={true} currentLoansCount={currentLoansCount} 
                    isAuthenticated={authState?.isAuthenticated} isCheckedOut={isCheckedOut} 
                    checkoutCar={checkoutCar} isReviewLeft={isReviewLeft} submitReview={submitReview}/>
                <hr />
                <LatestReviews reviews={reviews} carId={car?.id} mobile={true} />
            </div>
        </div>
    );
}