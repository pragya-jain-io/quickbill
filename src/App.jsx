import { useState } from 'react'
import { initialInvoice, computeInvoiceTotals } from './invoiceModel.js'
import InvoicePreview from './components/InvoicePreview.jsx'
import './components/InvoicePreview.css'
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
    <div className="app-container">
      {/* You can render controls or the preview here */}
      <InvoicePreview invoice={invoice} totals={totals} />
    </div>
  );
 
}

export default App