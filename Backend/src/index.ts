import express from 'express';
import mongoose from 'mongoose';
import contactRoutes from './routes/contactRoutes';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = 'mongodb://localhost:27017/contellect';

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});
app.use('/api/contacts', contactRoutes);

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
