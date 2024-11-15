/**
 * Converts a number below 60 into its English words.
 * This function handles numbers from 0 to 59 and converts them
 * to their respective English words.
 *
 * @param num - The number to be converted (0 <= num < 60).
 * @returns The English word representation of the given number.
 */
function numberBelow60ToWords(num: number): string {
  if (num >= 60) {
    return ""; // Invalid input (num must be below 60)
  }

  // Array for numbers 1-10
  const digitWords = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
  ];

  if (num <= 10) {
    return digitWords[num]; // Return words for numbers 0-10
  }

  // Array for numbers 10-19
  const numberNames10to19 = [
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  if (num < 20) {
    return numberNames10to19[num - 10]; // Handle numbers 11-19
  }

  // Array for tens multiples (20, 30, 40, 50)
  const dozenWords = [null, null, "twenty", "thirty", "forty", "fifty"];

  // Return words for numbers >= 20 and < 60
  return `${dozenWords[Math.floor(num / 10)]} ${digitWords[num % 10] || ""}`;
}

/**
 * Converts a given time (hours and minutes) into its English word form.
 *
 * @param h - The hour of the time (1 <= h <= 12).
 * @param m - The minutes of the time (0 <= m < 60).
 * @returns The English word representation of the time.
 */
function timeInWords(h: number, m: number): string {
  // Handle exact hour (when minutes are 0)
  if (m === 0) {
    return `${numberBelow60ToWords(h)} o' clock`;
  }

  // Determine whether to use "past" or "to" based on the minute value
  const isUpper = m > 30;
  const betweenWords = !isUpper ? "past" : "to";

  // Get the next hour if minutes are greater than 30
  const hourWords = numberBelow60ToWords(h + Number(isUpper));

  // Calculate the minutes to display (past or to the next hour)
  const minutes = isUpper ? 60 - m : m;
  const minuteWords = numberBelow60ToWords(minutes);

  // Special cases for 15 minutes and 30 minutes
  if (m === 15 || m === 45) {
    return `quarter ${betweenWords} ${hourWords}`;
  }

  if (m === 30) {
    return `half past ${hourWords}`;
  }

  // General case for other minutes
  return `${minuteWords} minute${minutes > 1 ? "s" : ""} ${betweenWords} ${hourWords}`;
}
