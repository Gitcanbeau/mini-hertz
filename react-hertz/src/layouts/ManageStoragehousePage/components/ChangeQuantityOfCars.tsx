import React from "react";
import { useEffect, useState } from "react";
import CarModel from '../../../models/CarModel';
import { SpinnerLoading } from '../../Utils/SpinnerLoading';
import { Pagination } from '../../Utils/Pagination';
import { ChangeQuantityOfCar } from "./ChangeQuantityOfCar";

export const ChangeQuantityOfCars = () => {

    const [cars, setCars] = useState<CarModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [carsPerPage] = useState(5);
    const [totalAmountOfCars, setTotalAmountOfCars] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [carDelete, setCarDelete] = useState(false);

    useEffect(() => {
        const fetchCars = async () => {
            const baseUrl: string = `${process.env.REACT_APP_API}/cars?page=${currentPage - 1}&size=${carsPerPage}`;

            const response = await fetch(baseUrl);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();

            const responseData = responseJson._embedded.cars;

            setTotalAmountOfCars(responseJson.page.totalElements);
            setTotalPages(responseJson.page.totalPages);

            const loadedCars: CarModel[] = [];

            for (const key in responseData) {
                loadedCars.push({
                    id: responseData[key].id,
                    title: responseData[key].title,
                    author: responseData[key].author,
                    description: responseData[key].description,
                    copies: responseData[key].copies,
                    copiesAvailable: responseData[key].copiesAvailable,
                    category: responseData[key].category,
                    img: responseData[key].img,
                });
            }

            setCars(loadedCars);
            setIsLoading(false);
        };
        fetchCars().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, [currentPage, carDelete]);

    const indexOfLastCar: number = currentPage * carsPerPage;
    const indexOfFirstcar: number = indexOfLastCar - carsPerPage;
    let lastItem = carsPerPage * currentPage <= totalAmountOfCars ?
        carsPerPage * currentPage : totalAmountOfCars;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const deleteCar = () => setCarDelete(!carDelete);

    if (isLoading) {
        return (
            <SpinnerLoading/>
        );
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        );
    }

    return (
        <div className='container mt-5'>
            {totalAmountOfCars > 0 ?
                <>
                    <div className='mt-3'>
                        <h3>Number of results: ({totalAmountOfCars})</h3>
                    </div>
                    <p>
                        {indexOfFirstcar + 1} to {lastItem} of {totalAmountOfCars} items: 
                    </p>
                    {cars.map(car => (
                       <ChangeQuantityOfCar car={car} key={car.id} deleteCar={deleteCar}/>
                    ))}
                </>
                :
                <h5>Add a car before changing quantity</h5>
            }
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>}
        </div>
    );
}