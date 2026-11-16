import { useState } from 'react';
import {
  initialInvoice,
  computeInvoiceTotals,
  createEmptyItem,
} from './InvoiceModel.js';
import {
  NUMERIC_ITEM_FIELDS,
  NUMERIC_ROOT_FIELDS,
} from './InvoiceConfig.js';
import InvoiceEditor from './components/InvoiceEditor';
import InvoicePreview from './components/InvoicePreview';

function App() {
  // WHAT: Holds the single source of truth for the entire invoice data.
  // WHY: "Lifting state up" to App allows both the Editor (left) and Preview (right) to stay in sync automatically.
  const [invoice, setInvoice] = useState(initialInvoice);

  // WHAT: Calculates all tax, item, and grand totals on every render.
  // WHY: Derived state! We don't store totals in useState because they can be calculated directly from `invoice`, avoiding sync bugs.
  const totals = computeInvoiceTotals(invoice);

  // WHAT: Safely converts string input from HTML forms into actual JavaScript numbers.
  // WHY: HTML <input> always returns strings (e.g., "100"). Without this, "100" + "50" would become "10050" instead of 150.
  const convertNumericValue = (field, value, numericFields) => {
    // If this field isn't supposed to be a number (like customer name), return as-is.
    if (!numericFields.includes(field)) {
      return value;
    }

    // Allow empty string so the user can clear the input box completely while typing.
    if (value === '') {
      return '';
    }

    const number = Number(value);

    // Return the valid number, or empty string if the user typed invalid characters.
    return Number.isFinite(number) ? number : '';
  };

  // WHAT: Appends a new blank item row to the invoice.
  // WHY: Uses functional state update (`previous => ...`) and spread syntax to keep React state immutable.
  const handleAddItem = () => {
    setInvoice(previous => ({
      ...previous,
      items: [...previous.items, createEmptyItem()],
    }));
  };

  // WHAT: Deletes a specific item row using its unique ID.
  // WHY: `.filter()` creates a brand-new array without mutating the existing state array.
  const handleRemoveItem = (itemId) => {
    setInvoice(previous => ({
      ...previous,
      items: previous.items.filter(item => item.id !== itemId),
    }));
  };

  // WHAT: Updates a single field (like quantity or price) inside a specific item object.
  // WHY: `.map()` creates a new array, updating only the matching item while leaving other items untouched.
  const handleItemChange = (itemId, field, value) => {
    const updatedValue = convertNumericValue(
      field,
      value,
      NUMERIC_ITEM_FIELDS
    );

    setInvoice(previous => ({
      ...previous,
      items: previous.items.map(item =>
        item.id === itemId
          ? { ...item, [field]: updatedValue } // Computed property name `[field]` updates just that key
          : item
      ),
    }));
  };

  // WHAT: Updates top-level fields (like date) or nested sections (like seller/customer).
  // WHY: One single reusable handler avoids writing dozens of separate onChange functions for every input.
  const handleFieldChange = (section, field, value) => {
    const updatedValue =
      section === 'root'
        ? convertNumericValue(field, value, NUMERIC_ROOT_FIELDS)
        : value;

    setInvoice(previous => {
      // Case 1: Field lives directly on the main invoice object (e.g., invoiceNumber, date)
      if (section === 'root') {
        return {
          ...previous,
          [field]: updatedValue,
        };
      }

      // Case 2: Field lives inside a nested object (e.g., customer.name, bank.ifsc)
      // Must spread both the outer object AND the nested section object to preserve immutability.
      return {
        ...previous,
        [section]: {
          ...previous[section],
          [field]: updatedValue,
        },
      };
    });
  };

  return (
    <main className="app-container">
      {/* Left side: Form inputs + callback functions to update state */}
      <InvoiceEditor
        invoice={invoice}
        onFieldChange={handleFieldChange}
        onItemChange={handleItemChange}
        onAddItem={handleAddItem}
        onRemoveItem={handleRemoveItem}
      />

      {/* Right side: Read-only live print layout receiving data and calculated totals */}
      <InvoicePreview
        invoice={invoice}
        totals={totals}
      />
    </main>
  );
}

export default App;