
import { useEffect, useState } from 'react';

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

import {
  loadClients,
  saveClients,
  createClient,
  MAX_CLIENTS,
} from './ClientStorage.js';

import ClientManager from './components/ClientManager';


function App() {
  // Invoice data remains in App so it survives page switching.
  const [invoice, setInvoice] = useState(initialInvoice);

  // Controls which page is currently visible.
  const [currentPage, setCurrentPage] = useState('editor');

  // Calculate totals from the current invoice data.
  const totals = computeInvoiceTotals(invoice);


  const [clients, setClients] = useState(loadClients);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [storageError, setStorageError] = useState('');


  // Automatically save client changes to local storage.
  useEffect(() => {
    try {
      saveClients(clients);
      setStorageError('');
    } catch (error) {
      console.error('Could not save clients:', error);
      setStorageError('Could not save clients on this device.');
    }
  }, [clients]);

  // Load a saved client into the current invoice.
  const handleSelectClient = (clientId) => {
    setSelectedClientId(clientId);

    const selectedClient = clients.find(
      client => client.id === clientId
    );

    if (!selectedClient) return;

    const { id, ...customer } = selectedClient;

    setInvoice(previous => ({
      ...previous,
      customer,
    }));
  };

  // Save the current invoice customer as a new client.
  const handleSaveNewClient = () => {
    if (!invoice.customer?.name?.trim()) {
      window.alert('Enter a customer name first.');
      return;
    }

    if (clients.length >= MAX_CLIENTS) {
      window.alert(`You can save a maximum of ${MAX_CLIENTS} clients.`);
      return;
    }

    const newClient = createClient(invoice.customer);

    setClients(previous => [...previous, newClient]);
    setSelectedClientId(newClient.id);
  };

  // Update the currently selected saved client.
  const handleUpdateClient = () => {
    if (!selectedClientId) return;

    if (!invoice.customer?.name?.trim()) {
      window.alert('Customer name cannot be empty.');
      return;
    }

    setClients(previous =>
      previous.map(client =>
        client.id === selectedClientId
          ? {
            ...createClient(invoice.customer),
            id: selectedClientId,
          }
          : client
      )
    );
  };

  // Delete the selected saved client.
  const handleDeleteClient = () => {
    const selectedClient = clients.find(
      client => client.id === selectedClientId
    );

    if (!selectedClient) return;

    const confirmed = window.confirm(
      `Delete ${selectedClient.name} from saved clients?`
    );

    if (!confirmed) return;

    setClients(previous =>
      previous.filter(client => client.id !== selectedClientId)
    );

    setSelectedClientId('');
  };

  // Replace saved clients with the restored backup.
  const handleRestoreClients = (restoredClients) => {
    setClients(restoredClients);
    setSelectedClientId('');
  };


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
          <ClientManager
            clients={clients}
            selectedClientId={selectedClientId}
            onSelect={handleSelectClient}
            onSaveNew={handleSaveNewClient}
            onUpdate={handleUpdateClient}
            onDelete={handleDeleteClient}
            onRestore={handleRestoreClients}
          />

          {storageError && (
            <p className="storage-error" role="alert">
              {storageError}
            </p>
          )}


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
