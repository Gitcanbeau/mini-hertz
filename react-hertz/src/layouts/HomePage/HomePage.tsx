import { Carousel } from "./components/Carousel";
import { ExploreTopCars } from "./components/ExploreTopCars";
import { Heros } from "./components/Heros";
import { StoragehouseServices } from "./components/StoragehouseServices";

export const HomePage = () => {
    return (
        <>
            <ExploreTopCars/>
            <Carousel/>
            <Heros/>
            <StoragehouseServices/>
        </>
    );
}