import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  //Inyectar el authService
  constructor(private authService: AuthService,
    private router: Router) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isAuthenticated()) {
      if(this.isTokenExpirado()){
        this.authService.logout();
        this.router.navigate(['/login'])
        return false;
      }
      return true;
    }
    this.router.navigate(['/login'])
    return false;
  }

  isTokenExpirado(): boolean{
    let token = this.authService.token;
    let payload = this.authService.obtenerDatosToken(token);
    let nowDate = new Date().getTime() / 1000;
    if(payload.exp < nowDate){ // exp = atributo de la fecha cuando experia el token
      return true;
    } 
    return false;
  }

}
