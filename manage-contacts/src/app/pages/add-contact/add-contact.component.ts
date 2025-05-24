import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ContactsService } from '../../services/contacts.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-contact.component.html',
  styleUrl: './add-contact.component.css'
})
export class AddContactComponent {
  constructor(private router: Router) {}

  private authService = inject(AuthService);
  private contactService = inject(ContactsService);

  contact = {
    name: '',
    phone: '',
    address: '',
    notes: ''
  };

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToContacts(){
    this.router.navigate(['/contacts'])
  }

  onSubmit() {
    this.contactService.addContact(this.contact).subscribe({
      next: (res) => {
        alert('Contact added successfully');
        this.contact = { name: '', phone: '', address: '', notes: '' }; 
      },
      error: (err) => {
        console.error('Failed to add contact:', err);
        alert('Failed to add contact');
      }
    });
  }
}
