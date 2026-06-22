const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');
const initSocket = require('./sockets/chatSocket');
require('dotenv').config();

const User = require('./models/User');
const Listing = require('./models/Listing');
const Booking = require('./models/Booking');
const Inventory = require('./models/Inventory');
const Message = require('./models/Message');
const Payment = require('./models/Payment');
const Review = require('./models/Review');
const DeliveryRequest = require('./models/DeliveryRequest');
const ChatGroup = require('./models/ChatGroup');

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST']
  }
});

initSocket(io);

const PORT = process.env.PORT || 5000;

const initDB = async () => {
  await User.createTable();
  await Listing.createTable();
  await Booking.createTable();
  await Inventory.createTable();
  await Message.createTable();
  await Payment.createTable();
  await Review.createTable();
  await DeliveryRequest.createTable(); 
  await ChatGroup.createTable();
};

initDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('DB connection failed:', err.message);
  });