import React from 'react'
import { Link } from 'react-router-dom';
import CarModel from '../../../models/CarModel';

export const ReturnCar: React.FC<{car: CarModel}> = (props) => {
    return (
        <div className='col-xs-6 col-sm-6 col-md-4 col-lg-3 mb-3'>
            <div className='text-center'>
                {props.car.img ? 
                    <img
                        src={props.car.img}
                        width='151'
                        height='233'
                        alt="car"
                    />
                    :
                    <img
                        src={require('./../../../Images/carsImages/car-rent2car-1000.png')}
                        width='151'
                        height='233'
                        alt="car"
                    />
                }
                <h6 className='mt-2'>{props.car.title}</h6>
                <p>{props.car.author}</p>
                <Link className='btn main-color text-white' to={`checkout/${props.car.id}`}>Reserve</Link>
            </div>
        </div>
    );
}