"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.haversineDistance = haversineDistance;
exports.convertCoordinatesToLogLat = convertCoordinatesToLogLat;
const proj4_1 = __importDefault(require("proj4"));
function haversineDistance({ lat1, lon1 }, { lat2, lon2 }) {
    const R = 6371;
    const toRad = (deg) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.pow(Math.sin(dLat / 2), 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.pow(Math.sin(dLon / 2), 2);
    const c = 2 * Math.asin(Math.sqrt(a));
    return R * c;
}
function convertCoordinatesToLogLat(x_coord, y_coord) {
    const projection_SVY21 = "+proj=tmerc +lat_0=1.36666666666667 +lon_0=103.833333333333 +k=1 +x_0=28001.642 +y_0=38744.572 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs";
    return (0, proj4_1.default)(projection_SVY21, "EPSG:4326", [x_coord, y_coord]);
}
