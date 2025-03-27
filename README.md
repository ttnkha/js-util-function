# JS Utility Functions

This repository contains various utility functions for JavaScript projects.

## Folders Overview

### VnPhoneUtils

Provides utilities for handling and validating Vietnamese phone numbers.

### spellNumber

Converts numbers into their Vietnamese word representation.

### timeInWords

Converts time into a human-readable word format.

## Usage

You can import and use any utility function as needed:

```javascript
import VnPhoneUtils from "./VnPhoneUtils";
import spellNumber from "./spellNumber";

console.log(VnPhoneUtils.formatPhoneNumber("0987654321"));
console.log(spellNumber(123456)); // Output: "một trăm hai mươi ba nghìn bốn trăm năm mươi sáu"
```

## Contributing

Feel free to submit issues or pull requests to enhance the utilities.

## License

MIT
