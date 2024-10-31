const numberUnits = [
  [0, ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"]],
  [10, ["mươi", "trăm"]],
  [1000, ["nghìn", "triệu", "tỷ"]],
];

function spellNumberInWords(amount, unitIndex) {
  const currentUnitValue = numberUnits[unitIndex][0];
  const unitNames = numberUnits[unitIndex][1];
  if (currentUnitValue === 0) {
    return unitNames[amount % 10];
  }
  let str = "";
  let i = unitNames.length - 1;
  let remainingAmount = amount;
  while (i >= 0) {
    const divisor = Math.pow(currentUnitValue, i + 1);
    const extractedNumber = Math.floor(remainingAmount / divisor) % currentUnitValue;
    if (extractedNumber > 0) {
      const currentWord = unitNames[i];
      const digit = spellNumberInWords(extractedNumber, unitIndex - 1);
      if (digit === "một" && currentWord === "mươi") {
        str += "mười ";
      } else {
        str += `${digit} ${currentWord} `;
      }
    }
    remainingAmount -= extractedNumber * divisor;
    i--;
  }

  const currentWord = spellNumberInWords(remainingAmount, unitIndex - 1);
  const arr = str.split(" ");
  if (currentWord.length === 0) {
    return str;
  }

  if (currentWord === "không") {
    return str.substring(0, str.lastIndexOf(" "));
  }

  if (remainingAmount < 10) {
    const lastDigit = arr[arr.length - 2]; // Has white space at the last
    if (numberUnits[2][1].concat(["trăm"]).includes(lastDigit)) {
      str += "linh " + currentWord;
    } else if (lastDigit?.length > 0 && currentWord === "năm") {
      str += "lăm";
    } else if (lastDigit?.length > 0 && lastDigit !== "mười" && currentWord === "một") {
      str += "mốt";
    } else {
      str += currentWord;
    }
  } else {
    str += currentWord;
  }

  return str;
}

function spellAmount(amount) {
  if (amount < 10) {
    return numberUnits[0][1][amount];
  }

  let str = spellNumberInWords(amount, numberUnits.length - 1);
  if (amount > 1000 && amount % 1000 < 100 && amount % 1000 > 0) {
    let arr = str.split(" ");
    for (let i = arr.length - 1; i >= 0; i--) {
      if (numberUnits[2][1].includes(arr[i])) {
        arr.splice(i + 1, 0, "không", "trăm");
        break;
      }
    }
    str = arr.join(" ");
  }

  return str.trim();
}

// Test cases
[
  0, 3, 5, 15, 18, 21, 23, 25, 31, 47, 82, 100, 305, 478, 902, 1015, 5005, 1305, 5432, 10000,
  1234567, 4500000, 10000000, 1000500, 1000000000, 1234000000, 2000450000, 45, 78, 99, 1000000001,
  1234567890, 10000000000, 1111, 1101, 1010,
].forEach((number) => console.log(number, spellAmount(number)));
