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
    return cloneArray;
  } else {
    if (cloneArray.length < soChuKy * (2 / 3)) {
      return [];
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
  console.log("atb2", atb2);
  let lengthArray = cloneArray.length;
  console.log("lengthArray", lengthArray);
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
  console.log("k", k);
  console.log(max, min);
  let aMin = atb2 - k * (max - min);
  console.log("aMin", aMin);
  if (aMin <= min) {
    cloneArray.push(min);
    cloneArray.sort();
    console.log("lim min", cloneArray);
    return cloneArray;
  } else {
    console.log("cloneArray else", cloneArray);

    if (cloneArray.length < soChuKy * (2 / 3)) {
      console.log("cloneArray 2/3", cloneArray);

      return "cloneArray";
    } else {
      console.log("lim min 123", cloneArray);
      getLimMin(cloneArray, soChuKy);
    }
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

function calculateHaveT(result, soChuKy, soPhanTu) {
  let stabilityCoe = 0;
  let m = result.length;

  let aMax = Math.max(...result);
  let aMin = Math.min(...result);
  console.log("aMax", aMax);
  console.log("aMin", aMin);

  // tinh K
  stabilityCoe = aMax / aMin;
  console.log("stabilityCoe", stabilityCoe);
  if (stabilityCoe <= 1.3) {
    const sum = result.reduce((accumulator, value) => {
      return accumulator + value;
    }, 0);
    return sum;
  } else if (1.3 < stabilityCoe <= 2) {
    let limMax = getLimMax(result, soChuKy);
    console.log("lim max log", limMax);

    if (limMax.length == 0) {
      //call screen thu thap
      console.log("call screen thu thap");
    } else {
      let limMin = getLimMin(limMax, soChuKy);
      if (limMin == false) {
        //call screen thu thap
        console.log("call screen thu thap");
      } else {
        const sum = limMin.reduce((accumulator, value) => {
          return accumulator + value;
        }, 0);
        return [sum, limMin.length];
      }
    }
  } else if (2 < stabilityCoe) {
    let eTTNum = getEtt(result);
    let e = 0;
    //so phan tu cua chu ky
    soPhanTu <= 5 ? (e = 7) : (e = 10);
    if (eTTNum < e) {
      const sum = result.reduce((accumulator, value) => {
        return accumulator + value;
      }, 0);
      return sum;
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
      calculateHaveT(result);
    }
  }
}
export const ChinhLy = (listInput, soPhanTu, soLanQuanSat) => {
  //tach data thu thap cho tung chu ky
  //kiem tra xem so luong data thu thap du co bang so chu ky hay khong
  let chuKy = [];
  let input = [];
  let resultAllQuanSat = 0;
  for (const key in listInput) {
    if (Object.hasOwnProperty.call(listInput, key)) {
      let soChuKy = listInput[key].length;
      listInput[key].forEach((element) => {
        element = displayTime(element);
        chuKy.push(element);
      });
      chuKy.sort();
      let [ResultChuKy, t] = calculateHaveT(chuKy, soChuKy, soPhanTu);
      let resultQuanSat = ResultChuKy / t;
      resultAllQuanSat += resultQuanSat;
    }
  }
  let HaoPhi = soLanQuanSat / resultAllQuanSat;
  return HaoPhi;
};
