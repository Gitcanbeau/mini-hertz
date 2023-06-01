import StoragehouseCurrentLoans from "../../../models/StoragehouseCurrentLoans";

export const LoansModal: React.FC<{ storagehouseCurrentLoan: StoragehouseCurrentLoans, mobile: boolean, returnCar: any,
    renewLoan: any }> = (props) => {
    return (
        <div className='modal fade' id={props.mobile ? `mobilemodal${props.storagehouseCurrentLoan.car.id}` : 
            `modal${props.storagehouseCurrentLoan.car.id}`} data-bs-backdrop='static' data-bs-keyboard='false' 
            aria-labelledby='staticBackdropLabel' aria-hidden='true' key={props.storagehouseCurrentLoan.car.id}>
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h5 className='modal-title' id='staticBackdropLabel'>
                                Loan Options
                            </h5>
                            <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'>
                            </button>
                        </div>
                        <div className='modal-body'>
                            <div className='container'>
                                <div className='mt-3'>
                                    <div className='row'>
                                        <div className='col-2'>
                                            {props.storagehouseCurrentLoan.car?.img ?
                                                <img src={props.storagehouseCurrentLoan.car?.img} 
                                                    width='56' height='87' alt='car'/>
                                                :
                                                <img src={require('./../../../Images/carsImages/car-rent2car-1000.png')} 
                                                    width='56' height='87' alt='car'/>
                                            }
                                        </div>
                                        <div className='col-10'>
                                            <h6>{props.storagehouseCurrentLoan.car.author}</h6>
                                            <h4>{props.storagehouseCurrentLoan.car.title}</h4>
                                        </div>
                                    </div>
                                    <hr/>
                                    {props.storagehouseCurrentLoan.daysLeft > 0 && 
                                        <p className='text-secondary'>
                                            Due in {props.storagehouseCurrentLoan.daysLeft} days.
                                        </p>
                                    }
                                    {props.storagehouseCurrentLoan.daysLeft === 0 && 
                                        <p className='text-success'>
                                             Due Today.
                                        </p>
                                    }
                                    {props.storagehouseCurrentLoan.daysLeft < 0 && 
                                        <p className='text-danger'>
                                            Past due by {props.storagehouseCurrentLoan.daysLeft} days.
                                        </p>
                                    }
                                    <div className='list-group mt-3'>
                                        <button onClick={() => props.returnCar(props.storagehouseCurrentLoan.car.id)} 
                                           data-bs-dismiss='modal' className='list-group-item list-group-item-action' 
                                           aria-current='true'>
                                            Return car
                                        </button>
                                        <button onClick={
                                            props.storagehouseCurrentLoan.daysLeft < 0 ? 
                                            (event) => event.preventDefault() 
                                            :
                                            () => props.renewLoan(props.storagehouseCurrentLoan.car.id)
                                        } 
                                            data-bs-dismiss='modal' 
                                            className={
                                                props.storagehouseCurrentLoan.daysLeft < 0 ? 
                                                'list-group-item list-group-item-action inactiveLink' : 
                                                'list-group-item list-group-item-action'
                                            }>
                                            {props.storagehouseCurrentLoan.daysLeft < 0 ? 
                                            'Late dues cannot be renewed' : 'Renew loan for 7 days'    
                                            }
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='modal-footer'>
                            <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
        </div>
    );
}