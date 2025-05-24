import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ContactsComponent } from './pages/contacts/contacts.component';
import { AddContactComponent } from './pages/add-contact/add-contact.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {path: 'contacts', component: ContactsComponent},
  {path: 'add-contact', component: AddContactComponent}
];
