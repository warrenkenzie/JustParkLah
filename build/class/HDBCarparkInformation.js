"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HDBCarparkInformation = void 0;
class HDBCarparkInformation {
    constructor(_id, address, x_coord, y_coord, longitude, latitude, car_park_type, type_of_parking_system, short_term_parking, free_parking, night_parking, car_park_decks, gantry_height, car_park_basement) {
        this._id = _id;
        this.address = address;
        this.x_coord = x_coord;
        this.y_coord = y_coord;
        this.longitude = longitude;
        this.latitude = latitude;
        this.car_park_type = car_park_type;
        this.type_of_parking_system = type_of_parking_system;
        this.short_term_parking = short_term_parking;
        this.free_parking = free_parking;
        this.night_parking = night_parking;
        this.car_park_decks = car_park_decks;
        this.gantry_height = gantry_height;
        this.car_park_basement = car_park_basement;
    }
}
exports.HDBCarparkInformation = HDBCarparkInformation;
