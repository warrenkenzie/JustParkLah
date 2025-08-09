import proj4 from "proj4";

export function haversineDistance({ lat1, lon1 }: { lat1: number; lon1: number }, {lat2, lon2}:{lat2: number, lon2: number}): number {
    const R = 6371; // Earth's radius in km

    // Convert degrees to radians
    const toRad = (deg: number) => (deg * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.asin(Math.sqrt(a));
    return R * c; // Distance in km
}

export function convertCoordinatesToLogLat(x_coord: number, y_coord: number): [number, number] {
    const projection_SVY21 = "+proj=tmerc +lat_0=1.36666666666667 +lon_0=103.833333333333 +k=1 +x_0=28001.642 +y_0=38744.572 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs";
    return proj4(projection_SVY21, "EPSG:4326", [x_coord, y_coord]);
}