import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsService } from '../../services/contacts.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-contacts',
  imports: [CommonModule,RouterModule,FormsModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css'
})
export class ContactsComponent {

   private contactService = inject(ContactsService);

  contacts: any[] = [];
  currentPage = 1;
  totalPages = 1;
  search = '';

  ngOnInit() {
    this.fetchContacts();
  }

  fetchContacts() {
    this.contactService.getContacts(this.currentPage, this.search).subscribe({
      next: (res: any) => {
        this.contacts = res.data;
        this.totalPages = res.totalPages;
      },
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchContacts();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchContacts();
    }
  }

  onSearch() {
    this.currentPage = 1;
    this.fetchContacts();
  }

    onSave(contact: any): void {
    const updatedData = {
      name: contact.name,
      phone: contact.phone,
      address: contact.address,
      notes: contact.notes || ''
    };
  this.contactService.updateContact(contact._id, updatedData).subscribe({
      next: (res) => {
        console.log('Update success:', res);
        // You can show a toast or refresh the grid
      },
      error: (err) => {
        console.error('Update failed:', err);
        // Show an error message
      }
    });
  }
}
