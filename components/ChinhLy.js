import { displayTime } from "./util";
import _ from "underscore";

function getLimMax(originArray, soChuKy) {
  var cloneArray = originArray.slice();
  let max = Math.max(...cloneArray);
  let min = Math.min(...cloneArray);
  let k = 0;
  cloneArray.splice(cloneArray.indexOf(max), 1);
  const sum = cloneArray.reduce((accumulator, value) => {
    return accumulator + value;
  }, 0);
  let atb1 = sum / (cloneArray.length - 1);
  let lengthArray = cloneArray.length;
  lengthArray == 4
    ? (k = 1.4)
    : lengthArray == 5 || lengthArray == 6
    ? (k = 1.3)
    : lengthArray == 7 || lengthArray == 8
    ? (k = 1.1)
    : lengthArray == 9 || lengthArray == 10
    ? (k = 1)
    : _.range(11, 16, 1).includes(lengthArray)
    ? (k = 0.9)
    : _.range(16, 31, 1).includes(lengthArray)
    ? (k = 0.8)
    : _.range(31, 36, 1)
    ? (k = 0.7)
    : (k = 0.6);
  let aMax = atb1 + k * (max - min);
  if (aMax >= max) {
    cloneArray.push(max);
    cloneArray.sort();
    return [cloneArray, true];
  } else {
    if (cloneArray.length < soChuKy * (2 / 3)) {
      return [cloneArray, false]; // tra ve mang va trang thai hien tai de thu thap them
    } else {
      getLimMax(cloneArray, soChuKy);
    }
  }
}

function getLimMin(originArray, soChuKy) {
  var cloneArray = originArray.slice();
  let max = Math.max(...cloneArray);
  let min = Math.min(...cloneArray);
  let k = 0;
  cloneArray.splice(cloneArray.indexOf(min), 1);
  const sum = cloneArray.reduce((accumulator, value) => {
    return accumulator + value;
  }, 0);
  let atb2 = sum / (cloneArray.length - 1);
  let lengthArray = cloneArray.length;
  lengthArray == 4
    ? (k = 1.4)
    : lengthArray == 5 || lengthArray == 6
    ? (k = 1.3)
    : lengthArray == 7 || lengthArray == 8
    ? (k = 1.1)
    : lengthArray == 9 || lengthArray == 10
    ? (k = 1)
    : _.range(11, 16, 1).includes(lengthArray)
    ? (k = 0.9)
    : _.range(16, 31, 1).includes(lengthArray)
    ? (k = 0.8)
    : _.range(31, 36, 1)
    ? (k = 0.7)
    : (k = 0.6);
  let aMin = atb2 - k * (max - min);
  if (aMin <= min) {
    cloneArray.push(min);
    cloneArray.sort();
    return [cloneArray, true];
  } else {
    if (cloneArray.length < soChuKy * (2 / 3)) {
      return [cloneArray, false]; // tra ve mang va trang thai hien tai de thu thap them
    }
    getLimMin(cloneArray, soChuKy);
  }
}

function getEtt(originArray) {
  const sum = originArray.reduce((accumulator, value) => {
    return accumulator + value;
  }, 0);
  let atb = sum / originArray.length;
  const sumBp = originArray.reduce((accumulator, value) => {
    return accumulator + Math.pow(atb - value, 2);
  }, 0);
  result =
    (100 / atb) *
    Math.sqrt(sumBp / ((originArray.length - 1) * originArray.length));
  return result;
}

function calculateHaveT(result, soChuKy, soPhanTu, Kod) {
  if (Kod <= 1.3) {
    const sum = result.reduce((accumulator, value) => {
      return accumulator + value;
    }, 0);

    return [sum, result];
  } else if (1.3 < Kod <= 2) {
    const [limMax, statusMax] = getLimMax(result, soChuKy);

    if (statusMax == false) {
      return [0, limMax];
    } else {
      const [limMin, statusMin] = getLimMin(limMax, soChuKy);
      if (statusMin == false) {
        return [0, limMin];
      } else {
        const sum = limMin.reduce((accumulator, value) => {
          return accumulator + value;
        }, 0);
        return [sum, limMin];
      }
    }
  } else if (2 < Kod) {
    let eTTNum = getEtt(result);
    let e = 0;
    //so phan tu cua chu ky
    soPhanTu <= 5 ? (e = 7) : (e = 10);
    if (eTTNum < e) {
      const sum = result.reduce((accumulator, value) => {
        return accumulator + value;
      }, 0);
      return [sum, result];
    } else if (eTTNum >= e) {
      const K1up = result.reduce((accumulator, value) => {
        return accumulator + (value - aMin);
      }, 0);
      const K1down = result.reduce((accumulator, value) => {
        return accumulator + (value - aMax);
      }, 0);
      let K1 = K1up / K1down;
      const sumResult = result.reduce((accumulator, value) => {
        return accumulator + value;
      }, 0);
      const sumResultPow = result.reduce((accumulator, value) => {
        return accumulator + Math.pow(value, 2);
      }, 0);
      const K2 =
        (sumResultPow - aMin * sumResult) / (aMax * sumResult - sumResultPow);
      if (K1 > K2) {
        result.splice(cloneArray.indexOf(aMax), 1);
      } else {
        result.splice(cloneArray.indexOf(aMin), 1);
      }
      calculateHaveT(result, soChuKy, soPhanTu);
    }
  }
}
const ChinhLy = (timeInput, soPhanTu, soLanQuanSat) => {
  let resultQuanSat = 0;
  let sumAmountNumber = 0;
  let Kod = 0;
  let chuKy = timeInput;
  console.log("timeInput", timeInput);

  chuKy.sort();

  let aMax = Math.max(...chuKy);
  let aMin = Math.min(...chuKy);
  let soChuKy = chuKy.length;
  console.log("chuKy", chuKy);
  console.log("max", aMax);
  console.log("min", aMin);
  console.log("soChuKy", soChuKy);
  console.log("soPhanTu", soPhanTu);
  console.log("soLanQuanSat", soLanQuanSat);
  console.log("Kod", Kod);

  aMin == 0 ? (Kod = 0) : (Kod = aMax / aMin);

  let [sumAfterChinhLy, arrayResult] = calculateHaveT(
    chuKy,
    soChuKy,
    soPhanTu,
    Kod
  );

  if (sumAfterChinhLy == 0) {
    return [0, arrayResult, sumAfterChinhLy];
  } else {
    sumAmountNumber = arrayResult.length;
    resultQuanSat = sumAmountNumber / sumAfterChinhLy;
    return [chuKy, Kod, arrayResult, resultQuanSat, sumAfterChinhLy];
  }
};
export { ChinhLy };
