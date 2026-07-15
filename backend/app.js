const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false
}));
app.use(morgan('dev'));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth',      require('./routes/authRoutes'));
app.use('/api/listings',  require('./routes/listingRoutes'));
app.use('/api/bookings',  require('./routes/bookingRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/chat',      require('./routes/chatRoutes'));
app.use('/api/payments',  require('./routes/paymentRoutes'));
app.use('/api/admin',     require('./routes/adminRoutes'));
app.use('/api/courier',   require('./routes/courierRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/deliveries', require('./routes/deliveryRoutes'));
app.use('/api/group-chat', require('./routes/groupChatRoutes'));
app.use('/api/cms', require('./routes/cmsRoutes'));
app.use('/api/admin/cms', require('./routes/cmsRoutes'));


app.get('/', (req, res) => res.json({ message: 'Saman-Bhandar API running ' }));

app.use(require('./middleware/errorHandler'));

module.exports = app;