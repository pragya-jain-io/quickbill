// WHAT: Configuration map defining which fields are locked (readOnly: true) vs editable (readOnly: false).
// WHY: Config-driven UI! Changing field permissions requires editing one boolean here instead of hunting through JSX components.
export const FIELD_CONFIG = {
  root: {
    invoiceNumber: { readOnly: false },
    date: { readOnly: false },
    isInterState: { readOnly: false },
    cartageAndPacking: { readOnly: false },
  },

  // Locked because seller company details belong to the business issuing the invoice
  seller: {
    name: { readOnly: true },
    tagline: { readOnly: true },
    gstNumber: { readOnly: true },
    phone: { readOnly: true },
    addressLine1: { readOnly: true },
    addressLine2: { readOnly: true },
  },

  customer: {
    name: { readOnly: false },
    phone: { readOnly: false },
    gstNumber: { readOnly: false },
    addressLine1: { readOnly: false },
    addressLine2: { readOnly: false },
  },

  // Locked because company bank details shouldn't be accidentally altered per invoice
  bank: {
    name: { readOnly: true },
    branch: { readOnly: true },
    accountNo: { readOnly: true },
    ifsc: { readOnly: true },
    upi: { readOnly: true },
  },

  transportDetails: {
    grNo: { readOnly: false },
    vehicleNo: { readOnly: false },
    transport: { readOnly: false },
    place: { readOnly: false },
    stateCode: { readOnly: false },
    ewayNo: { readOnly: false },
    marka: { readOnly: false },
  },

  items: {
    description: { readOnly: false },
    hsnCode: { readOnly: false },
    quantity: { readOnly: false },
    unit: { readOnly: false },
    unitPriceRupee: { readOnly: false },
    gstRate: { readOnly: false },
  },
};

// WHAT: Lists of fields that must be converted from form strings into JavaScript numbers.
// WHY: Used by `convertNumericValue` in App.jsx to keep data types clean before calculations run.
export const NUMERIC_ITEM_FIELDS = [
  'quantity',
  'unitPriceRupee',
  'gstRate',
];

export const NUMERIC_ROOT_FIELDS = [
  'cartageAndPacking',
];