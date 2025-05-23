import express from 'express';
import Contact from '../models/contact';
import { body, validationResult } from 'express-validator';

const router = express.Router();


router.post('/add',
  [
    body('name')
      .notEmpty()
      .isString()
      .withMessage('name is required and must be string'),

    body('phone')
      .isLength({ min: 11 })
      .withMessage('Phone number must be at least 11 digits')
      .matches(/^\d+$/)
      .withMessage('Phone number must contain only digits'),

    body('address')
      .notEmpty()
      .withMessage('Address is required'),

    body('notes')
      .optional()
      .isString()
      .withMessage('Notes must be a string'),
  ],
   async (req:any, res:any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

  try {
    const { phone, name, address, notes } = req.body;
    const newContact = new Contact({ phone, name, address, notes });
    const savedContact = await newContact.save();
    res.status(201).json(savedContact);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create contact', error });
  }
});

//TODO: Pagination 5 / page
router.get('/get', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get contacts', error });
  }
});

export default router;
