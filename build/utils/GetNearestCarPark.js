"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNearestAvailableCarPark = getNearestAvailableCarPark;
const CarParkAvailabilityModel_1 = require("../class/CarParkAvailabilityModel");
function getNearestAvailableCarPark(carParksDisplacementArray) {
    return __awaiter(this, void 0, void 0, function* () {
        const percentageOfAvailableSpotsThreshold = Number(process.env.PERCENTAGE_OF_AVAILABLE_CAR_PARK_SPOTS_THRESHOLD);
        try {
            for (const carPark of carParksDisplacementArray) {
                const carParkAvailabilityInfo = yield CarParkAvailabilityModel_1.CarParkAvailabilityModel.findOne({ carpark_number: carPark.car_park_no });
                if (!carParkAvailabilityInfo)
                    continue;
                const availableCarParkSpots = carParkAvailabilityInfo.carpark_info.reduce((sum, info) => {
                    return sum + info.lots_available;
                }, 0);
                const totalCarParkSpots = carParkAvailabilityInfo.carpark_info.reduce((sum, info) => {
                    return sum + info.total_lots;
                }, 0);
                if (totalCarParkSpots === 0)
                    continue;
                const percentageOfAvailableSpots = (availableCarParkSpots / totalCarParkSpots) * 100;
                if (percentageOfAvailableSpots > percentageOfAvailableSpotsThreshold) {
                    return { availableCarParkInfo: carParkAvailabilityInfo, carParkNo: carPark.car_park_no, availableCarParkSpots, totalCarParkSpots };
                }
            }
            return null;
        }
        catch (error) {
            console.error("GetNearestAvailableCarPark function error:", error);
            return null;
        }
    });
}
