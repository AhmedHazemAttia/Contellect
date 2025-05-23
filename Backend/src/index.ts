import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import contactRoutes from './routes/contactRoutes';
import authRoutes from './routes/authRoutes';
import cors from 'cors';
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';
app.use(express.json());

app.use(cors({
  origin: '*',
  credentials: true
}));

app.use('/api/contacts', contactRoutes);
app.use('/api/auth', authRoutes);
const io = new Server(server, {
  cors: { origin: '*' } 
});
const editLocks = new Map<string, string>();

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);


  socket.on('start_edit', ({ contactId, username }) => {
    if (!editLocks.has(contactId)) {
      editLocks.set(contactId, username);
      io.emit('lock_update', Array.from(editLocks.entries()));
    } else {
      socket.emit('lock_denied', { contactId, lockedBy: editLocks.get(contactId) });
    }
  });


  socket.on('stop_edit', ({ contactId, username }) => {
    if (editLocks.get(contactId) === username) {
      editLocks.delete(contactId);
      io.emit('lock_update', Array.from(editLocks.entries()));
    }
  });

  socket.on('disconnect', () => {
    for (const [contactId, user] of editLocks.entries()) {
      if (user === socket.id) {
        editLocks.delete(contactId);
      }
    }
    io.emit('lock_update', Array.from(editLocks.entries()));
    console.log(`User disconnected: ${socket.id}`);
  });
});

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
