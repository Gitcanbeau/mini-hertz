import { useEffect, useState } from "react";
import CarModel from "../../../models/CarModel";
import { useOktaAuth } from '@okta/okta-react';

export const ChangeQuantityOfCar: React.FC<{ car: CarModel, deleteCar: any }> = (props, key) => {
    
    const { authState } = useOktaAuth();
    const [quantity, setQuantity] = useState<number>(0);
    const [remaining, setRemaining] = useState<number>(0);

    useEffect(() => {
        const fetchCarInState = () => {
            props.car.copies ? setQuantity(props.car.copies) : setQuantity(0);
            props.car.copiesAvailable ? setRemaining(props.car.copiesAvailable) : setRemaining(0);
        };
        fetchCarInState();
    }, []);

    async function increaseQuantity() {
        const url = `${process.env.REACT_APP_API}/admin/secure/increase/car/quantity/?carId=${props.car?.id}`;
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        const quantityUpdateResponse = await fetch(url, requestOptions);
        if (!quantityUpdateResponse.ok) {
            throw new Error('Something went wrong!');
        }
        setQuantity(quantity + 1);
        setRemaining(remaining + 1);
    }

    async function decreaseQuantity() {
        const url = `${process.env.REACT_APP_API}/admin/secure/decrease/car/quantity/?carId=${props.car?.id}`;
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        const quantityUpdateResponse = await fetch(url, requestOptions);
        if (!quantityUpdateResponse.ok) {
            throw new Error('Something went wrong!');
        }
        setQuantity(quantity - 1);
        setRemaining(remaining - 1);
    }

    async function deleteCar() {
        const url = `${process.env.REACT_APP_API}/admin/secure/delete/car/?carId=${props.car?.id}`;
        const requestOptions = {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        const updateResponse = await fetch(url, requestOptions);
        if (!updateResponse.ok) {
            throw new Error('Something went wrong!');
        }
        props.deleteCar();
    }
    
    return (
        <div className='card mt-3 shadow p-3 mb-3 bg-body rounded'>
            <div className='row g-0'>
                <div className='col-md-2'>
                    <div className='d-none d-lg-block'>
                        {props.car.img ?
                            <img src={props.car.img} width='123' height='196' alt='car' />
                            :
                            <img src={require('./../../../Images/carsImages/car-rent2car-1000.png')} 
                                width='123' height='196' alt='car' />
                        }
                    </div>
                    <div className='d-lg-none d-flex justify-content-center align-items-center'>
                        {props.car.img ?
                            <img src={props.car.img} width='123' height='196' alt='car' />
                            :
                            <img src={require('./../../../Images/carsImages/car-rent2car-1000.png')} 
                                width='123' height='196' alt='car' />
                        }
                    </div>
                </div>
                <div className='col-md-6'>
                    <div className='card-body'>
                        <h5 className='card-title'>{props.car.author}</h5>
                        <h4>{props.car.title}</h4>
                        <p className='card-text'> {props.car.description} </p>
                    </div>
                </div>
                <div className='mt-3 col-md-4'>
                    <div className='d-flex justify-content-center algin-items-center'>
                        <p>Total Quantity: <b>{quantity}</b></p>
                    </div>
                    <div className='d-flex justify-content-center align-items-center'>
                        <p>Cars Remaining: <b>{remaining}</b></p>
                    </div>
                </div>
                <div className='mt-3 col-md-1'>
                    <div className='d-flex justify-content-start'>
                        <button className='m-1 btn btn-md btn-danger' onClick={deleteCar}>Delete</button>
                    </div>
                </div>
                <button className='m1 btn btn-md main-color text-white' onClick={increaseQuantity}>Add Quantity</button>
                <button className='m1 btn btn-md btn-warning' onClick={decreaseQuantity}>Decrease Quantity</button>
            </div>
        </div>
    );
}