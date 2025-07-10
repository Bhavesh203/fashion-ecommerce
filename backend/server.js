const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // ✅ Load env vars
const categoryRoutes = require('./routes/category');
const bannerRoutes = require('./routes/banner');

const app = express();
app.use(cors());

// Allow larger JSON bodies
app.use(express.json({ limit: '10mb' }));

// Allow larger URL-encoded bodies
app.use(express.urlencoded({ limit: '10mb', extended: true }));


// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend/build')));

// React fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});


// ✅ Use env variable
mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);
app.use('/uploads', express.static('uploads'));
// app.use('/api/menus', require('./routes/menu'));
app.use('/api/categories', categoryRoutes);
app.use('/api/banners', bannerRoutes);

// ✅ Use PORT from .env or fallback
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
