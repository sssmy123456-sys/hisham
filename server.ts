import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Enable JSON request body parsing
  app.use(express.json({ limit: "10mb" }));

  // Ensure unified data persistence directory exists
  const dataDir = path.join(process.cwd(), "data");
  const dataFile = path.join(dataDir, "tickets.json");

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Initialize empty tickets array if file doesn't exist
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify([]), "utf-8");
  }

  // Helper to read current shared tickets
  const readSharedTickets = (): any[] => {
    try {
      if (fs.existsSync(dataFile)) {
        const content = fs.readFileSync(dataFile, "utf-8");
        return JSON.parse(content);
      }
    } catch (err) {
      console.error("Failed to read shared tickets file:", err);
    }
    return [];
  };

  // Helper to persist shared tickets
  const writeSharedTickets = (tickets: any[]) => {
    try {
      fs.writeFileSync(dataFile, JSON.stringify(tickets, null, 2), "utf-8");
    } catch (err) {
      console.error("Failed to write shared tickets file:", err);
    }
  };

  // -------------------------------------------------------------
  // API ROUTES (MUST COME FIRST BEFORE VITE MIDDLEWARE)
  // -------------------------------------------------------------

  // Health & Server Storage Info
  app.get("/api/health", (req, res) => {
    const tickets = readSharedTickets();
    res.json({
      status: "ok",
      serverMode: "unified_shared_storage",
      ticketsCount: tickets.length,
      timestamp: new Date().toISOString()
    });
  });

  // Get all shared tickets across all devices
  app.get("/api/tickets", (req, res) => {
    const tickets = readSharedTickets();
    res.json({
      success: true,
      tickets,
      total: tickets.length,
      timestamp: new Date().toISOString()
    });
  });

  // Submit a new ticket (from any device)
  app.post("/api/tickets", (req, res) => {
    const newTicket = req.body;
    if (!newTicket || !newTicket.id) {
      return res.status(400).json({ success: false, message: "بيانات البلاغ غير مكتملة" });
    }

    const tickets = readSharedTickets();
    const existingIndex = tickets.findIndex((t: any) => t.id === newTicket.id);

    if (existingIndex >= 0) {
      // If already exists, update
      tickets[existingIndex] = newTicket;
    } else {
      // Add to front of list
      tickets.unshift(newTicket);
    }

    writeSharedTickets(tickets);
    console.log(`[UnifiedStorage] New/Updated ticket ${newTicket.id} saved. Total: ${tickets.length}`);

    res.status(201).json({
      success: true,
      ticket: newTicket,
      total: tickets.length
    });
  });

  // Update an existing ticket (status, technician notes, rating, etc.)
  app.put("/api/tickets/:id", (req, res) => {
    const ticketId = req.params.id;
    const updatedFields = req.body;

    const tickets = readSharedTickets();
    const index = tickets.findIndex((t: any) => t.id === ticketId);

    if (index >= 0) {
      tickets[index] = { ...tickets[index], ...updatedFields };
      writeSharedTickets(tickets);
      console.log(`[UnifiedStorage] Ticket ${ticketId} updated. Status: ${tickets[index].status}`);
      return res.json({ success: true, ticket: tickets[index] });
    } else {
      // Insert if not found
      tickets.unshift(updatedFields);
      writeSharedTickets(tickets);
      return res.status(201).json({ success: true, ticket: updatedFields });
    }
  });

  // Delete a ticket
  app.delete("/api/tickets/:id", (req, res) => {
    const ticketId = req.params.id;
    let tickets = readSharedTickets();
    tickets = tickets.filter((t: any) => t.id !== ticketId);
    writeSharedTickets(tickets);
    console.log(`[UnifiedStorage] Ticket ${ticketId} removed. Remaining: ${tickets.length}`);
    res.json({ success: true, message: "تم حذف البلاغ بنجاح" });
  });

  // Clear all tickets
  app.post("/api/tickets/reset", (req, res) => {
    writeSharedTickets([]);
    console.log("[UnifiedStorage] Database cleared.");
    res.json({ success: true, message: "تمت إعادة ضبط قاعدة البيانات الموحدة", tickets: [] });
  });

  // -------------------------------------------------------------
  // VITE & FRONTEND SERVING
  // -------------------------------------------------------------
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Unified Storage IT Helpdesk Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
