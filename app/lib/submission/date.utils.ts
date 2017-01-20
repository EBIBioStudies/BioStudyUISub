export function formatDate(date: Date) {
    if (!date) {
        return '';
    }
    var day = ('00' + date.getDate()).slice(-2); // 1 -31
    var month = ('00' + (date.getMonth() + 1)).slice(-2); // 0-11
    var year = date.getFullYear();
    return year + '-' + month + '-' + day;
}

export function parseDate(date: string): Date {
    if (!date) {
        return null;
    }
    const d = date.match(/(\d{4})\-(\d{2})\-(\d{2})/);
    if (!d) {
        console.log('Date in a wrong format: ', date);
        return null;
    }
    return new Date(d[1], (d[2] - 1), d[3]);
}
