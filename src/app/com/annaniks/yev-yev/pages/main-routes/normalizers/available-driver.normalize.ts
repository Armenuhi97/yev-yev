import { AvailableDriverModel } from '../models/available-driver';

export function availabeDriverNormalizer(driver: AvailableDriverModel): AvailableDriverModel {
    const diffHours = getDifferenceHour(driver);
    const color = getColor(diffHours);
    return {
        color,
        ...driver,
        label: `${driver.driver_name} (${driver.car_model}) (${driver.car_capacity}) [${driver.main_city}]`
    };
}
function getDifferenceHour(driver): number {
    const differanceTime = new Date().getTime() - new Date(driver.last_order_date).getTime();
    const hours = Math.floor((differanceTime / (1000 * 60 * 60)));
    return hours;
}

function getColor(diffHours: number): string {
    if (diffHours <= 24) {
        return 'white';
    }
    if (diffHours > 24 && diffHours <= 48) {
        return 'yellow';
    }
    if (diffHours > 48) {
        return 'red';
    }
}

// minchev 24 jam spitak
// 24-48 jam dexin
// 48- karmir