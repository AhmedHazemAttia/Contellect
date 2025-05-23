import mongoose, { Document, Schema } from 'mongoose';

interface IContact extends Document {
  name: string;
  phone: string;
  address: string;
  notes?: string; 
}

const ContactSchema: Schema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  notes: { type: String, required: false }
});

const Contact = mongoose.model<IContact>('Contact', ContactSchema, 'contacts-data');

export default Contact;
