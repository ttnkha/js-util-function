const unitDigitsInWords = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];

/**
 * Converts a number less than 100 into its Vietnamese word representation.
 *
 * @param {number} number - The number to be converted. Must be between 0 and 99 (inclusive).
 * @returns {string} The Vietnamese word representation of the number. Returns an empty string
 *                  if the number is out of the specified range.
 *
 * Special Cases:
 * - The digit '5' is represented as 'lăm' when it appears as the unit digit.
 * - The digit '1' is represented as 'mốt' when it appears as the unit digit.
 * - The digit '0' is omitted when it appears as the unit digit (e.g., '20' is represented as 'hai mươi').
 */
function convertToVietnameseWordsUnder100(number) {
  if (number < 0 || number >= 100) {
    return "";
  }

  if (number < 10) {
    return unitDigitsInWords[number];
  }

  let wordRepresentation =
    number < 20 ? "mười" : unitDigitsInWords[Math.floor(number / 10)] + " mươi";

  const unitDigit = unitDigitsInWords[parseInt(number % 10)];
  if (unitDigit === "năm") {
    wordRepresentation += " lăm";
  } else if (unitDigit === "một" && number > 20) {
    wordRepresentation += " mốt";
  } else if (unitDigit !== "không") {
    wordRepresentation += ` ${unitDigit}`;
  }
  return wordRepresentation;
}

/**
 * Converts a number less than 1000 into its Vietnamese word representation.
 *
 * @param {number} number - The number to be converted. Must be between 0 and 999 (inclusive).
 * @returns {string} The Vietnamese word representation of the number. Returns an empty string
 *                  if the number is out of the specified range.
 *
 * Special Case:
 * - Includes "linh" when the tens place is zero and there is a non-zero unit digit.
 */
function convertToVietnameseWordsUnder1000(number) {
  if (number > 999) {
    return "";
  }

  if (number < 100) {
    return convertToVietnameseWordsUnder100(number);
  }

  const hundredsDigit = Math.floor(number / 100);
  let hundredsWord = unitDigitsInWords[hundredsDigit] + " trăm";

  const lastTwoDigits = Math.round(number % 100);
  const belowHundredWord = lastTwoDigits > 0 ? convertToVietnameseWordsUnder100(lastTwoDigits) : "";

  if (belowHundredWord.length > 0) {
    hundredsWord += ` ${lastTwoDigits < 10 ? "linh " : ""}${belowHundredWord}`;
  }

  return hundredsWord;
}

/**
 * Converts a large number into its Vietnamese word representation, handling units of thousands, millions, and billions.
 *
 * @param {number} number - The number to be converted. It can be in the billions.
 * @returns {string} The Vietnamese word representation of the number.
 */
const numberUnits = ["nghìn", "triệu", "tỷ"];
function spellNumberInWords(number) {
  if (number < 1000) {
    return convertToVietnameseWordsUnder1000(number);
  }

  let str = "";
  let i = numberUnits.length - 1;
  let remainingAmount = number;

  // Loop through each large unit (thousands, millions, billions)
  while (i >= 0) {
    const divisor = Math.pow(1000, i + 1);
    const extractedNumber = Math.floor(remainingAmount / divisor);

    if (extractedNumber > 0) {
      const currentWord = numberUnits[i];
      const digit = spellNumberInWords(extractedNumber);
      str += `${digit} ${currentWord} `;
    }

    remainingAmount -= extractedNumber * divisor;
    i--;
  }

  // Process the remaining amount less than 1000
  if (remainingAmount === 0) {
    return str;
  }

  const currentWord = spellNumberInWords(remainingAmount);

  // Handle the case where the remaining amount is a single digit following a unit (adds "linh")
  if (remainingAmount < 10) {
    const arr = str.split(" ");
    const lastDigit = arr[arr.length - 2]; // Space at the end of str
    if (numberUnits.includes(lastDigit)) {
      str += "linh " + currentWord;
    } else {
      str += currentWord;
    }
  } else {
    str += currentWord;
  }

  return str;
}

/**
 * Entry function that handles Vietnamese word conversion for large numbers.
 * Ensures correct formatting and includes "không trăm" where needed.
 *
 * @param {number} number - The number to be converted into Vietnamese words.
 * @returns {string} The complete Vietnamese word representation of the number.
 */
function spellNumber(number) {
  let str = spellNumberInWords(number);

  // Insert "không trăm" for numbers with empty hundreds place between units
  if (number > 1000 && number % 1000 < 100 && number % 1000 > 0) {
    let arr = str.split(" ");
    for (let i = arr.length - 1; i >= 0; i--) {
      if (numberUnits.includes(arr[i])) {
        arr.splice(i + 1, 0, "không", "trăm");
        break;
      }
    }
    str = arr.join(" ");
  }

  return str.trim();
}

// Test cases
const testCases = {
  0: "không",
  3: "ba",
  5: "năm",
  15: "mười lăm",
  18: "mười tám",
  21: "hai mươi mốt",
  23: "hai mươi ba",
  25: "hai mươi lăm",
  31: "ba mươi mốt",
  47: "bốn mươi bảy",
  82: "tám mươi hai",
  100: "một trăm",
  305: "ba trăm linh năm",
  478: "bốn trăm bảy mươi tám",
  902: "chín trăm linh hai",
  1015: "một nghìn không trăm mười lăm",
  5005: "năm nghìn không trăm linh năm",
  1305: "một nghìn ba trăm linh năm",
  5432: "năm nghìn bốn trăm ba mươi hai",
  10000: "mười nghìn",
  1234567: "một triệu hai trăm ba mươi bốn nghìn năm trăm sáu mươi bảy",
  4500000: "bốn triệu năm trăm nghìn",
  10000000: "mười triệu",
  1000500: "một triệu năm trăm",
  1000000000: "một tỷ",
  1234000000: "một tỷ hai trăm ba mươi bốn triệu",
  2000450000: "hai tỷ bốn trăm năm mươi nghìn",
  45: "bốn mươi lăm",
  78: "bảy mươi tám",
  99: "chín mươi chín",
  1000000001: "một tỷ không trăm linh một",
  1234567890: "một tỷ hai trăm ba mươi bốn triệu năm trăm sáu mươi bảy nghìn tám trăm chín mươi",
  10000000000: "mười tỷ",
  1111: "một nghìn một trăm mười một",
  1101: "một nghìn một trăm linh một",
  1010: "một nghìn không trăm mười",
  9_999_999_999_999:
    "chín nghìn chín trăm chín mươi chín tỷ chín trăm chín mươi chín triệu chín trăm chín mươi chín nghìn chín trăm chín mươi chín",
};

let passedCount = 0;
Object.entries(testCases).forEach(([number, result]) => {
  const numberInWords = spellNumber(number);
  if (numberInWords !== result) {
    console.error(`FAILED: Input: ${number} - Expected: ${result} - Actual: ${numberInWords}`);
  } else {
    passedCount++;
  }
});

console.log(
  `${passedCount === Object.keys(testCases).length ? "ALL" : passedCount} TEST CASE${
    passedCount > 1 && "S"
  } PASSED`
);
