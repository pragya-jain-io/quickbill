/**
 * Helper utility to round numbers strictly to 2 decimal places (Rupee & Paise)
 */
const roundToTwo = (num) => {
  return Number(Math.round(num + "e+2") + "e-2");
};

/**
 * Calculates item-level values with precise 2-decimal rounding.
 * Taxable Amount = Quantity * Unit Price
 * GST Amount = Taxable Amount * (GST Rate / 100)
 */
const calculateItemTotals = (item) => {
  const { quantity, unitPriceRupee, gstRate } = item;
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

export const initialInvoice = {
  invoiceNumber: "INV-001",
  date: "2026-10-26",

  // Transaction Tax Mode: 'LOCAL' (CGST + SGST) or 'INTERSTATE' (IGST)
  // Mutually exclusive: true means IGST applies, false means CGST + SGST apply
  isInterState: false, 

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
    grNo: "",
    vehicleNo: "",
    transport: "Goods Transport",
    place: "CITY",
    stateCode: "07",
    ewayNo: "10",
    marka: "EXEMPTED",
    rce: "202000",
  },

  items: [
    {
      id: "item-1",
      description: "ITEM DESCRIPTION 1",
      hsnCode: "7318",
      quantity: 100,
      unit: "KG",
      unitPriceRupee: 100.00,
      gstRate: 18, // 18% Total GST
    },
    {
      id: "item-2",
      description: "ITEM DESCRIPTION 2",
      hsnCode: "2542",
      quantity: 50,
      unit: "KG",
      unitPriceRupee: 200.00,
      gstRate: 18, // 18% Total GST
    },
  ],

  cartageAndPacking: 0.00, // Can be number or '-'
  conditions: [
    "1. All disputes are subjected to Local Jurisdiction",
    "2. Interest @ 24% per annum will be charged if unpaid within 30 days",
    "3. Goods once sold will not be taken back"
  ]
};

/**
 * Master calculation engine for the entire invoice totals
 */
export const computeInvoiceTotals = (invoice) => {
  let totalTaxable = 0;
  let totalCGST = 0;
  let totalSGST = 0;
  let totalIGST = 0;

  const processedItems = invoice.items.map((item) => {
    const computed = calculateItemTotals(item);
    totalTaxable += computed.taxableAmount;

    if (invoice.isInterState) {
      totalIGST += computed.gstAmount;
    } else {
      // Split evenly into CGST and SGST (e.g., 9% each out of 18%)
      totalCGST += roundToTwo(computed.gstAmount / 2);
      totalSGST += roundToTwo(computed.gstAmount / 2);
    }
    return computed;
  });

  totalTaxable = roundToTwo(totalTaxable);
  totalCGST = roundToTwo(totalCGST);
  totalSGST = roundToTwo(totalSGST);
  totalIGST = roundToTwo(totalIGST);

  const cartage = typeof invoice.cartageAndPacking === 'number' ? invoice.cartageAndPacking : 0;
  const grandTotal = roundToTwo(totalTaxable + totalCGST + totalSGST + totalIGST + cartage);

  
  return {
    items: processedItems,
    taxableAmount: totalTaxable.toFixed(2),
    cgst: invoice.isInterState ? "0.00" : totalCGST.toFixed(2),
    sgst: invoice.isInterState ? "0.00" : totalSGST.toFixed(2),
    igst: invoice.isInterState ? totalIGST.toFixed(2) : "0.00",
    cartage: typeof invoice.cartageAndPacking === 'number' ? roundToTwo(invoice.cartageAndPacking).toFixed(2) : '-',
    grandTotal: grandTotal.toFixed(2),
  };
};