import express from 'express';
import Contact from '../models/Contact';
import { body, validationResult } from 'express-validator';
import { authenticateToken, authorizeRole } from '../middleware/authenitacte';
const router = express.Router();

router.use(authenticateToken);

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

router.get('/get', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const search = req.query.search as string;

    const filter: any = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Contact.countDocuments(filter);
    const contacts = await Contact.find(filter)
      .skip(skip)
      .limit(limit)
      .exec();

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get contacts', error });
  }
});


router.put('/:id',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('phone')
      .matches(/^\d+$/).withMessage('Phone must contain only numbers')
      .isLength({ min: 11 }).withMessage('Phone must be at least 11 digits'),
    body('address').notEmpty().withMessage('Address is required'),
  ],
  async (req:any, res:any) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try{
      const updateContact = await Contact.findByIdAndUpdate(
        req.params.id,
        {
          name: req.body.name,
          phone: req.body.phone,
          address: req.body.address,
          notes: req.body?.notes
        },
        {
          new: true,
          runValidators: true
        });

        if (!updateContact) {
        return res.status(404).json({ message: 'Contact not found' });
      }

      res.json({ message: 'Contact updated', data: updateContact });

    }catch(err){
      res.status(500).json({ message: 'Failed to Update contact', err });
    }
  }
)

router.delete('/:id',authorizeRole('admin') , async (req:any, res:any) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);
    if (!deletedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json({ message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete contact', error });
  }
});


export default router;
