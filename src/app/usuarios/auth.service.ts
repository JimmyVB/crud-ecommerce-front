import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from './usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //Inyectamos el HttpClient en el constructor
  constructor(private http: HttpClient) { }

  login(usuario: Usuario): Observable<any>{
    const urlEndpoint = 'http://localhost:8080/oauth/token';
    
    const credenciales = btoa('angularapp' + ':' + '12345'); //Encriptar y convertir en base 64 = btoa
    
    const httpHeaders = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded',
  'Authorization' : 'Basic ' + credenciales});
    
    let params =  new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usuario.username);
    params.set('password', usuario.password);

    return this.http.post(urlEndpoint, params.toString(), {headers: httpHeaders});
  }
}
