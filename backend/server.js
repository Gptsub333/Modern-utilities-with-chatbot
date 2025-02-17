const express = require("express");
const http = require("http");
const cors = require("cors");
const twilio = require("twilio");
const dotenv = require("dotenv");
const {Server} = require("socket.io");

dotenv.config(); // Load environment variables

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Access-Control-Allow-Origin"],
    credentials: true,
  },
  transports: ["websocket", "polling"], // Ensure WebSocket & polling fallback
  path: "/socket.io/",
});

app.use(cors());
app.use(express.json());

// Twilio Configuration
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const OWNER_PHONE_NUMBER = process.env.OWNER_PHONE_NUMBER;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

// Sample predefined responses
const predefinedResponses = {
  "What are your business hours?": "Our business hours are from 9 AM to 6 PM, Monday to Friday.",
  "Do you offer discounts?": "Yes! We have seasonal discounts. Please visit our website for details.",
  "What services do you offer?": "We offer internet, mobile, and TV services at affordable prices!",
};

// Store active conversations
const conversations = {};

// WebSocket connection
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("sendMessage", (data) => {
    const { customerId, message } = data;

    // Check predefined responses
    if (predefinedResponses[message]) {
      io.to(customerId).emit("receiveMessage", {
        sender: "bot",
        message: predefinedResponses[message],
      });
    } else {
      // Forward message to owner via SMS
      console.log("Sending SMS from:", TWILIO_PHONE_NUMBER);
    console.log("Sending SMS to:", OWNER_PHONE_NUMBER);

      twilioClient.messages
        .create({
          body: `New message from customer:\n\n"${message}"`,
          from: TWILIO_PHONE_NUMBER,
          to: OWNER_PHONE_NUMBER,
        })
        .then(() => console.log("Message sent to owner"))
        .catch((err) => console.error("Twilio error:", err));

      if (!conversations[customerId]) conversations[customerId] = [];
      conversations[customerId].push({ sender: "customer", message });

      io.to(customerId).emit("receiveMessage", {
        sender: "bot",
        message: "Your message has been forwarded to our support team. They'll respond shortly!",
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

app.post("/sms-receive", express.urlencoded({ extended: true }), (req, res) => {
  console.log("🔥 Received Twilio Webhook Data:", JSON.stringify(req.body, null, 2));

  const { From, Body } = req.body;

  if (From === OWNER_PHONE_NUMBER) {
    console.log(`✅ New SMS from OWNER (${From}): ${Body}`);

    const customerId = Object.keys(conversations).pop();
    console.log("🔍 Mapped Customer ID:", customerId);

    if (customerId) {
      io.to(customerId).emit("receiveMessage", {
        sender: "owner",
        message: Body,
      });

      conversations[customerId].push({ sender: "owner", message: Body });
      console.log("📩 Message sent to chatbot:", Body);
    } else {
      console.log("❌ No active conversation found!");
    }
  }

  res.sendStatus(200);
});

// Start Server
app.get("/", (req, res)=>{

    res.send("Hey there!");
})
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
