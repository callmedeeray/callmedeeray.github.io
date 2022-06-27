
let planetMultiplier: number = 300;
let sunMultiplier: number = 30;

export const BODIES: { id: number, body: string, radius: number}[] =
[
    { id: 10, body: 'sun', radius: 432690*sunMultiplier },
    { id: 199, body: 'mercury', radius: 1516*planetMultiplier },
    { id: 299, body: 'venus', radius: 3760.4*planetMultiplier },
    { id: 301, body: 'moon', radius: 1079.6*planetMultiplier },
    { id: 499, body: 'mars', radius: 2106.1*planetMultiplier },
    { id: 599, body: 'jupiter', radius: 43441*planetMultiplier },
    { id: 699, body: 'saturn', radius: 36184*planetMultiplier },
    { id: 799, body: 'uranus', radius: 15759*planetMultiplier },
    { id: 899, body: 'neptune', radius: 15299*planetMultiplier },
    // { id: 399,  body: 'earth', radius: 3958.8 },
]