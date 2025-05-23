import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketServiceService {

  private socket: Socket;
  lockedContacts$ = new BehaviorSubject<Map<string, string>>(new Map());

  constructor() {
    this.socket = io('http://localhost:5000');

    this.socket.on('contactLocked', ({ contactId, userId }) => {
      const map = this.lockedContacts$.value;
      map.set(contactId, userId);
      this.lockedContacts$.next(new Map(map));
    });

    this.socket.on('contactUnlocked', ({ contactId }) => {
      const map = this.lockedContacts$.value;
      map.delete(contactId);
      this.lockedContacts$.next(new Map(map));
    });

    this.socket.on('lockFailed', ({ contactId }) => {
      alert(`Contact ${contactId} is already locked by another user.`);
    });
  }

  lockContact(contactId: string, userId: string) {
    this.socket.emit('lockContact', { contactId, userId });
  }

  unlockContact(contactId: string, userId: string) {
    this.socket.emit('unlockContact', { contactId, userId });
  }
}
