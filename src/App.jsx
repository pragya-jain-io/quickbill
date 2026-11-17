
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

import './App.css';

function App() {
  // Invoice data remains in App so it survives page switching.
  const [invoice, setInvoice] = useState(initialInvoice);

  // Controls which page is currently visible.
  const [currentPage, setCurrentPage] = useState('editor');

  // Calculate totals from the current invoice data.
  const totals = computeInvoiceTotals(invoice);

  // Convert numeric input values safely.
  const convertNumericValue = (field, value, numericFields) => {
    if (!numericFields.includes(field)) {
      return value;
    }

    if (value === '') {
      return '';
    }

    const number = Number(value);

    return Number.isFinite(number) ? number : '';
  };

  // Add a new invoice item.
  const handleAddItem = () => {
    setInvoice(previous => ({
      ...previous,
      items: [...previous.items, createEmptyItem()],
    }));
  };

  // Remove an invoice item.
  const handleRemoveItem = (itemId) => {
    setInvoice(previous => ({
      ...previous,
      items: previous.items.filter(item => item.id !== itemId),
    }));
  };

  // Update an invoice item field.
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
          ? { ...item, [field]: updatedValue }
          : item
      ),
    }));
  };

  // Update root-level or nested invoice fields.
  const handleFieldChange = (section, field, value) => {
    const updatedValue =
      section === 'root'
        ? convertNumericValue(field, value, NUMERIC_ROOT_FIELDS)
        : value;

    setInvoice(previous => {
      if (section === 'root') {
        return {
          ...previous,
          [field]: updatedValue,
        };
      }

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

      {currentPage === 'editor' && (
        <div className="editor-page">

          <InvoiceEditor
            invoice={invoice}
            onFieldChange={handleFieldChange}
            onItemChange={handleItemChange}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
          />

          <div className="page-navigation">
            <span></span>
            <button
              type="button"
              className="navigation-button"
              onClick={() => setCurrentPage('preview')}
            >
              →
            </button>
          </div>

        </div>
      )}

      {currentPage === 'preview' && (
        <div className="preview-page">

          <div className="page-navigation">
            <button
              type="button"
              className="navigation-button secondary"
              onClick={() => setCurrentPage('editor')}
            >
              ←
            </button>
            <span></span>

  <button
    type="button"
    className="navigation-button"
    onClick={() => window.print()}
  >
    Download PDF
  </button>
</div>
          

          <InvoicePreview
            invoice={invoice}
            totals={totals}
          />

        </div>
      )}

    </main>
  );
}

export default App;
