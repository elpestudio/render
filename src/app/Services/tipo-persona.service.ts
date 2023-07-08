import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoPersonaService {

  // URL = 'http://localhost:9091/api/TipoPersona';
  URL = 'https://tutor-tm1i.onrender.com/api/TipoPersona';

  constructor(private http: HttpClient) { }

  getTipoPersona(){
    return this.http.get(this.URL);
  }

  setTipoPersona(parametros: any): Observable<any>{
    let header = new HttpHeaders({ 'Content-Type':'application/json; charset=utf-8' });
    const requestOptions = {  headers: header};

    return this.http.post(this.URL, parametros, requestOptions);
  }

  updateTipoPersona(parametros: any): Observable<any>{
    let header = new HttpHeaders({ 'Content-Type':'application/json; charset=utf-8' });
    const requestOptions = {  headers: header};

    return this.http.put(this.URL+'/'+parametros.id, parametros, requestOptions);
  }

  deleteTipoPersona(id: any): Observable<any>{
    let header = new HttpHeaders({ 'Content-Type':'application/json; charset=utf-8' });
    const requestOptions = {  headers: header};

    return this.http.delete(this.URL+'/'+id, requestOptions);
  }

}
