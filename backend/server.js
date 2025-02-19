require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// Store chat sessions
const userSessions = new Map();

// WhatsApp API Config
const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL;
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const OWNER_PHONE_NUMBER = process.env.OWNER_PHONE_NUMBER;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "my_secure_verify_token";

// 🟢 Webhook Verification (For Meta API)
app.get("/webhook", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
        console.log("Webhook verified successfully!");
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

// 🟢 Handle User Inquiry (Sends Message to WhatsApp)
app.post("/send-message", async (req, res) => {
    const { name, phone, email, message } = req.body;

    if (!name || !phone || !message) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    // Store session
    userSessions.set(phone, { name, email, phone, messages: [] });

    try {
        // Send message to owner's WhatsApp
        await axios.post(WHATSAPP_API_URL, {
            messaging_product: "whatsapp",
            to: OWNER_PHONE_NUMBER,
            type: "text",
            text: { body: `New Inquiry:\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nMessage: ${message}` }
        }, { headers: { Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}` } });

        res.status(200).json({ success: true, message: "Message sent successfully" });

    } catch (error) {
        console.error("Error sending WhatsApp message:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to send message" });
    }
});

// 🟢 Send Reply from Owner
app.post("/send-reply", async (req, res) => {
  const { phone, message, messageId } = req.body;

  if (!phone || !message) {
      return res.status(400).json({ error: "Missing required fields" });
  }

  try {
      // Send message to user's WhatsApp
      await axios.post(WHATSAPP_API_URL, {
          messaging_product: "whatsapp",
          to: phone,
          type: "text",
          text: { body: message }
      }, { headers: { Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}` } });

      // Emit reply to frontend (specific to user)
      io.emit(`reply-${phone}`, { sender: "owner", message });

      res.status(200).json({ success: true, message: "Reply sent successfully" });
  } catch (error) {
      console.error("Error sending WhatsApp reply:", error.response.data);
      res.status(500).json({ error: "Failed to send reply" });
  }
});


// 🟢 Webhook: Receive WhatsApp Replies from Owner
app.post("/webhook", async (req, res) => {
    console.log("Webhook received:", JSON.stringify(req.body, null, 2));

    if (req.body.entry) {
        const messageData = req.body.entry[0].changes[0].value.messages;

        if (messageData) {
            const message = messageData[0];
            const senderNumber = message.from; // This is the WhatsApp number replying
            const replyText = message.text.body;

            if (userSessions.has(senderNumber)) {
                userSessions.get(senderNumber).messages.push({ owner: replyText });

                // Send real-time message to chatbot frontend
                io.emit(`reply-${senderNumber}`, { sender: "owner", message: replyText });
            }
        }
    }

    res.sendStatus(200);
});

// 🟢 WebSocket for Real-Time Messaging
io.on("connection", (socket) => {
    console.log("WebSocket connected");

    socket.on("join", (phone) => {
        console.log(`User connected: ${phone}`);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

server.listen(5000, () => console.log("Server running on port 5000"));
