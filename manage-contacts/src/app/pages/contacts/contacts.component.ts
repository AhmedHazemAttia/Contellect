import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsService } from '../../services/contacts.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WebSocketServiceService } from '../../services/web-socket-service.service';
import { Subscription } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-contacts',
  imports: [CommonModule,RouterModule,FormsModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css'
})
export class ContactsComponent {

  private contactService = inject(ContactsService);
  private wsService = inject(WebSocketServiceService);
  private authService = inject(AuthService);
  private router = inject(Router)
  contacts: any[] = [];
  currentPage = 1;
  totalPages = 1;
  search = '';

  currentUser = {
    id: 'user123',
    role: 'user' 
  };

  editingContactId: string | null = null;
  lockedContacts = new Map<string, string>();
  wsSubscription?: Subscription;

  ngOnInit() {
    this.loadCurrentUser()
    this.fetchContacts();

    this.wsSubscription = this.wsService.lockedContacts$.subscribe(locks => {
      this.lockedContacts = locks;
      if (this.editingContactId && this.lockedContacts.get(this.editingContactId) !== this.currentUser.id) {
        this.editingContactId = null;
        alert('This contact was locked by another user. Editing canceled.');
      }
    });
  }

  ngOnDestroy() {
    this.wsSubscription?.unsubscribe();
  }

   loadCurrentUser() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
      const decoded: any = jwtDecode(token);
        this.currentUser.id = decoded.username;
        this.currentUser.role = decoded.role;
      } catch (err) {
        console.error('Invalid token');
      }
    }
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

  canEdit(contactId: string): boolean {
    if (this.currentUser.role !== 'admin') return false;
    const lockedBy = this.lockedContacts.get(contactId);
    return !lockedBy || lockedBy === this.currentUser.id;
  }

  startEditing(contactId: string) {
    if (!this.canEdit(contactId)) {
      alert('Contact is locked by another user or you do not have permission.');
      return;
    }
    this.editingContactId = contactId;
    this.wsService.lockContact(contactId, this.currentUser.id);
  }

  cancelEditing(contactId: string) {
    this.wsService.unlockContact(contactId, this.currentUser.id);
    this.editingContactId = null;
  }

  onSave(contact: any): void {
    if (this.editingContactId !== contact._id) return;

    const updatedData = {
      name: contact.name,
      phone: contact.phone,
      address: contact.address,
      notes: contact.notes || ''
    };

    this.contactService.updateContact(contact._id, updatedData).subscribe({
      next: (res) => {
        console.log('Update success:', res);
        this.wsService.unlockContact(contact._id, this.currentUser.id);
        this.editingContactId = null;
        this.fetchContacts();
      },
      error: (err) => {
        console.error('Update failed:', err);
        alert('Failed to update contact.');
      }
    });
  }

  logout(){
    this.authService.logout()
    this.router.navigate(['/login'])
  }

  add(){
    this.router.navigate(['/add-contact'])
  }
}
