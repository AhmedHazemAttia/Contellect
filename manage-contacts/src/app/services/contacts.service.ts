import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ContactsService {

 private baseUrl = 'http://localhost:5000/api/contacts';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  getContacts(page: number = 1, search: string = ''): Observable<any> {
    let params = new HttpParams().set('page', page.toString());
    if (search.trim()) {
      params = params.set('search', search);
    }
    return this.http.get(this.baseUrl + '/get', { params });
  }

  addContact(contact: any): Observable<any> {
    return this.http.post(this.baseUrl, contact, this.getAuthHeaders());
  }

  updateContact(id: string, contact: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/edit/${id}`, contact, this.getAuthHeaders());
  }

  deleteContact(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
