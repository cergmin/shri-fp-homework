/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import * as R from "ramda";
import Api from "../tools/api";

const api = new Api();

const isValid = (value) => {
    const isStringEnoughLong = (str) => R.gt(R.length(str), 2);
    const isStringEnoughShort = (str) => R.lt(R.length(str), 10);
    const isNumber = (str) => /^(-)?[0-9]+(\.[0-9]+)?$/.test(str);
    const isPositiveNumber = (str) => parseFloat(str) > 0;

    return R.allPass([
        isStringEnoughLong,
        isStringEnoughShort,
        isNumber,
        isPositiveNumber,
    ])(value);
};

const changeBaseWithApi = R.curry((from, to, number) => {
    return api
        .get("https://api.tech/numbers/base", {
            from,
            to,
            number,
        })
        .then((response) => {
            return response.result;
        });
});

const decToBinWithApi = changeBaseWithApi(10, 2);

const getNumberLength = R.compose(R.length, String);

const getAnimalWithApi = (id) => {
    return api
        .get(`https://animals.tech/${id}`, {})
        .then((response) => {
            return response.result;
        });
};

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
    writeLog(`Исходное: ${value}`);

    if (!isValid(value)) {
        handleError("ValidationError");
        return;
    }

    const roundedValue = R.compose(Math.round, parseFloat)(value);
    writeLog(`Округленное: ${roundedValue}`);

    decToBinWithApi(roundedValue)
        .then((binValue) => {
            writeLog(`Двоичное: ${binValue}`);
            return binValue;
        })
        .then((binValue) => {
            const binValueLength = getNumberLength(binValue);

            writeLog(`Длина двоичного: ${binValueLength}`);
            return binValueLength;
        })
        .then((valueLength) => {
            const squaredValueLength = valueLength * valueLength;
            writeLog(`Квадрат длины: ${squaredValueLength}`);
            return squaredValueLength;
        })
        .then((squaredLength) => {
            const remainder = squaredLength % 3;
            writeLog(`Остаток: ${remainder}`);
            return remainder;
        })
        .then((animalId) => {
            return getAnimalWithApi(animalId);
        })
        .then((animal) => {
            handleSuccess(animal);
        })
        .catch(handleError);
};

export default processSequence;
