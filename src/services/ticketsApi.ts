import { Ticket } from '../types';
import { getStoredTickets, saveTicketsToStorage } from '../utils/helpers';

export interface SyncStatus {
  state: 'synced' | 'syncing' | 'offline' | 'error';
  lastSyncTime: Date | null;
  serverMode: string;
}

/**
 * Fetch tickets from the shared cloud/server storage.
 * Automatically synchronizes with local cache for instant zero-latency UI.
 */
export async function fetchTicketsApi(): Promise<{ tickets: Ticket[]; fromServer: boolean }> {
  try {
    const res = await fetch('/api/tickets', {
      headers: { 'Accept': 'application/json' },
      cache: 'no-store'
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();
    if (data && Array.isArray(data.tickets)) {
      // Update local cache with authoritative server data
      saveTicketsToStorage(data.tickets);
      return { tickets: data.tickets, fromServer: true };
    }
  } catch (err) {
    console.warn('[SyncService] Using local cached tickets due to fetch error:', err);
  }

  // Fallback to local storage if offline or during server initialization
  return { tickets: getStoredTickets(), fromServer: false };
}

/**
 * Submit a new ticket to the unified database.
 * Visible across all connected devices immediately.
 */
export async function createTicketApi(newTicket: Ticket): Promise<Ticket> {
  // Update local storage first for optimistic responsiveness
  const current = getStoredTickets();
  const updated = [newTicket, ...current.filter(t => t.id !== newTicket.id)];
  saveTicketsToStorage(updated);

  try {
    const res = await fetch('/api/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(newTicket)
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.ticket) {
        return data.ticket;
      }
    }
  } catch (err) {
    console.error('[SyncService] Failed to post ticket to unified server:', err);
  }

  return newTicket;
}

/**
 * Update an existing ticket on the unified server (status, notes, logs).
 */
export async function updateTicketApi(ticket: Ticket): Promise<Ticket> {
  // Update local storage first
  const current = getStoredTickets();
  const index = current.findIndex(t => t.id === ticket.id);
  if (index >= 0) {
    current[index] = ticket;
  } else {
    current.unshift(ticket);
  }
  saveTicketsToStorage(current);

  try {
    const res = await fetch(`/api/tickets/${encodeURIComponent(ticket.id)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(ticket)
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.ticket) {
        return data.ticket;
      }
    }
  } catch (err) {
    console.error('[SyncService] Failed to update ticket on unified server:', err);
  }

  return ticket;
}

/**
 * Delete a ticket from the unified server.
 */
export async function deleteTicketApi(ticketId: string): Promise<boolean> {
  const current = getStoredTickets().filter(t => t.id !== ticketId);
  saveTicketsToStorage(current);

  try {
    const res = await fetch(`/api/tickets/${encodeURIComponent(ticketId)}`, {
      method: 'DELETE'
    });
    return res.ok;
  } catch (err) {
    console.error('[SyncService] Failed to delete ticket from server:', err);
    return false;
  }
}

/**
 * Reset tickets database (for testing / admin purge).
 */
export async function resetTicketsApi(): Promise<void> {
  saveTicketsToStorage([]);
  try {
    await fetch('/api/tickets/reset', { method: 'POST' });
  } catch (err) {
    console.error('[SyncService] Failed to reset server tickets:', err);
  }
}
