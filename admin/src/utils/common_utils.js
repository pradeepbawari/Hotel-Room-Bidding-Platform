const monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const convertDateFormat = (date, monthFormat) => {
    let dataObj = {day: null, month: null, years: null}
    
    const day = new Date(date).getDate()
    const month = new Date(date).getMonth()
    const years = new Date(date).getFullYear()

    const modifyDay = day <= 9 ? ('0'+day) : (day-1);
    let modifyMonth = monthFormat == 'number' ? (month+1) : monthName[month];
    
    date = (`${dataObj.day = modifyDay}-${dataObj.month = modifyMonth}-${dataObj.years = years}`)
    
    return date;
}

const convertStrUrl = (str) => {
    return str.toLowerCase().replaceAll(' ', '-')
}

const localStorageSet = (name, data) => {
    const value = data != '' ? JSON.stringify(data) : null;
    localStorage.setItem(name, value);
}

const localStorageGet = (name) => {
    let result = localStorage.getItem(name);
    result = (result != 'undefined') ? JSON.parse(result) : null;
    return result;
}

export {convertDateFormat, convertStrUrl, localStorageSet, localStorageGet}