import mongoose from "mongoose";

export class HDBCarParkDisplacementArray
{
    constructor(
        public _id: mongoose.Types.ObjectId,
        public car_park_no: string,
        public displacement: number,
    ) {}
}