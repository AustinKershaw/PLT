const data = {
    ordinals: ['th', 'st', 'nd', 'rd'],
    weekdays: {
        abbr: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        full: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    },
    months: {
        abbr: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        full: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    }
};

const pad = value => value < 10 ? `0${value}` : `${value}`;
const getOrdinal = n => n > 0 ? data.ordinals[(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10] : '';

const listYears = startYear => {
    let years = [];
    for (var i = startYear || 1960; i < (new Date().getFullYear() + 1); i++) { years.push(i) };
    return years;
};

const diff = (start, end, unit = 'months') => {
    start = new Date(start);
    end = new Date(end);
    switch (unit) {
        case 'milliseconds':
            return Math.abs(start - end);
        case 'seconds':
            return ~~(Math.abs(start - end) / 1e3);
        case 'minutes':
            return ~~(Math.abs(start - end) / 6e4);
        case 'hours':
            return ~~(Math.abs(start - end) / 36e5);
        case 'days':
            return ~~((Date.UTC(end.getFullYear(), end.getMonth(), end.getDate()) - Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())) / (1000 * 60 * 60 * 24));
        case 'months':
            return end.getMonth() - start.getMonth() + (12 * (end.getFullYear() - start.getFullYear()))
        case 'years':
            return end.getFullYear() - start.getFullYear();
    };
};

const add = (date, amount, value = 'days') => {
    let result = new Date(date);
    switch (value) {
        case 'milliseconds':
            result.setMilliseconds(result.getMilliseconds() + amount);
            break;
        case 'seconds':
            result.setSeconds(result.getSeconds() + amount);
            break;
        case 'minutes':
            result.setMinutes(result.getMinutes() + amount);
            break;
        case 'hours':
            result.setHours(result.getHours() + amount);
            break;
        case 'days':
            result.setDate(result.getDate() + amount);
            break;
        case 'months':
            result.setMonth(result.getMonth() + amount);
            break;
        case 'years':
            result.setFullYear(result.getFullYear() + amount);
            break;
    };
    return result;
};

const subtract = (date, amount, value = 'days') => {
    let result = new Date(date);
    switch (value) {
        case 'milliseconds':
            result.setMilliseconds(result.getMilliseconds() - amount);
            break;
        case 'seconds':
            result.setSeconds(result.getSeconds() - amount);
            break;
        case 'minutes':
            result.setMinutes(result.getMinutes() - amount);
            break;
        case 'hours':
            result.setHours(result.getHours() - amount);
            break;
        case 'days':
            result.setDate(result.getDate() - amount);
            break;
        case 'months':
            result.setMonth(result.getMonth() - amount);
            break;
        case 'years':
            result.setFullYear(result.getFullYear() - amount);
            break;
    };
    return result;
};

const getWeek = d => {
    let date = new Date(d);
    let dayNr = (date.getDay() + 6) % 7;
    date.setDate(date.getDate() - dayNr + 3);
    let firstThursday = date.valueOf();
    date.setMonth(0, 1);
    if (date.getDay() != 4) { date.setMonth(0, 1 + ((4 - date.getDay()) + 7) % 7) }
    return 1 + Math.ceil((firstThursday - date) / 604800000);
};

const createOffset = date => {
    let sign = date.getTimezoneOffset() > 0 ? "-" : "+";
    let offset = Math.abs(date.getTimezoneOffset());
    let hours = pad(~~(offset / 60));
    let minutes = pad(offset % 60);
    return sign + hours + ":" + minutes;
};

