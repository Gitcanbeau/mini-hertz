import { useOktaAuth } from '@okta/okta-react';
import { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { AddNewCar } from './components/AddNewCar';
import { AdminMessages } from './components/AdminMessages';
import { ChangeQuantityOfCars } from './components/ChangeQuantityOfCars';

export const ManageStoragehousePage = () => {

    const { authState } = useOktaAuth();

    const [changeQuantityOfCarsClick, setChangeQuantityOfCarsClick] = useState(false);
    const [messagesClick, setMessagesClick] = useState(false);

    function addCarClickFunction() {
        setChangeQuantityOfCarsClick(false);
        setMessagesClick(false);
    }

    function changeQuantityOfCarsClickFunction() {
        setChangeQuantityOfCarsClick(true);
        setMessagesClick(false);
    }

    function messagesClickFunction() {
        setChangeQuantityOfCarsClick(false);
        setMessagesClick(true);
    }

    if (authState?.accessToken?.claims.userType === undefined) {
        return <Redirect to='/home'/>
    }

    return (
        <div className='container'>
            <div className='mt-5'>
                <h3>Manage Storagehouse</h3>
                <nav>
                    <div className='nav nav-tabs' id='nav-tab' role='tablist'>
                        <button onClick={addCarClickFunction} className='nav-link active' id='nav-add-car-tab' data-bs-toggle='tab' 
                            data-bs-target='#nav-add-car' type='button' role='tab' aria-controls='nav-add-car' 
                            aria-selected='false'
                        >
                            Add new car
                        </button>
                        <button onClick={changeQuantityOfCarsClickFunction} className='nav-link' id='nav-quantity-tab' data-bs-toggle='tab' 
                            data-bs-target='#nav-quantity' type='button' role='tab' aria-controls='nav-quantity' 
                            aria-selected='true'
                        >
                            Change quantity
                        </button>
                        <button onClick={messagesClickFunction} className='nav-link' id='nav-messages-tab' data-bs-toggle='tab' 
                            data-bs-target='#nav-messages' type='button' role='tab' aria-controls='nav-messages' 
                            aria-selected='false'
                        >
                            Messages
                        </button>
                    </div>
                </nav>
                <div className='tab-content' id='nav-tabContent'> 
                    <div className='tab-pane fade show active' id='nav-add-car' role='tabpanel'
                        aria-labelledby='nav-add-car-tab'>
                            <AddNewCar/>
                    </div>
                    <div className='tab-pane fade' id='nav-quantity' role='tabpanel' aria-labelledby='nav-quantity-tab'>
                       {changeQuantityOfCarsClick ? <ChangeQuantityOfCars/> : <></>}
                    </div>
                    <div className='tab-pane fade' id='nav-messages' role='tabpanel' aria-labelledby='nav-messages-tab'>
                        {messagesClick ? <AdminMessages/> : <></>}
                    </div>
                </div>
            </div>
        </div>
    );
}