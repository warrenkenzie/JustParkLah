export class HDBCarparkInformation
{
    constructor(
        public _id: number,
        public address: string,
        public x_coord: number,
        public y_coord: number,
        public longitude: number,
        public latitude: number,
        public car_park_type: string,
        public type_of_parking_system: string,
        public short_term_parking: string,
        public free_parking: string,
        public night_parking: string,
        public car_park_decks: string,
        public gantry_height: string,
        public car_park_basement: string,
    ) {}
}