const mask = (date, formatting) => {
    if (!date) { return };
    date = typeof date === 'string' ? new Date(date) : date;
    let hours;
    switch (formatting) {

        // Day of the month as digits; no leading zero for single-digit days.
        case "d":
            return `${date.getDate()}`;

        // Day of the month as digits; leading zero for single-digit days.
        case "dd":
            return `${date.getDate()}`.length > 1 ? date.getDate() : '0' + date.getDate();

        // Day of the week as a three-letter abbreviation.
        case "ddd":
            return `${data.weekdays.abbr[date.getDay()]}`;

        // Day of the week as its full name.
        case "dddd":
            return `${data.weekdays.full[date.getDay()]}`;

        // Month as digits; no leading zero for single-digit months.
        case "m":
            return `${date.getMonth() + 1}`;

        // Month as digits; leading zero for single-digit months.
        case "mm":
            return `${date.getMonth() + 1}`.length > 1 ? `${date.getMonth() + 1}` : `0${date.getMonth() + 1}`;

        // Month as a three-letter abbreviation.
        case "mmm":
            return `${data.months.abbr[date.getMonth()]}`;

        // Month as its full name.
        case "mmmm":
            return `${data.months.full[date.getMonth()]}`;

        // Year as last two digits; leading zero for years less than 10.
        case "yy":
            return `${date.getFullYear()}`.slice(-2);

        // Year represented by four digits.
        case "yyyy":
            return `${date.getFullYear()}`;

        // Hours; no leading zero for single-digit hours (12-hour clock).
        case "h":
            hours = date.getHours();
            return hours <= 12 ? `${hours}` : `${hours - 12}`;

        // Hours; leading zero for single-digit hours (12-hour clock).
        case "hh":
            hours = date.getHours();
            return hours <= 12 ? (hours < 10 ? `0${hours}` : `${hours}`) : ((hours - 12) < 10 ? `0${hours - 12}` : `${hours - 12}`);

        // Hours; no leading zero for single-digit hours (24-hour clock).
        case "H":
            return `${date.getHours()}`;

        // Hours; leading zero for single-digit hours (24-hour clock).
        case "HH":
            return date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`;

        // Minutes; no leading zero for single-digit minutes.
        case "M":
            return `${date.getMinutes()}`;

        // Minutes; leading zero for single-digit minutes.
        case "MM":
            return date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`;

        // ISO 8601 numeric representation of the day of the week.
        case "N":
            return date.getDate() === 0 ? '7' : `${date.getDate()}`;

        // Seconds; no leading zero for single-digit seconds.
        case "s":
            return `${date.getSeconds()}`;

        // Seconds; leading zero for single-digit seconds.
        case "ss":
            return date.getSeconds() < 10 ? `0${date.getSeconds()}` : `${date.getSeconds()}`;

        // The date's ordinal suffix (st, nd, rd, or th). Works well with d.
        case "S":
            return `${getOrdinal(date.getDate())}`;

        // Milliseconds; gives 3 digits.
        case "l":
            return `${date.getMilliseconds()}`;

        // Milliseconds; gives 2 digits.
        case "L":
            return `${date.getMilliseconds()}`.slice(0, 2);

        // Lowercase, single-character time marker string: a or p.
        case "t":
            return date.getHours() > 12 ? 'p' : 'a';

        // Lowercase, two-character time marker string: am or pm.
        case "tt":
            return date.getHours() > 12 ? 'pm' : 'am';

        // Uppercase, single-character time marker string: A or P.
        case "T":
            return date.getHours() > 12 ? 'P' : 'A';

        // Uppercase, two-character time marker string: AM or PM.
        case "TT":
            return date.getHours() > 12 ? 'PM' : 'AM';

        // ISO 8601 week number of the year, e.g. 42
        case "W":
            return `${getWeek(date)}`;

        // ddd mmm dd yyyy HH:MM:ss  || Sat Jun 09 2007 17:46:21
        case "default":
            return `${mask(date, 'ddd')} ${mask(date, 'mmm')} ${mask(date, 'dd')} ${mask(date, 'yyyy')} ${mask(date, 'HH')}:${mask(date, 'MM')}:${mask(date, 'ss')}`;

        // m/d/yy || 6/9/07
        case "shortDate":
            return `${mask(date, 'm')} ${mask(date, 'd')} ${mask(date, 'yy')}`;

        // mmm d, yyyy || Jun 9, 2007
        case "mediumDate":
            return `${mask(date, 'mmm')} ${mask(date, 'd')}, ${mask(date, 'yyyy')}`;

        // mmmm d, yyyy || June 9, 2007
        case "longDate":
            return `${mask(date, 'mmmm')} ${mask(date, 'd')}, ${mask(date, 'yyyy')}`;

        // dddd, mmmm d, yyyy || Saturday, June 9, 2007
        case "fullDate":
            return `${mask(date, 'dddd')}, ${mask(date, 'mmmm')} ${mask(date, 'd')}, ${mask(date, 'yyyy')}`;

        // h:MM TT || 5:46 PM
        case "shortTime":
            return `${mask(date, 'h')}:${mask(date, 'MM')} ${mask(date, 'TT')}`;

        // h:MM:ss TT || 5:46:21 PM
        case "mediumTime":
            return `${mask(date, 'h')}:${mask(date, 'MM')}:${mask(date, 'ss')} ${mask(date, 'TT')}`;

        // yyyy-mm-dd || 2007-06-09
        case "isoDate":
            return `${mask(date, 'yyyy')}-${mask(date, 'mm')}-${mask(date, 'dd')}`;

        // HH:MM:ss || 17:46:21
        case "isoTime":
            return `${mask(date, 'HH')}:${mask(date, 'MM')}:${mask(date, 'ss')}`;

        // yyyy-mm-dd'T'HH:MM:ss || 2007-06-09T17:46:21
        case "isoDateTime":
            return `${mask(date, 'yyyy')}-${mask(date, 'mm')}-${mask(date, 'dd')}T${mask(date, 'HH')}:${mask(date, 'MM')}:${mask(date, 'ss')}`;

        case "isoDateTimeOffset":
            return `${mask(date, 'yyyy')}-${mask(date, 'mm')}-${mask(date, 'dd')}T${mask(date, 'HH')}:${mask(date, 'MM')}:${mask(date, 'ss')}${createOffset(date)}`;
    };
};

const format = (date, formatting) => {
    if (!date && !formatting) { return mask(new Date(), "isoDateTimeOffset") };
    date = typeof date === 'string' ? new Date(date) : date;
    return formatting.split(' ').map(partial => {

        let coma = false;
        if (partial.indexOf(',') > -1) {
            coma = true;
            partial = partial.replace(',', '');
        };

        if (partial.indexOf(':') > -1) { return partial.split(':').map(item => mask(date, item)).join(':') };
        if (partial.indexOf('/') > -1) { return partial.split('/').map(item => mask(date, item)).join('/') };
        if (partial.indexOf('-') > -1) { return partial.split('-').map(item => mask(date, item)).join('-') };

        return `${mask(date, partial)}${coma ? ',' : ''}`;

    }).join(' ');
};

export default {
    getOrdinal,
    getWeek,
    mask,
    subtract,
    add,
    pad,
    diff,
    data,
    format,
    listYears
};
