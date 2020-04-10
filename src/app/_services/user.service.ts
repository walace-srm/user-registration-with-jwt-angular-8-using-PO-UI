import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../_models';

//import { User } from '@/_models';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`https://shielded-tor-52520.herokuapp.com/users`);
    }

    register(user: User) {
        return this.http.post(`https://shielded-tor-52520.herokuapp.com/users/register`, user);
    }

    delete(id: number) {
        return this.http.delete(`https://shielded-tor-52520.herokuapp.com/users/${id}`);
    }
}