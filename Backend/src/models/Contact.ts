import mongoose, { Document, Schema } from 'mongoose';

interface IContact extends Document {
  phone: string;
  number: string;
  address: string;
  notes?: string; 
}

const ContactSchema: Schema = new Schema({
  phone: { type: String, required: true },
  number: { type: String, required: true },
  address: { type: String, required: true },
  notes: { type: String, required: false }
});

const Contact = mongoose.model<IContact>('Contact', ContactSchema, 'contacts-data');

export default Contact;
