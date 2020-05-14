import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SearchCepService {

  constructor(private http: HttpClient) { }

  getCep(cep: string) {
    cep = cep.replace(/\D/g, '');
    if (cep != "") {
      var validadeCep = /^[0-9]{8}$/;
      if (validadeCep.test(cep)) {
        return this.http.get(`https://viacep.com.br/ws/${cep}/json`);
      }
    }

  }
}
