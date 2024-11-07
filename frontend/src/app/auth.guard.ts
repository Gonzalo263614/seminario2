import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Verificar si el usuario está autenticado
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Validar si el usuario tiene el rol necesario para acceder a la ruta
    const expectedRole = route.data['role'];
    if (user && user.rol === expectedRole) {
      return true;
    }

    // Si el usuario no tiene permiso, redirigirlo a la página de inicio de sesión
    this.router.navigate(['/login']);
    return false;
  }
}
