const transformKeysToCamelCase = (obj) => {
    let newObj = {};
    Object.keys(obj).forEach(key => {
        let newKey = toCamelCase(key);
        newObj[newKey] = obj[key];
    });
    return newObj;
}

const toCamelCase = (str) => {
    return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
}

const toMatchKeyWithTable = (str) => {
    return str.replace(/([A-Z])/g, '_$1').toLowerCase();
};

module.exports = { transformKeysToCamelCase, toCamelCase, toMatchKeyWithTable };