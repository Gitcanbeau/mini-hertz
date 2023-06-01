import { Link } from "react-router-dom";
import CarModel from "../../../models/CarModel"

export const SearchCar: React.FC<{ car: CarModel }> = (props) => {
    return (
        <div className='card mt-3 shadow p-3 mb-3 bg-body rounded'>
            <div className='row g-0'>
                <div className='col-md-2'>
                    <div className='d-none d-lg-block'>
                        {props.car.img ?
                            <img src={props.car.img}
                                width='123'
                                height='196'
                                alt='car'
                            />
                            :
                            <img src={require('../../../Images/carsImages/car-rent2car-1000.png')}
                                width='123'
                                height='196'
                                alt='car'
                            />
                        }
                    </div>
                    <div className='d-lg-none d-flex justify-content-center 
                        align-items-center'>
                        {props.car.img ?
                            <img src={props.car.img}
                                width='123'
                                height='196'
                                alt='car'
                            />
                            :
                            <img src={require('../../../Images/carsImages/car-rent2car-1000.png')}
                                width='123'
                                height='196'
                                alt='car'
                            />
                        }
                    </div>
                </div>
                <div className='col-md-6'>
                    <div className='card-body'>
                        <h5 className='card-title'>
                            {props.car.author}
                        </h5>
                        <h4>
                            {props.car.title}
                        </h4>
                        <p className='card-text'>
                            {props.car.description}
                        </p>
                    </div>
                </div>
                <div className='col-md-4 d-flex justify-content-center align-items-center'>
                    <Link className='btn btn-md main-color text-white' to={`/checkout/${props.car.id}`}>
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
}