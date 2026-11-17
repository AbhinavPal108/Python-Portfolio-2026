const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Data file path
const dataFile = path.join(dataDir, 'portfolio.json');

// Initialize portfolio data if not exists
if (!fs.existsSync(dataFile)) {
  const initialData = {
    profile: {
      name: "Abhinav Pal",
      title: "Advanced Python Programmer",
      subtitle: ">>> import abhinav",
      description: "Passionate Python developer exploring the frontiers of technology — from IoT systems to AI-driven applications, threading the serpent's path through advanced programming.",
      achievements: [
        { label: "Theory Score", value: "5.5★", date: "8/7/26" },
        { label: "Quiz", value: "2nd Place", date: "10/7/2026" },
        { label: "Assignments", value: "3★", date: "31/7/26" },
        { label: "Multi-threading", value: "3★", date: "19/8/2026" },
        { label: "Final", value: "2★ + 16★", date: "21/8/26" }
      ]
    },
    items: [
      {
        id: "item-1",
        title: "Stars & Achievements",
        category: "Achievements",
        description: "Academic performance record showcasing star ratings across theory, quizzes, assignments, and multi-threading modules. Legend! — Abhinav Pal's journey through Advanced Python Programming.",
        image: null,
        type: "default",
        icon: "⭐",
        color: "#FFD700",
        date: "2026"
      },
      {
        id: "item-2",
        title: "Storyboard",
        category: "Project Planning",
        description: "Visual storyboard documenting the project planning and development timeline for the Advanced Python Programming course. Mapping the arc of learning and implementation.",
        image: null,
        type: "default",
        icon: "📋",
        color: "#4CAF50",
        date: "2026"
      },
      {
        id: "item-3",
        title: "Python Tutorial Discussion",
        category: "Learning Sessions",
        description: "Interactive Python tutorial discussion session with peers. Collaborative learning environment where complex Python concepts are broken down and explored together.",
        image: null,
        type: "default",
        icon: "🐍",
        color: "#3776AB",
        date: "2026"
      },
      {
        id: "item-4",
        title: "IoT-Based Application for Impairment Assessment",
        category: "Research & Innovation",
        description: "System architecture for an IoT-Based Support Device for Auditory Processing Disorder (APD). Features directional microphones, environmental sensors, edge computing with ESP32/Raspberry Pi, cloud AI processing, and multi-modal user feedback.",
        image: null,
        type: "default",
        icon: "🔬",
        color: "#FF6B35",
        date: "2026"
      },
      {
        id: "item-5",
        title: "Class Quiz",
        category: "Assessments",
        description: "Secured 2nd Place in the Advanced Python Programming class quiz. Demonstrated strong command of Python concepts including data structures, OOP, threading, and advanced libraries.",
        image: null,
        type: "default",
        icon: "🏆",
        color: "#C0392B",
        date: "10/7/2026"
      },
      {
        id: "item-6",
        title: "Medium Blog",
        category: "Technical Writing",
        description: "Published technical blog on Medium covering advanced Python programming concepts, best practices, and real-world applications. Sharing knowledge with the broader developer community.",
        image: null,
        type: "default",
        icon: "✍️",
        color: "#1DB954",
        date: "2026"
      },
      {
        id: "item-7",
        title: "Audio Recording Website (Business Thesis)",
        category: "Web Development",
        description: "Developed an audio recording website as part of the business thesis project. Leveraging Python backend with Flask/FastAPI, integrated with cloud storage for seamless audio capture and analysis.",
        image: null,
        type: "default",
        icon: "🎙️",
        color: "#9B59B6",
        date: "2026"
      },
      {
        id: "item-8",
        title: "Website PPT",
        category: "Presentations",
        description: "Comprehensive PowerPoint presentation showcasing the website architecture, design decisions, technology stack, and implementation roadmap for the audio recording platform.",
        image: null,
        type: "default",
        icon: "📊",
        color: "#E67E22",
        date: "2026"
      },
      {
        id: "item-9",
        title: "Demo Video of Website",
        category: "Demonstrations",
        description: "Live demonstration video walkthrough of the completed website, showcasing features, user interface, functionality, and the Python-powered backend in action.",
        image: null,
        type: "default",
        icon: "🎬",
        color: "#E74C3C",
        date: "2026"
      },
      {
        id: "item-10",
        title: "Paddlit Screenshots with Questions",
        category: "Learning Tools",
        description: "Curated screenshots from Paddlit platform featuring Python programming questions and exercises. A collection of challenging problems solved during the advanced course.",
        image: null,
        type: "default",
        icon: "📱",
        color: "#1ABC9C",
        date: "2026"
      }
    ]
  };
  fs.writeFileSync(dataFile, JSON.stringify(initialData, null, 2));
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, uuidv4() + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|svg/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimeOk = file.mimetype.startsWith('image/');
    if (ext && mimeOk) cb(null, true);
    else cb(new Error('Only image files are allowed!'));
  }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Protect all portfolio mutations in production. Configure ADMIN_KEY in the host's
