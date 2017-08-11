export function formatDate(date: Date) {
    if (!date) {
        return '';
    }
    const day = ('00' + date.getDate()).slice(-2); // 1 -31
    const month = ('00' + (date.getMonth() + 1)).slice(-2); // 0-11
    const year = date.getFullYear();
    return year + '-' + month + '-' + day;
}

export function parseDate(date: string): Date {
    if (!date) {
        return undefined;
    }
    const d: string[] = date.match(/(\d{4})\-(\d{2})\-(\d{2})/);
    if (!d) {
        console.log('Date in a wrong format: ', date);
        return undefined;
    }
    return new Date(Number(d[1]), Number(d[2]) - 1, Number(d[3]));
}
