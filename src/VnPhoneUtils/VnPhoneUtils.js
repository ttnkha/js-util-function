const PHONE_PROVIDERS = {
  VIETTEL: "VIETTEL",
  VINAPHONE: "VINAPHONE",
  MOBIFONE: "MOBIFONE",
  VIETNAMOBILE: "VIETNAMOBILE",
  GMOBILE: "GMOBILE",
  MOBICAST: "MOBICAST",
};

export const PHONE_CONFIG = {
  LENGTH: 10,
  PREFIX_LENGTH: 3,
  PROVIDERS: PHONE_PROVIDERS,
  PREFIXES_BY_PROVIDER: {
    [PHONE_PROVIDERS.VIETTEL]: [
      "032",
      "033",
      "034",
      "035",
      "036",
      "037",
      "038",
      "039",
      "096",
      "097",
      "098",
      "086",
    ],
    [PHONE_PROVIDERS.VINAPHONE]: ["083", "084", "085", "081", "082", "091", "094", "088", "087"],
    [PHONE_PROVIDERS.MOBIFONE]: ["070", "079", "077", "076", "078", "090", "093", "089"],
    [PHONE_PROVIDERS.VIETNAMOBILE]: ["092", "058", "056", "052"],
    [PHONE_PROVIDERS.GMOBILE]: ["099", "059"],
    [PHONE_PROVIDERS.MOBICAST]: ["055"],
  },
};

export const PHONE_VALIDATE_RESULT = {
  LESS_THAN_MIN: -2,
  GREATER_THAN_MAX: -1,
  INVALID: 0,
  VALID: 1,
};

function getValidationRegex(prefixesByProvider) {
  const prefixArray = Object.values(prefixesByProvider).flat();
  if (!prefixArray.length) return null;

  const prefixGroups = prefixArray.reduce((acc, prefix) => {
    const key = prefix.slice(1, -1);
    const lastDigit = prefix.slice(-1);
    if (!acc[key]) acc[key] = [];
    if (!acc[key].includes(lastDigit)) acc[key].push(lastDigit);
    return acc;
  }, {});

  const prefixRegex = Object.entries(prefixGroups)
    .map(
      ([key, lastDigits]) =>
        `(${key}[${lastDigits.join("")}][0-9]{${PHONE_CONFIG.LENGTH - key.length - 2}})`
    )
    .join("|");

  return `0(${prefixRegex})`;
}

export default class VnPhoneUtils {
  static removeFormatting(phoneNumber) {
    return phoneNumber?.replace(/[\s/]/g, "") || "";
  }

  static formatPhoneNumber(phoneNumber) {
    if (phoneNumber?.length > PHONE_CONFIG.LENGTH) {
      return phoneNumber;
    }
    const cleaned = VnPhoneUtils.removeFormatting(phoneNumber);
    return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3") ?? phoneNumber;
  }

  static isValidVnPhone(phoneNumber, prefixes = PHONE_CONFIG.PREFIXES_BY_PROVIDER) {
    const phone = VnPhoneUtils.removeFormatting(phoneNumber);
    if (phone.length < PHONE_CONFIG.LENGTH) return PHONE_VALIDATE_RESULT.LESS_THAN_MIN;
    if (phone.length > PHONE_CONFIG.LENGTH) return PHONE_VALIDATE_RESULT.GREATER_THAN_MAX;
    return new RegExp(getValidationRegex(prefixes)).test(phone)
      ? PHONE_VALIDATE_RESULT.VALID
      : PHONE_VALIDATE_RESULT.INVALID;
  }

  static detectCarrier(phoneNumber, prefixes = PHONE_CONFIG.PREFIXES_BY_PROVIDER) {
    const formattedPhone = VnPhoneUtils.removeFormatting(phoneNumber);
    if (formattedPhone.length < PHONE_CONFIG.PREFIX_LENGTH) return null;
    const phonePrefix = formattedPhone.slice(0, PHONE_CONFIG.PREFIX_LENGTH);
    return (
      Object.entries(prefixes).find(([, prefixList]) => prefixList.includes(phonePrefix))?.[0] ||
      null
    );
  }

  static maskPhoneNumber(phoneNumber) {
    const cleaned = VnPhoneUtils.removeFormatting(phoneNumber);
    if (cleaned.length < PHONE_CONFIG.LENGTH) return "";
    return cleaned.replace(/.(?=...)/g, "*");
  }
}

// Test cases
const testCases = {
  isValidVnPhone: [
    { params: ["0909111111"], result: PHONE_VALIDATE_RESULT.VALID },
    { params: ["0959111111"], result: PHONE_VALIDATE_RESULT.INVALID },
    { params: ["0909111"], result: PHONE_VALIDATE_RESULT.LESS_THAN_MIN },
    { params: ["09091111111"], result: PHONE_VALIDATE_RESULT.GREATER_THAN_MAX },
    {
      params: [
        "0329123456",
        {
          [PHONE_PROVIDERS.VIETTEL]: ["03", "0245", "0245", "02456", "0"],
          [PHONE_PROVIDERS.MOBICAST]: [],
        },
      ],
      result: PHONE_VALIDATE_RESULT.VALID,
    },
    {
      params: [
        "0245291234",
        {
          [PHONE_PROVIDERS.VIETTEL]: ["03", "0245", "0245", "02466", "0"],
          [PHONE_PROVIDERS.MOBICAST]: [],
        },
      ],
      result: PHONE_VALIDATE_RESULT.VALID,
    },
    {
      params: [
        "0246291234",
        {
          [PHONE_PROVIDERS.VIETTEL]: ["03", "0245", "0245", "02466", "0"],
          [PHONE_PROVIDERS.MOBICAST]: [],
        },
      ],
      result: PHONE_VALIDATE_RESULT.INVALID,
    },
    {
      params: [
        "0246691234",
        {
          [PHONE_PROVIDERS.VIETTEL]: ["03", "0245", "0245", "02466", "0"],
          [PHONE_PROVIDERS.MOBICAST]: [],
        },
      ],
      result: PHONE_VALIDATE_RESULT.VALID,
    },
  ],
  maskPhoneNumber: [
    { params: [null], result: "" },
    { params: ["0909111"], result: "" },
    { params: ["0909111111"], result: "*******111" },
  ],
  detectCarrier: [
    { params: ["09"], result: null },
    { params: [""], result: null },
    { params: ["090"], result: PHONE_PROVIDERS.MOBIFONE },
  ],
  formatPhoneNumber: [
    { params: [null], result: "" },
    { params: [""], result: "" },
    { params: ["0909111111"], result: "0909 111 111" },
    { params: ["090911111"], result: "090911111" },
    { params: ["09091234567"], result: "09091234567" },
  ],
  removeFormatting: [{ params: ["0909 111 111"], result: "0909111111" }],
};

let passedCount = 0;
Object.entries(testCases).forEach(([func, tcs]) => {
  tcs.forEach((tc) => {
    if (!tc) {
      return;
    }
    const { params, result: expect } = tc;
    const result = VnPhoneUtils[func](...params);
    if (result !== expect) {
      console.error(`FAILED ${func}: Input: ${params} - Expected: ${expect} - Actual: ${result}`);
    } else {
      passedCount++;
    }
  });
});

const tcCount = Object.values(testCases).reduce((val, curr) => val + curr.length, 0);
console.log(
  `${passedCount === tcCount ? "ALL" : passedCount} TEST CASE${
    passedCount > 1 && "S"
  } PASSED ON TOTAL ${tcCount}`
);
