import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ContactsService {

 private baseUrl = 'http://localhost:5000/api/contacts';

  constructor(private http: HttpClient) {}

  getContacts(page: number = 1, search: string = ''): Observable<any> {
    let params = new HttpParams().set('page', page.toString());
    if (search.trim()) {
      params = params.set('search', search);
    }
    return this.http.get(this.baseUrl + '/get', { params });
  }

  addContact(contact: any): Observable<any> {
    return this.http.post(this.baseUrl, contact);
  }

  updateContact(id: string, contact: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/edit/${id}`, contact);
  }

  deleteContact(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
