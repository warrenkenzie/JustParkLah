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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCarParkInfo = getCarParkInfo;
const proj4_1 = __importDefault(require("proj4"));
const HDBCarparkInformation_1 = require("./../class/HDBCarparkInformation");
function getCarParkInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        const datasetId = "d_23f946fa557947f93a8043bbef41dd09";
        const url = "https://data.gov.sg/api/action/datastore_search?resource_id=" + datasetId;
        const response = yield fetch(url);
        try {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = yield response.json();
            if (!data || !data.result || !data.result.records) {
                throw new Error("Invalid data format");
            }
            const data_HDBParkingInfo = data.result.records.map((record) => {
                const x_coord = Number(record.x_coord);
                const y_coord = Number(record.y_coord);
                const [longitude, latitude] = convertCoordinatesToLatLng(x_coord, y_coord);
                return new HDBCarparkInformation_1.HDBCarparkInformation(Number(record._id), String(record.address), x_coord, y_coord, longitude, latitude, String(record.car_park_type), String(record.type_of_parking_system), String(record.short_term_parking), String(record.free_parking), String(record.night_parking), String(record.car_park_decks), String(record.gantry_height), String(record.car_park_basement));
            });
            return data_HDBParkingInfo;
        }
        catch (error) {
            console.error("Error fetching data:", error);
            return null;
        }
    });
}
function convertCoordinatesToLatLng(x_coord, y_coord) {
    const projection_SVY21 = "+proj=tmerc +lat_0=1.36666666666667 +lon_0=103.833333333333 +k=1 +x_0=28001.642 +y_0=38744.572 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs";
    return (0, proj4_1.default)(projection_SVY21, "EPSG:4326", [x_coord, y_coord]);
}
