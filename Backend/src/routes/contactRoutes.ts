import express from 'express';
import Contact from '../models/contact';

const router = express.Router();


router.post('/', async (req, res) => {
  try {
    const { phone, number, address, notes } = req.body;
    const newContact = new Contact({ phone, number, address, notes });
    const savedContact = await newContact.save();
    res.status(201).json(savedContact);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create contact', error });
  }
});


router.get('/get', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get contacts', error });
  }
});

export default router;
