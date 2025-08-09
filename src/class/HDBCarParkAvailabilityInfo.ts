export class HDBCarParkAvailabilityInfo
{
    constructor(
        public carpark_info: {
            total_lots: number,
            lot_type: string,
            lots_available: number
        },
        public carpark_number: string,
        public update_datetime: Date,
    ) {}
}