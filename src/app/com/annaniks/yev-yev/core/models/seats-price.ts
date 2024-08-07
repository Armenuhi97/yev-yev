export interface ISeatsPrice {
    four_seats: number;
    six_seats: number;
    seven_seats: number;
    eight_seats: number;
    id?: number;
}

export interface ISeatsPriseFormatted {
    key: string;
    name: string;
    price: number;
    id: number;
}

export enum SeatsName {
    four_seats = '4 տեղանոց',
    six_seats = '6 տեղանոց',
    seven_seats = '7 տեղանոց',
    eight_seats = '8 տեղանոց'
}