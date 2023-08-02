export default function arrayToObjectByKey(array, key) {
    const resultObject = {};
    array.forEach(item => {
      resultObject[item[key]] = item;
    });
    return resultObject;
  }