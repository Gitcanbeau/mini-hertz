import CarModel from "./CarModel";

class StoragehouseCurrentLoans {
    car: CarModel;
    daysLeft: number;

    constructor(car: CarModel, daysLeft: number) {
        this.car = car;
        this.daysLeft = daysLeft;
    }
}

export default StoragehouseCurrentLoans;