import dedent from "dedent"

export const strings = {
    start: dedent`
        Welcome to parking analysis! This bot works by analyzing car park availability based on your destination. 
        Share your destination location to get the nearest available car park.`,

    noLocation: dedent`No car park information available.`,

    noAvailableCarParkFound: dedent`No available car parks were found.`,

    pleaseShareDestination: dedent`You did not share a location. Please share your destination.`

}