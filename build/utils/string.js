"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.strings = void 0;
const dedent_1 = __importDefault(require("dedent"));
exports.strings = {
    start: (0, dedent_1.default) `
        Welcome to parking analysis! This bot works by analyzing car park availability based on your destination. 
        Share your destination location to get the nearest available car park.`,
    noLocation: (0, dedent_1.default) `No car park information available.`,
    noAvailableCarParkFound: (0, dedent_1.default) `No available car parks were found.`,
    pleaseShareDestination: (0, dedent_1.default) `You did not share a location. Please share your destination.`
};
