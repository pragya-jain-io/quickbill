// WHAT: Rounds floating-point numbers strictly to 2 decimal places (Rupees & Paise).
// WHY: JavaScript binary math causes bugs like `0.1 + 0.2 = 0.30000000000000004`. Shifting decimals (`e+2` / `e-2`) avoids floating-point drift.
const roundToTwo = (num) => {
  return Number(Math.round(num + "e+2") + "e-2");
};

// WHAT: Safely converts any empty, null, or invalid user input into `0` before doing math.
// WHY: Prevents `NaN` (Not a Number) from breaking the entire invoice total when a user clears an input field.
const toSafeNumber = (value) => {
  if (value === '' || value === null || value === undefined) {
    return 0;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
};

// WHAT: Computes taxable value, GST tax, and final price for a single line item.
// WHY: Isolating item math into a pure function makes it easy to test and reuse.
const calculateItemTotals = (item) => {
  const quantity = toSafeNumber(item.quantity);
  const unitPriceRupee = toSafeNumber(item.unitPriceRupee);
  const gstRate = toSafeNumber(item.gstRate);

  const taxableAmount = roundToTwo(quantity * unitPriceRupee);
  const gstAmount = roundToTwo((taxableAmount * gstRate) / 100);
  const totalAmount = roundToTwo(taxableAmount + gstAmount);

  return {
    ...item,
    taxableAmount,
    gstAmount,
    totalAmount,
  };
};

// WHAT: Default starting data when the app first loads.
// WHY: Gives the user a realistic sample invoice immediately instead of an empty screen.
export const initialInvoice = {
  invoiceNumber: "INV-001",
  date: "2026-10-26",

  // Indian GST Rule:
  // true  = Inter-state sale (different states) -> Charge IGST
  // false = Intra-state sale (same state)      -> Split tax equally into CGST + SGST
  isInterState: true,

  seller: {
    name: "COMPANY NAME / TRADER NAME",
    tagline: "MANUFACTURER & TRADING OF HARDWARE & INDUSTRIAL GOODS",
    gstNumber: "07AAAAA0000A1Z5",
    phone: "+91 98765 43210",
    addressLine1: "123 Business Park, Main Road",
    addressLine2: "City - 110001",
  },

  customer: {
    name: "SAMPLE CLIENT PVT LTD",
    gstNumber: "07BBBBA0000B1Z2",
    phone: "+91 91234 56789",
    addressLine1: "Plot No. 45, Sector 10, Industrial Area",
    addressLine2: "City - 110001",
  },

  bank: {
    name: "SAMPLE BANK NAME",
    branch: "MAIN BRANCH CITY-110001",
    accountNo: "0000000000000000",
    ifsc: "SBIN0000000",
    upi: "company@upi",
  },

  transportDetails: {
    grNo: "BOND-009",
    vehicleNo: "DL-01-AB-1234",
    transport: "Goods Transport",
    place: "CITY",
    stateCode: "07",
    ewayNo: "10",
    marka: "EXEMPTED",
  },

  items: [
    {
      id: "item-1",
      description: "ITEM DESCRIPTION 1",
      hsnCode: "7318",
      quantity: 100,
      unit: "KG",
      unitPriceRupee: 100.00,
      gstRate: 18,
    },
    {
      id: "item-2",
      description: "ITEM DESCRIPTION 2",
      hsnCode: "2542",
      quantity: 50,
      unit: "KG",
      unitPriceRupee: 20000.00,
      gstRate: 18,
    },
  ],

  cartageAndPacking: 0.00,
  conditions: [
    "1. All disputes are subjected to Local Jurisdiction",
    "2. Interest @ 24% per annum will be charged if unpaid within 30 days",
    "3. Goods once sold will not be taken back"
  ]
};

// WHAT: Factory function to generate a new blank item row.
// WHY: Uses `crypto.randomUUID()` so every row gets a guaranteed unique `id` for React's `key` prop.
export const createEmptyItem = () => ({
  id: crypto.randomUUID(),
  description: '',
  hsnCode: '',
  quantity: 1,
  unit: 'KG',
  unitPriceRupee: 0,
  gstRate: 18,
});

// Lookup arrays for converting numbers into English words
const ones = [
  '',
  'One', 'Two', 'Three', 'Four', 'Five',
  'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen',
  'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen'
];

const tens = [
  '', '', 'Twenty', 'Thirty', 'Forty',
  'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

// WHAT: Converts any 1-to-3 digit chunk (0–999) into English words.
// WHY: Building block used by `numberToIndianWords` for each Indian place-value group.
const underThousandToWords = (number) => {
  let result = '';

  if (number >= 100) {
    result += ones[Math.floor(number / 100)] + ' Hundred';
    number %= 100;
    if (number > 0) result += ' ';
  }

  if (number >= 20) {
    result += tens[Math.floor(number / 10)];
    number %= 10;
    if (number > 0) result += ' ' + ones[number];
  } else if (number > 0) {
    result += ones[number];
  }

  return result;
};

// WHAT: Converts an integer into the Indian numbering system (Thousand, Lakh, Crore).
// WHY: Unlike Western grouping (every 3 digits), Indian numbering groups the last 3 digits first, then every 2 digits (e.g., 12,34,567).
const numberToIndianWords = (number) => {
  if (number === 0) return 'Zero';

  const scales = ['', 'Thousand', 'Lakh', 'Crore', 'Arab', 'Kharab'];
  const groups = [];

  // Step 1: Extract the rightmost 3 digits (hundreds)
  groups.push(number % 1000);
  number = Math.floor(number / 1000);

  // Step 2: Extract remaining digits in chunks of 2 (thousands, lakhs, crores)
  while (number > 0) {
    groups.push(number % 100);
    number = Math.floor(number / 100);
  }

  const words = [];

  // Step 3: Read groups from largest scale down to ones
  for (let i = groups.length - 1; i >= 0; i--) {
    if (groups[i] === 0) continue;

    const groupWords = underThousandToWords(groups[i]);
    const scale = scales[i];

    words.push(scale ? `${groupWords} ${scale}` : groupWords);
  }

  return words.join(' ');
};

// WHAT: Converts a currency amount into legal Indian invoice text (e.g., "Rupees One Thousand Only").
// WHY: Mandatory on Indian tax invoices to prevent tampering with numeric totals.
export const amountToWords = (amount) => {
  const safeAmount = Math.max(0, toSafeNumber(amount));

  // Convert to integer paise first to avoid decimal precision bugs (e.g., 19.99 * 100)
  const totalPaise = Math.round(safeAmount * 100);

  const rupees = Math.floor(totalPaise / 100);
  const paise = totalPaise % 100;

  let result = `Rupees ${numberToIndianWords(rupees)}`;

  if (paise > 0) {
    result += ` and ${numberToIndianWords(paise)} Paise`;
  }

  return `${result} Only`;
};

// WHAT: Master calculation engine that aggregates all items, taxes, shipping, and grand total.
// WHY: Centralizes all business math in a pure JS file so React components stay clean and testable.
export const computeInvoiceTotals = (invoice) => {
  let totalTaxable = 0;
  let totalCGST = 0;
  let totalSGST = 0;
  let totalIGST = 0;

  const processedItems = (invoice.items || []).map((item) => {
    const computed = calculateItemTotals(item);

    totalTaxable += computed.taxableAmount;

    // Apply either IGST (inter-state) or 50/50 CGST + SGST (intra-state)
    if (invoice.isInterState) {
      totalIGST += computed.gstAmount;
    } else {
      totalCGST += computed.gstAmount / 2;
      totalSGST += computed.gstAmount / 2;
    }

    return computed;
  });

  totalTaxable = roundToTwo(totalTaxable);
  totalCGST = roundToTwo(totalCGST);
  totalSGST = roundToTwo(totalSGST);
  totalIGST = roundToTwo(totalIGST);

  const cartage = roundToTwo(toSafeNumber(invoice.cartageAndPacking));

  const grandTotal = roundToTwo(
    totalTaxable +
    totalCGST +
    totalSGST +
    totalIGST +
    cartage
  );

  const hasCartage =
    invoice.cartageAndPacking !== '' &&
    invoice.cartageAndPacking !== null &&
    invoice.cartageAndPacking !== undefined;

  return {
    items: processedItems,
    taxableAmount: totalTaxable.toFixed(2),
    cgst: invoice.isInterState ? '0.00' : totalCGST.toFixed(2),
    sgst: invoice.isInterState ? '0.00' : totalSGST.toFixed(2),
    igst: invoice.isInterState ? totalIGST.toFixed(2) : '0.00',
    cartage: hasCartage ? cartage.toFixed(2) : '-',
    grandTotal: grandTotal.toFixed(2),
    inWords: amountToWords(grandTotal),
  };
};