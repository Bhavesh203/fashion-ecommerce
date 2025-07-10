const express = require('express');
const router = express.Router();
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`);
    },
})

const upload = multer({ storage })

// Create user with image
router.post('/register', upload.single('image'), async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        const image = req.file ? req.file.filename : '';
        const user = new User({ name, username, email, password, image });
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        console.error('Registration Error:', err); // <-- ADD THIS
        res.status(500).json({ error: 'Registration failed' });
    }
})


// // Register a user
// router.post('/register', async (req, res) => {
//     try {
//         const user = await User.create(req.body);
//         res.status(201).json(user);
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// });

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
        res.json(user);
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Get all users
router.get('/', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

// Delete user
router.delete('/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Delete failed' });
    }
});


// PUT (Update) user by ID
// router.put('/:id', async (req, res) => {
//     try {
//         const updatedUser = await User.findByIdAndUpdate(
//             req.params.id,
//             {
//                 name: req.body.name,
//                 username: req.body.username,
//                 email: req.params.email,
//                 password: req.body.password,
//             },
//             { new: true }
//         );
//         res.json(updatedUser);
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to update user' });
//     }
// });

// router.put('/:id', upload.single('image'), async (req, res) => {
//     try {
//         const { name, username, email, password } = req.body;
//         const updateData = { name, username, email, password };

//         if (req.file) {
//             updateData.image = req.file.filename; // If new image uploaded
//         }

//         const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
//         res.status(200).json(user);
//     } catch (err) {
//         console.error('Update Error:', err);
//         res.status(500).json({ error: 'Failed to update user' });
//     }
// });


router.put('/:id', async (req, res) => {
  try {
    const { name, username, email, password, image } = req.body;
    const updateData = { name, username, email, password };

    // If image is base64
    if (image && image.startsWith('data:image')) {
      const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
      const ext = image.substring("data:image/".length, image.indexOf(";base64"));
      const fileName = `${Date.now()}.${ext}`;
      const filePath = path.join(__dirname, '../uploads', fileName);
      fs.writeFileSync(filePath, base64Data, 'base64');
      updateData.image = fileName;
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json(user);
  } catch (err) {
    console.error('Update Error:', err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

module.exports = router; // ✅ IMPORTANT
