import fs from "fs";

var fileName = process.env.FILE ?? "input";
var fileContent = fs.readFileSync(`${__dirname}/${fileName}.txt`, { encoding: 'utf-8' });

const NUMBER_LETTERS = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
}

const reversed = (str: string) => [...str].reverse().join('');

const replaceLettersWithNumbers = (text: string, fromRight: boolean = false): string => {
    let regexString = Object.keys(NUMBER_LETTERS).join("|")
    if (fromRight) {
        const regex = new RegExp(`(${reversed(regexString)})`, "g");
        return reversed(reversed(text).replace(regex, (match) => NUMBER_LETTERS[reversed(match)]))
    }
    const regex = new RegExp(`(${regexString})`, "g");
    return text.replace(regex, (match) => NUMBER_LETTERS[match])
}

export const getCalibrationValue = (calibrationDocument: string, useReplacementRule: boolean = false): number => {
    const calibrationRows = calibrationDocument.trim().split("\n");
    const calibrationRowsNumbers = calibrationRows.map((row) => {
        if (useReplacementRule) {
            row = replaceLettersWithNumbers(row) + replaceLettersWithNumbers(row, true)
        }
        return row.split("").map(char => parseInt(char, 10)).filter(number => !isNaN(number))
    })
    const calibrationRowsValue = calibrationRowsNumbers.map(numberArray => {
        if (numberArray.length > 0) {
            return (numberArray.at(0) ?? 0) * 10 + (numberArray.at(-1) ?? 0)
        }

        return 0
    })

    return calibrationRowsValue.reduce((a, b) => a + b, 0)
}

var resultPart1 = getCalibrationValue(fileContent);
console.log("Result Day 1 Part 1:", resultPart1);

var resultPart2 = getCalibrationValue(fileContent, true);
console.log("Result Day 1 Part 2:", resultPart2);