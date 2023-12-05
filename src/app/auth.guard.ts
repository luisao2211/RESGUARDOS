import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    const authToken =localStorage.getItem('token')
    if (authToken) {
      if (localStorage.getItem('role')=='1') {
        this.router.navigate(['/Usuarios']);
      }
      else{
        this.router.navigate(['/Administrativo']);
      }
      return true;
    } else {

      // Si el token no existe, redirige a la página de inicio de sesión o a otra página
      // this.router.navigate(['/autenticacion/iniciosesion']); // Cambia '/login' al enrutamiento que desees
      return true;
    }
  }
}
