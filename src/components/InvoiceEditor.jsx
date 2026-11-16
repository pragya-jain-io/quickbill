import './InvoiceEditor.css';
import { FIELD_CONFIG } from '../InvoiceConfig.js';

// WHAT: Reusable wrapper around a <label> and <input>.
// WHY: Prevents repeating label + input HTML 30+ times and centralizes readOnly behavior.
function Field({
  label,
  value,
  onChange,
  type = 'text',
  readOnly = false,
  ...props
}) {
  return (
    <label className="editor-field">
      <span>{label}</span>

      <input
        {...props}
        type={type}
        // WHAT: Controlled input pattern — React state drives the value; `?? ''` avoids uncontrolled-input warnings.
        value={value ?? ''}
        readOnly={readOnly}
        // WHAT: Blocks updates if field is read-only; otherwise passes only the string value up.
        onChange={
          readOnly || !onChange
            ? undefined
            : (e) => onChange(e.target.value)
        }
      />
    </label>
  );
}

// WHAT: Reusable layout card for grouping related inputs under a heading.
// WHY: Keeps the form clean, modular, and easy to scan.
function Section({ title, children }) {
  return (
    <section className="editor-section">
      <h3>{title}</h3>
      <div className="editor-grid">{children}</div>
    </section>
  );
}

function InvoiceEditor({
  invoice,
  onFieldChange,
  onItemChange,
  onAddItem,
  onRemoveItem
}) {
  // WHAT: Helper to render any top-level or nested section field.
  // WHY: Automatically looks up `readOnly` rules from `InvoiceConfig.js` so permissions aren't hardcoded in JSX.
  const renderField = (section, field, label, value, props = {}) => {
    const readOnly = FIELD_CONFIG[section]?.[field]?.readOnly ?? false;

    return (
      <Field
        {...props}
        label={label}
        value={value}
        readOnly={readOnly}
        onChange={
          readOnly
            ? undefined
            : (v) => onFieldChange(section, field, v)
        }
      />
    );
  };

  // WHAT: Helper specifically for fields inside an invoice line item.
  // WHY: Item updates need `item.id` so App.jsx knows which item in the array to update.
  const renderItemField = (item, field, label, props = {}) => {
    const readOnly = FIELD_CONFIG.items?.[field]?.readOnly ?? false;

    return (
      <Field
        {...props}
        label={label}
        value={item[field]}
        readOnly={readOnly}
        onChange={
          readOnly
            ? undefined
            : (v) => onItemChange(item.id, field, v)
        }
      />
    );
  };

  return (
    <div className="invoice-editor">
      <h2>Invoice Editor</h2>

      {/* Root-level invoice metadata */}
      <Section title="Invoice Information">
        {renderField('root', 'invoiceNumber', 'Invoice Number', invoice.invoiceNumber)}
        {renderField('root', 'date', 'Invoice Date', invoice.date, { type: 'date' })}

        {/* Checkbox uses `checked` and `e.target.checked` (boolean) instead of `value` */}
        <label className="editor-field checkbox-field">
          <span>Inter-state transaction (IGST)</span>
          <input
            type="checkbox"
            checked={invoice.isInterState}
            disabled={FIELD_CONFIG.root.isInterState.readOnly}
            onChange={(e) =>
              onFieldChange('root', 'isInterState', e.target.checked)
            }
          />
        </label>
      </Section>

      {/* Locked Seller Details (configured as readOnly: true in InvoiceConfig.js) */}
      <Section title="Seller Details">
        {renderField('seller', 'name', 'Company Name', invoice.seller.name)}
        {renderField('seller', 'tagline', 'Tagline', invoice.seller.tagline)}
        {renderField('seller', 'gstNumber', 'GST Number', invoice.seller.gstNumber)}
        {renderField('seller', 'phone', 'Phone', invoice.seller.phone)}
        {renderField('seller', 'addressLine1', 'Address Line 1', invoice.seller.addressLine1)}
        {renderField('seller', 'addressLine2', 'Address Line 2', invoice.seller.addressLine2)}
      </Section>

      {/* Editable Buyer Details */}
      <Section title="Customer Details">
        {renderField('customer', 'name', 'Customer Name', invoice.customer.name)}
        {renderField('customer', 'phone', 'Phone', invoice.customer.phone)}
        {renderField('customer', 'gstNumber', 'GST Number', invoice.customer.gstNumber)}
        {renderField('customer', 'addressLine1', 'Address Line 1', invoice.customer.addressLine1)}
        {renderField('customer', 'addressLine2', 'Address Line 2', invoice.customer.addressLine2)}
      </Section>

      {/* Logistics & E-Way Bill Details */}
      <Section title="Transport Details">
        {renderField('transportDetails', 'grNo', 'GR Number', invoice.transportDetails.grNo)}
        {renderField('transportDetails', 'vehicleNo', 'Vehicle Number', invoice.transportDetails.vehicleNo)}
        {renderField('transportDetails', 'transport', 'Transport', invoice.transportDetails.transport)}
        {renderField('transportDetails', 'place', 'Place', invoice.transportDetails.place)}
        {renderField('transportDetails', 'stateCode', 'State Code', invoice.transportDetails.stateCode)}
        {renderField('transportDetails', 'ewayNo', 'E-way Number', invoice.transportDetails.ewayNo)}
        {renderField('transportDetails', 'marka', 'Marka', invoice.transportDetails.marka)}
      </Section>


      {/* Dynamic List of Line Items */}
      <Section title="Invoice Items">
        <div className="items-editor">
          {invoice.items.map((item, index) => (
            // WHY key={item.id}: Stable unique IDs let React track items accurately when adding/removing rows.
            <div className="item-editor-card" key={item.id}>
              <div className="item-editor-heading">
                <strong>Item {index + 1}</strong>

                <button
                  type="button"
                  className="remove-button"
                  onClick={() => onRemoveItem(item.id)}
                >
                  Remove
                </button>
              </div>

              <div className="editor-grid">
                {renderItemField(item, 'description', 'Description')}
                {renderItemField(item, 'hsnCode', 'HSN Code')}
                {renderItemField(item, 'quantity', 'Quantity', {
                  type: 'number',
                  min: '0',
                  step: 'any',
                })}
                {renderItemField(item, 'unit', 'Unit')}
                {renderItemField(item, 'unitPriceRupee', 'Rate (₹)', {
                  type: 'number',
                  min: '0',
                  step: '0.01',
                })}
                {renderItemField(item, 'gstRate', 'GST Rate (%)', {
                  type: 'number',
                  min: '0',
                  max: '100',
                  step: 'any',
                })}
              </div>
            </div>
          ))}

          <button
            type="button"
            className="add-button"
            onClick={onAddItem}
          >
            + Add Item
          </button>
        </div>
      </Section>

      {/* Extra Shipping/Packing Fees */}
      <Section title="Additional Charges">
        {renderField(
          'root',
          'cartageAndPacking',
          'Cartage and Packing (₹)',
          invoice.cartageAndPacking,
          {
            type: 'number',
            min: '0',
            step: '0.01',
          }
        )}
      </Section>

      
    </div>
  );
}

export default InvoiceEditor;