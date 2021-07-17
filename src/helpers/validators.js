/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import * as R from "ramda";

const countColors = (figures) => {
    const figureArray = R.toPairs(figures);
    return R.countBy(R.prop(1))(figureArray);
};

const isFigureOfColor =  R.curry(
    (figure, color) => {
        return R.propEq(figure, color);
    }
);

const isFigureNotOfColor = (figure, color) => {
    return R.compose(R.not, isFigureOfColor(figure, color));
};

const isAllFiguresOfColor = R.curry(
    (color, figures) => {
        return R.all(
            R.propEq(1, color),
            R.toPairs(figures)
        );
    }
);

const isFiguresHasTheSameColor = R.curry(
    (firstFigureName, secondFigureName, figures) => {
        return R.equals(
            R.prop(firstFigureName, figures),
            R.prop(secondFigureName, figures)
        )
    }
)

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = (figures) => {
    const isStarRed = isFigureOfColor('star', 'red');
    const isSquareGreen = isFigureOfColor('square', 'green');

    return R.allPass([isStarRed, isSquareGreen])(figures);
};

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = (figures) => {
    const countedColors = countColors(figures);

    return R.gte(
        R.prop('green', countedColors), 2
    );
};

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = (figures) => {
    const countedColors = countColors(figures);

    return R.equals(
        R.prop('red', countedColors),
        R.prop('blue', countedColors)
    );
};

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = (figures) => {
    const isCircleBlue = isFigureOfColor('circle', 'blue');
    const isStarRed = isFigureOfColor('star', 'red');
    const isSquareOrange = isFigureOfColor('square', 'orange');

    return R.allPass([isCircleBlue, isStarRed, isSquareOrange])(figures);
};

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = (figures) => {
    const isNotWhite = (color) => {
        return color[0] !== "white";
    };

    const isRightAmount = (color) => {
        console.log(color);
        return color[1] >= 3;
    };

    const countedColors = countColors(figures);
    const countedColorsArray = R.toPairs(countedColors);
    const filteredColors = R.filter(isNotWhite, countedColorsArray);

    return R.any(isRightAmount)(filteredColors);
};

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = (figures) => {
    const isTriangleGreen = isFigureOfColor('triangle', 'green');

    const hasTwoGreenFigures = (figures) => {
        const countedColors = countColors(figures);
        return countedColors.green === 2;
    };

    const hasOneRedFigure = (figures) => {
        const countedColors = countColors(figures);
        return countedColors.red === 1;
    };

    return R.allPass(
        [isTriangleGreen, hasTwoGreenFigures, hasOneRedFigure]
    )(figures);
};

// 7. Все фигуры оранжевые.
export const validateFieldN7 = (figures) => {
    const isAllFiguresOrange = isAllFiguresOfColor('orange');
    return isAllFiguresOrange(figures);
};

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = (figures) => {
    const isStarNotRed = isFigureNotOfColor('star', 'red');
    const isStarNotWhite = isFigureNotOfColor('star', 'white');

    return R.allPass([isStarNotRed, isStarNotWhite])(figures);
};

// 9. Все фигуры зеленые.
export const validateFieldN9 = (figures) => {
    const isAllFiguresGreen = isAllFiguresOfColor('green');
    return isAllFiguresGreen(figures);
};

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = (figures) => {
    const isTriangleIsNotWhite = isFigureNotOfColor('triangle', 'white');
    const isSquareIsNotWhite = isFigureNotOfColor('square', 'white');
    const isTriangleAndSquareHasTheSameColor = isFiguresHasTheSameColor(
        'triangle', 'square'
    );
    
    return R.allPass(
        [isTriangleAndSquareHasTheSameColor, isTriangleIsNotWhite, isSquareIsNotWhite]
    )(figures);
};
