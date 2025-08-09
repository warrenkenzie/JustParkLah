import { error } from 'console';
import { CarParkAvailabilityInterface, CarParkAvailabilityModel } from '../class/CarParkAvailabilityModel';
import { HDBCarParkDisplacementArray } from '../class/HDBCarParkDisplacement';

export async function getNearestAvailableCarPark(carParksDisplacementArray: HDBCarParkDisplacementArray[])
: Promise< {availableCarParkInfo: CarParkAvailabilityInterface, carParkNo: string, availableCarParkSpots: number, totalCarParkSpots: number} | null> {
    const percentageOfAvailableSpotsThreshold = Number(process.env.PERCENTAGE_OF_AVAILABLE_CAR_PARK_SPOTS_THRESHOLD);
    try {
        for (const carPark of carParksDisplacementArray) {
            const carParkAvailabilityInfo = await CarParkAvailabilityModel.findOne({ carpark_number: carPark.car_park_no });
            if (!carParkAvailabilityInfo) continue;
            const availableCarParkSpots = carParkAvailabilityInfo.carpark_info.reduce((sum, info) => {
                return sum + info.lots_available;
            }, 0);
            const totalCarParkSpots = carParkAvailabilityInfo.carpark_info.reduce((sum, info) => {
                return sum + info.total_lots;
            }, 0);
            if (totalCarParkSpots === 0) continue; 
            const percentageOfAvailableSpots = (availableCarParkSpots / totalCarParkSpots) * 100;
            if (percentageOfAvailableSpots > percentageOfAvailableSpotsThreshold) {
                return {availableCarParkInfo: carParkAvailabilityInfo, carParkNo: carPark.car_park_no, availableCarParkSpots, totalCarParkSpots};
            }
        }
        return null;
        
    } catch (error) {
        console.error("GetNearestAvailableCarPark function error:", error);
        return null;
    }
}