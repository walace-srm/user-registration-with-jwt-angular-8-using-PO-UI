import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../_models';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

//import { User } from '@/_models';

@Injectable({ providedIn: 'root' })
export class UserService {
    baseUrl = `https://shielded-tor-52520.herokuapp.com/users`

    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`${this.baseUrl}`);
    }

    getById(id: string): Observable<User> {
        const url = `${this.baseUrl}/${id}`
        return this.http.get<User>(url).pipe(take(1));
    }

    register(user: User) {
        return this.http.post(`${this.baseUrl}/register`, user);
    }

    delete(id: number) {
        return this.http.delete(`${this.baseUrl}/${id}`);
    }
}