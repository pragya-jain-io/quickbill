import { useState } from 'react'
import { initialInvoice, computeInvoiceTotals } from './invoiceModel.js'
import './App.css'

function App() {
  const [invoice, setInvoice] = useState(initialInvoice)

  const totals = computeInvoiceTotals(invoice)

  const updateCustomerName = (value) => {
    setInvoice(previous => ({
      ...previous,
      customer: {
        ...previous.customer,
        name: value
      }
    }))
  }

  const updateItemQuantity = (itemId, value) => {
    setInvoice(previous => ({
      ...previous,
      items: previous.items.map(item =>
        item.id === itemId
          ? { ...item, quantity: Number(value) }
          : item
      )
    }))
  }

  const removeItem = (itemId) => {
  setInvoice(previous => ({
    ...previous,
    items: previous.items.filter(item => item.id !== itemId)
  }))
}
  const updateItem = (itemId, field, value) => {
    const numericFields = [
      'quantity',
      'unitPriceRupee',
      'gstRate'
    ]

    setInvoice(previous => ({
      ...previous,
      items: previous.items.map(item =>
        item.id === itemId
          ? {
            ...item,
            [field]: numericFields.includes(field)
              ? (value === '' ? '' : Number(value))
              : value
          }
          : item
      )
    }))
  }

  const addItem = () => {
    setInvoice(previous => ({
      ...previous,
      items: [
        ...previous.items,
        {
          id: crypto.randomUUID(),
          description: '',
          hsnCode: '',
          quantity: 1,
          unit: 'KG',
          unitPriceRupee: 0,
          gstRate: 18
        }
      ]
    }))
  }
  const formatINR = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Number(amount))

  return (
    <main>
      <h1>Invoice</h1>

      <label>Customer Name</label>
      <input
        value={invoice.customer.name}
        onChange={(event) => updateCustomerName(event.target.value)}
      />

      <p>Seller: {invoice.seller.name}</p>

      <h2>Items</h2>

      {invoice.items.map(item => (
  <div key={item.id}>
    <input
      placeholder="Description"
      value={item.description}
      onChange={event =>
        updateItem(item.id, 'description', event.target.value)
      }
    />

    <input
      placeholder="HSN Code"
      value={item.hsnCode}
      onChange={event =>
        updateItem(item.id, 'hsnCode', event.target.value)
      }
    />

    <input
      type="number"
      placeholder="Quantity"
      value={item.quantity}
      onChange={event =>
        updateItem(item.id, 'quantity', event.target.value)
      }
    />

    <input
      placeholder="Unit"
      value={item.unit}
      onChange={event =>
        updateItem(item.id, 'unit', event.target.value)
      }
    />

    <input
      type="number"
      placeholder="Rate"
      value={item.unitPriceRupee}
      onChange={event =>
        updateItem(item.id, 'unitPriceRupee', event.target.value)
      }
    />

    <input
      type="number"
      placeholder="GST %"
      value={item.gstRate}
      onChange={event =>
        updateItem(item.id, 'gstRate', event.target.value)
      }
    />

    <button onClick={() => removeItem(item.id)}>
      Remove
    </button>
  </div>
))}

<button onClick={addItem}>
  Add Item
</button>

      <h2>Invoice Total</h2>
      <p>{formatINR(totals.grandTotal)}</p>
    </main>
  )
}

export default App