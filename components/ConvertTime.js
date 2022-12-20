export function covertTime(arrayResult) {
  for (const key in arrayResult) {
    if (Object.hasOwnProperty.call(arrayResult, key)) {
      const element = arrayResult[key];
      let time = new Date(element * 1000).toISOString().slice(11, 23);
      arrayResult[key] = time;
    }
  }
  return arrayResult;
}
