import { useOktaAuth } from '@okta/okta-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StoragehouseCurrentLoans from '../../../models/StoragehouseCurrentLoans';
import { SpinnerLoading } from '../../Utils/SpinnerLoading';
import { LoansModal } from './LoansModal';

export const Loans = () => {
    
    const { authState } = useOktaAuth();
    const [httpError, setHttpError] = useState(null);

    // Current Loans
    const [storagehouseCurrentLoans, setStoragehouseCurrentLoans] = useState<StoragehouseCurrentLoans[]>([]);
    const [isLoadingUserLoans, setIsLoadingUserLoans] = useState(true);
    const [checkout, setCheckout] = useState(false);

    useEffect(() => {
        const fetchUserCurrentLoans = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `${process.env.REACT_APP_API}/cars/secure/currentloans`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const storagehouseCurrentLoansResponse = await fetch(url, requestOptions);
                if (!storagehouseCurrentLoansResponse.ok) {
                    throw new Error('Something went wrong!');
                }
                const storagehouseCurrentLoansResponseJson = await storagehouseCurrentLoansResponse.json();
                setStoragehouseCurrentLoans(storagehouseCurrentLoansResponseJson);
            }
            setIsLoadingUserLoans(false);
        }
        fetchUserCurrentLoans().catch((error: any) => {
            setIsLoadingUserLoans(false);
            setHttpError(error.message);
        })
        window.scrollTo(0, 0);
    }, [authState, checkout]);

    if (isLoadingUserLoans) {
        return (
            <SpinnerLoading/>
        );
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>
                    {httpError}
                </p>
            </div>
        );
    }

    async function returnCar(carId: number) {
        const url = `${process.env.REACT_APP_API}/cars/secure/return/?carId=${carId}`;
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };
        const returnResponse = await fetch(url, requestOptions);
        if (!returnResponse.ok) {
            throw new Error('Something went wrong!');
        }
        setCheckout(!checkout);
    }

    async function renewLoan(carId: number) {
        const url = `${process.env.REACT_APP_API}/cars/secure/renew/loan/?carId=${carId}`;
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        const returnResponse = await fetch(url, requestOptions);
        if (!returnResponse.ok) {
            throw new Error('Something went wrong!');
        }
        setCheckout(!checkout);
    }
    
    return (
        <div>
            {/* Desktop */}
            <div className='d-none d-lg-block mt-2'>
                {storagehouseCurrentLoans.length > 0 ? 
                <>
                    <h5>Current Loans: </h5>

                    {storagehouseCurrentLoans.map(storagehouseCurrentLoan => (
                        <div key={storagehouseCurrentLoan.car.id}>
                            <div className='row mt-3 mb-3'>
                                <div className='col-4 col-md-4 container'>
                                    {storagehouseCurrentLoan.car?.img ? 
                                        <img src={storagehouseCurrentLoan.car?.img} width='226' height='349' alt='car'/>
                                        :
                                        <img src={require('./../../../Images/carsImages/car-rent2car-1000.png')} 
                                            width='226' height='349' alt='car'/>
                                    }
                                </div>
                                <div className='card col-3 col-md-3 container d-flex'>
                                    <div className='card-body'>
                                        <div className='mt-3'>
                                            <h4>Loan Options</h4>
                                            {storagehouseCurrentLoan.daysLeft > 0 && 
                                                <p className='text-secondary'>
                                                    Due in {storagehouseCurrentLoan.daysLeft} days.
                                                </p>
                                            }
                                            {storagehouseCurrentLoan.daysLeft === 0 && 
                                                <p className='text-success'>
                                                    Due Today.
                                                </p>
                                            }
                                            {storagehouseCurrentLoan.daysLeft < 0 && 
                                                <p className='text-danger'>
                                                    Past due by {storagehouseCurrentLoan.daysLeft} days.
                                                </p>
                                            }
                                            <div className='list-group mt-3'>
                                                <button className='list-group-item list-group-item-action' 
                                                    aria-current='true' data-bs-toggle='modal' 
                                                    data-bs-target={`#modal${storagehouseCurrentLoan.car.id}`}>
                                                        Manage Loan
                                                </button>
                                                <Link to={'search'} className='list-group-item list-group-item-action'>
                                                    Search more cars?
                                                </Link>
                                            </div>
                                        </div>
                                        <hr/>
                                        <p className='mt-3'>
                                            Help other find their adventure by reviewing your loan.
                                        </p>
                                        <Link className='btn btn-primary' to={`/checkout/${storagehouseCurrentLoan.car.id}`}>
                                            Leave a review
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <hr/>
                            <LoansModal storagehouseCurrentLoan={storagehouseCurrentLoan} mobile={false} returnCar={returnCar} 
                                renewLoan={renewLoan}/>
                        </div>
                    ))}
                </> :
                <>
                    <h3 className='mt-3'>
                        Currently no loans
                    </h3>
                    <Link className='btn btn-primary' to={`search`}>
                        Search for a new car
                    </Link>
                </>
            }
            </div>

            {/* Mobile */}
            <div className='container d-lg-none mt-2'>
                {storagehouseCurrentLoans.length > 0 ? 
                <>
                    <h5 className='mb-3'>Current Loans: </h5>

                    {storagehouseCurrentLoans.map(storagehouseCurrentLoan => (
                        <div key={storagehouseCurrentLoan.car.id}>
                                <div className='d-flex justify-content-center align-items-center'>
                                    {storagehouseCurrentLoan.car?.img ? 
                                        <img src={storagehouseCurrentLoan.car?.img} width='226' height='349' alt='car'/>
                                        :
                                        <img src={require('./../../../Images/carsImages/car-rent2car-1000.png')} 
                                            width='226' height='349' alt='car'/>
                                    }
                                </div>
                                <div className='card d-flex mt-5 mb-3'>
                                    <div className='card-body container'>
                                        <div className='mt-3'>
                                            <h4>Loan Options</h4>
                                            {storagehouseCurrentLoan.daysLeft > 0 && 
                                                <p className='text-secondary'>
                                                    Due in {storagehouseCurrentLoan.daysLeft} days.
                                                </p>
                                            }
                                            {storagehouseCurrentLoan.daysLeft === 0 && 
                                                <p className='text-success'>
                                                    Due Today.
                                                </p>
                                            }
                                            {storagehouseCurrentLoan.daysLeft < 0 && 
                                                <p className='text-danger'>
                                                    Past due by {storagehouseCurrentLoan.daysLeft} days.
                                                </p>
                                            }
                                            <div className='list-group mt-3'>
                                                <button className='list-group-item list-group-item-action' 
                                                    aria-current='true' data-bs-toggle='modal' 
                                                    data-bs-target={`#mobilemodal${storagehouseCurrentLoan.car.id}`}>
                                                        Manage Loan
                                                </button>
                                                <Link to={'search'} className='list-group-item list-group-item-action'>
                                                    Search more cars?
                                                </Link>
                                            </div>
                                        </div>
                                        <hr/>
                                        <p className='mt-3'>
                                            Help other find their adventure by reviewing your loan.
                                        </p>
                                        <Link className='btn btn-primary' to={`/checkout/${storagehouseCurrentLoan.car.id}`}>
                                            Leave a review
                                        </Link>
                                    </div>
                                </div>
                            
                            <hr/>
                            <LoansModal storagehouseCurrentLoan={storagehouseCurrentLoan} mobile={true} returnCar={returnCar} 
                                renewLoan={renewLoan}/>
                        </div>
                    ))}
                </> :
                <>
                    <h3 className='mt-3'>
                        Currently no loans
                    </h3>
                    <Link className='btn btn-primary' to={`search`}>
                        Search for a new car
                    </Link>
                </>
            }
            </div>
        </div>
    );
}