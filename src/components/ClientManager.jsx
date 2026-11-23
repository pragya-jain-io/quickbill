
import { useRef, useState } from 'react';
import './ClientManager.css';
import {
    MAX_CLIENTS,
    parseClientsBackup,
} from '../ClientStorage.js';

function ClientManager({
    clients,
    selectedClientId,
    onSelect,
    onSaveNew,
    onUpdate,
    onDelete,
    onRestore,
}) {
    const fileInputRef = useRef(null);
    const [message, setMessage] = useState('');

    const selectedClient = clients.find(
        client => client.id === selectedClientId
    );

    const handleBackup = () => {
        const backup = {
            app: 'QuickBill',
            version: 1,
            clients,
        };

        const blob = new Blob(
            [JSON.stringify(backup, null, 2)],
            { type: 'application/json' }
        );

        
        const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');

  const timestamp = [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
  ].join('-') + '_' + [
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds()),
  ].join('-');

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
        link.href = url;
        link.download = `quickbill-clients-backup-${timestamp}.json`;
        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);
        setMessage('Backup file created.');
    };

    const handleRestore = async (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        try {
            const fileText = await file.text();
            const restoredClients = parseClientsBackup(fileText);

            const confirmed = window.confirm(
                `Restore ${restoredClients.length} clients? ` +
                'This will replace your currently saved clients.'
            );

            if (!confirmed) return;

            onRestore(restoredClients);
            setMessage('Clients restored successfully.');
        } catch (error) {
            setMessage(error.message || 'Could not restore this backup.');
        } finally {
            event.target.value = '';
        }
    };

    return (
        <section className="client-manager">
            <h3>Client Management</h3>

            <p>
                Saved clients: {clients.length} / {MAX_CLIENTS}
            </p>

            <label className="client-select-label">
                Select a saved client

                <select
                    value={selectedClientId}
                    onChange={event => onSelect(event.target.value)}
                >
                    <option value="">Select client</option>

                    {clients.map(client => (
                        <option key={client.id} value={client.id}>
                            {client.name}
                        </option>
                    ))}
                </select>
            </label>

            <div className="client-manager-actions">
                <button
                    type="button"
                    onClick={onSaveNew}
                    disabled={clients.length >= MAX_CLIENTS}
                >
                    Save Current Customer as New
                </button>

                <button
                    type="button"
                    onClick={onUpdate}
                    disabled={!selectedClient}
                >
                    Update Selected Client
                </button>

                <button
                    type="button"
                    className="danger-button"
                    onClick={onDelete}
                    disabled={!selectedClient}
                >
                    Delete Selected Client
                </button>
            </div>

            <div className="client-backup-actions">
                <button type="button" onClick={handleBackup}>
                    Backup Clients (JSON)
                </button>

                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                >
                    Restore Clients (JSON)
                </button>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json,application/json"
                    hidden
                    onChange={handleRestore}
                />
            </div>

            {message && (
                <p className="client-manager-message" role="status">
                    {message}
                </p>
            )}
        </section>
    );
}

export default ClientManager;
