import { ISeatsPrice, SeatsName } from "../../../core/models/seats-price";

export function seatsPriceListNormalizer(result: ISeatsPrice) {
    return Object.keys(result).map((key) => ({
        key,
        name: SeatsName[key],
        price: result[key],
        id: result.id

    })).filter((el) => el.key !== 'id')
}