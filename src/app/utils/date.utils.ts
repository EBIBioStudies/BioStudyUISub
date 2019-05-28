/**
 * Converts a date object into ISO 8601 bar the time offset without using toISOString(). The latter assumes your date
 * is local time and converts it to UTC. In turn, this leads to the actual date rolling back or forth one day depending
 * on the time offset. Instead, this method leverages other already existing ones to build the string.
 * @param {Date} date - Date object
 * @returns {string} The date in simplified extended ISO format without the time offset (YYYY-MM-DD).
 */
export function formatDate(date: Date | undefined): string {
    let day; // zero-padded day number
    let month; // zero-padded month number
    let year; // full year number

    // Non-empty date object.
    if (date) {
        day = ('00' + date.getDate()).slice(-2);
        month = ('00' + (date.getMonth() + 1)).slice(-2);
        year = date.getFullYear();
        return [year, month, day].join('-');

    // Returns an empty string instead of a zero-padded string corresponding to the start of the Unix epoch if null.
    } else {
        return '';
    }
}

export function parseDate(date: string): Date | undefined {
    if (!date) {
        return undefined;
    }
    const d: string[] = date.match(/(\d{4})\-(\d{2})\-(\d{2})/) || [];
    if (d.length === 0) {
        console.log('Date in a wrong format: ', date);
        return undefined;
    }
    return new Date(Number(d[1]), Number(d[2]) - 1, Number(d[3]));
}

/**
 * Checks if the given dates are the same.
 * @param {Date} date1 - Date object
 * @param {Date} date2 - Date object
 * @returns {boolean} True if both dates are equal.
 */
export function isEqualDate(date1: Date | undefined, date2: Date | undefined): boolean {
    if (date1 === undefined || date2 === undefined) {
        return false;
    }

    // If any of the dates is undefined, it's clear that they are both different
    if (typeof date2 === typeof date1) {
        return date2.getTime() - date1.getTime() === 0;
    } else {
        return false;
    }
}
