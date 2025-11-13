export function weekend(date: Date, holidays: string[] = []): boolean {
    const day = date.getDay(); // 0 = Sunday, 6 = Saturday
    const dateString = date.toISOString().slice(0, 10); // YYYY-MM-DD
    return day === 0 || day === 6 || holidays.includes(dateString);
}
//     if (day === 0 || day === 6) return false;
    
//     // Check if date is in holidays list
//     const dateString = date.toISOString().split('T')[0];
//     return !holidays.includes(dateString);
// }
export function getPreviousWorkingDay(offset: number, holidays: string[] = []): Date {
    const result = new Date();
    let needed = Math.abs(offset);
    let found = 0;

    while (found < needed) {
        result.setDate(result.getDate() - 1);
        if (!weekend(result, holidays)) {
            found++;
        }
    }
    return result;
}
