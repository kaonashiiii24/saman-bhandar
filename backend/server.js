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
const SiteSetting = require('./models/SiteSetting');
const HomepageSection = require('./models/HomepageSection');
const Service = require('./models/Service');
const HowItWorksStep = require('./models/HowItWorksStep');
const Feature = require('./models/Feature');
const Testimonial = require('./models/Testimonial');
const Faq = require('./models/Faq');
const ContactSetting = require('./models/ContactSetting');
const FooterSetting = require('./models/FooterSetting');
const ThemeSetting = require('./models/ThemeSetting');
const Media = require('./models/Media');
const AboutValue = require('./models/AboutValue');
const ServicesWhyStat = require('./models/ServicesWhyStat');
const PricingPlan = require('./models/PricingPlan');
const RoleStep = require('./models/RoleStep');

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
  await SiteSetting.createTable();
  await HomepageSection.createTable();
  await Service.createTable();
  await HowItWorksStep.createTable();
  await Feature.createTable();
  await Testimonial.createTable();
  await Faq.createTable();
  await ContactSetting.createTable();
  await FooterSetting.createTable();
  await ThemeSetting.createTable();
  await Media.createTable();
  await AboutValue.createTable();
  await ServicesWhyStat.createTable();
  await PricingPlan.createTable();
  await RoleStep.createTable();
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