import { useEffect, useState } from 'react';
import CarModel from '../../models/CarModel';
import { Pagination } from '../Utils/Pagination';
import { SpinnerLoading } from '../Utils/SpinnerLoading';
import { SearchCar } from './components/SearchCar';

export const SearchCarsPage = () => {

    const [cars, setCars] = useState<CarModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [carsPerPage] = useState(5);
    const [totalAmountOfCars, setTotalAmountOfCars] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [searchUrl, setSearchUrl] = useState('');
    const [categorySelection, setCategorySelection] = useState('Car rent category');

    useEffect(() => {
        const fetchCars = async () => {
            const baseUrl: string = `${process.env.REACT_APP_API}/cars`;

            let url: string = '';

            if (searchUrl === '') {
                url = `${baseUrl}?page=${currentPage - 1}&size=${carsPerPage}`;
            } else {
                let searchWithPage = searchUrl.replace('<pageNumber>', `${currentPage - 1}`);
                url = baseUrl + searchWithPage;
            }

            const response = await fetch(url);

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
        window.scrollTo(0, 0);
    }, [currentPage, searchUrl]);

    if (isLoading) {
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

    const searchHandleChange = () => {
        setCurrentPage(1);
        if (search === '') {
            setSearchUrl('');
        } else {
            setSearchUrl(`/search/findByTitleContaining?title=${search}&page=<pageNumber>&size=${carsPerPage}`)
        }
        setCategorySelection('car category')
    }

    const categoryField = (value: string) => {
        setCurrentPage(1);
        if (
            value.toLowerCase() === 'fe' || 
            value.toLowerCase() === 'be' || 
            value.toLowerCase() === 'data' || 
            value.toLowerCase() === 'devops'
        ) {
            setCategorySelection(value);
            setSearchUrl(`/search/findByCategory?category=${value}&page=<pageNumber>&size=${carsPerPage}`)
        } else {
            setCategorySelection('All');
            setSearchUrl(`?page=<pageNumber>&size=${carsPerPage}`)
        }
    }

    const indexOfLastCar: number = currentPage * carsPerPage;
    const indexOfFirstCar: number = indexOfLastCar - carsPerPage;
    let lastItem = carsPerPage * currentPage <= totalAmountOfCars ?
        carsPerPage * currentPage : totalAmountOfCars;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div>
            <div className='container'>
                <div>
                    <div className='row mt-5'>
                        <div className='col-6'>
                            <div className='d-flex'>
                                <input className='form-control me-2' type='search'
                                    placeholder='Search' aria-labelledby='Search'
                                    onChange={e => setSearch(e.target.value)} />
                                <button className='btn btn-outline-success'
                                    onClick={() => searchHandleChange()}>
                                    Search
                                </button>
                            </div>
                        </div>
                        <div className='col-4'>
                            <div className='dropdown'>
                                <button className='btn btn-secondary dropdown-toggle' type='button'
                                    id='dropdownMenuButton1' data-bs-toggle='dropdown'
                                    aria-expanded='false'>
                                    {categorySelection}
                                </button>
                                <ul className='dropdown-menu' aria-labelledby='dropdownMenuButton1'>
                                    <li onClick={() => categoryField('All')}>
                                        <a className='dropdown-item' href='#'>
                                            All
                                        </a>
                                    </li>
                                    <li onClick={() => categoryField('SUV')}>
                                        <a className='dropdown-item' href='#'>
                                            SUV
                                        </a>
                                    </li>
                                    <li onClick={() => categoryField('Sedan')}>
                                        <a className='dropdown-item' href='#'>
                                            Sedan
                                        </a>
                                    </li>
                                    <li onClick={() => categoryField('Minivan')}>
                                        <a className='dropdown-item' href='#'>
                                            Minivan
                                        </a>
                                    </li>
                                    <li onClick={() => categoryField('Hatchback')}>
                                        <a className='dropdown-item' href='#'>
                                            Hatchback
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    {totalAmountOfCars > 0 ?
                        <>
                            <div className='mt-3'>
                                <h5>Number of results: ({totalAmountOfCars})</h5>
                            </div>
                            <p>
                                {indexOfFirstCar + 1} to {lastItem} of {totalAmountOfCars} items:
                            </p>
                            {cars.map(car => (
                                <SearchCar car={car} key={car.id} />
                            ))}
                        </>
                        :
                        <div className='m-5'>
                            <h3>
                                Can't find what you are looking for?
                            </h3>
                            <a type='button' className='btn main-color btn-md px-4 me-md-2 fw-bold text-white'
                                href='#'>Storagehouse Services</a>
                        </div>
                    }
                    {totalPages > 1 &&
                        <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
                    }
                </div>
            </div>
        </div>
    );
}