// environment settings; local development remains convenient without a key.
app.use('/api', (req, res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  if (process.env.NODE_ENV !== 'production' && !process.env.ADMIN_KEY) return next();
  const configuredKey = process.env.ADMIN_KEY;
  if (!configuredKey) return res.status(503).json({ error: 'Portfolio editing is disabled until ADMIN_KEY is configured.' });
  if (req.get('x-admin-key') !== configuredKey) return res.status(401).json({ error: 'Admin key required or incorrect.' });
  next();
});

// API Routes

// GET all portfolio data
app.get('/api/portfolio', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read portfolio data' });
  }
});

// POST - Add new portfolio item
app.post('/api/items', upload.single('image'), (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    const { title, category, description, icon, color, date } = req.body;

    const newItem = {
      id: 'item-' + uuidv4(),
      title: title || 'Untitled',
      category: category || 'General',
      description: description || '',
      image: req.file ? '/uploads/' + req.file.filename : null,
      type: req.file ? 'uploaded' : 'default',
      icon: icon || '📁',
      color: color || '#3776AB',
      date: date || new Date().toLocaleDateString('en-IN')
    };

    data.items.push(newItem);
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    res.json({ success: true, item: newItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add item' });
  }
});

// PUT - Update an item's editable content (image is optional)
app.put('/api/items/:id', upload.single('image'), (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    const item = data.items.find(entry => entry.id === req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    const fields = ['title', 'category', 'description', 'icon', 'color', 'date'];
    for (const field of fields) {
      if (req.body[field] !== undefined) item[field] = req.body[field];
    }
    if (req.file) {
      if (item.image && item.type === 'uploaded') {
        const oldPath = path.join(__dirname, 'public', item.image.replace(/^\//, ''));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      item.image = '/uploads/' + req.file.filename;
      item.type = 'uploaded';
    }
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    res.json({ success: true, item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// PUT - Update item image
app.put('/api/items/:id/image', upload.single('image'), (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    const item = data.items.find(i => i.id === req.params.id);

    if (!item) return res.status(404).json({ error: 'Item not found' });

    // Delete old image if exists
    if (item.image && item.type === 'uploaded') {
      const oldPath = path.join(__dirname, 'public', item.image);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    item.image = req.file ? '/uploads/' + req.file.filename : item.image;
    item.type = req.file ? 'uploaded' : item.type;

    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    res.json({ success: true, item });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update image' });
  }
});

// DELETE - Remove portfolio item
app.delete('/api/items/:id', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    const idx = data.items.findIndex(i => i.id === req.params.id);

    if (idx === -1) return res.status(404).json({ error: 'Item not found' });

    const item = data.items[idx];
    if (item.image && item.type === 'uploaded') {
      const imgPath = path.join(__dirname, 'public', item.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    data.items.splice(idx, 1);
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// PUT - Update profile
app.put('/api/profile', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    data.profile = { ...data.profile, ...req.body };
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    res.json({ success: true, profile: data.profile });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Restore a validated JSON backup. Uploaded image files are not embedded in backups.
app.put('/api/portfolio/restore', (req, res) => {
  try {
    const incoming = req.body;
    if (!incoming || typeof incoming !== 'object' || !incoming.profile || !Array.isArray(incoming.items)) {
      return res.status(400).json({ error: 'Invalid portfolio backup format' });
    }
    const safeData = { profile: incoming.profile, items: incoming.items };
    fs.writeFileSync(dataFile, JSON.stringify(safeData, null, 2));
    res.json({ success: true, data: safeData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to restore backup' });
  }
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🐍 Python Portfolio running on http://localhost:${PORT}`);
});
