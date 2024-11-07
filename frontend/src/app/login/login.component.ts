import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  rfc: string = '';
  contrasena: string = '';
  constructor(private http: HttpClient, private router: Router) { }

  login() {
    const loginData = { rfc: this.rfc, contrasena: this.contrasena };
    console.log('rfc', this.rfc, ", contra: ", this.contrasena);
  
    this.http.post('http://localhost:3000/api/login', loginData).subscribe(
      (response: any) => {
        console.log('Inicio de sesión exitoso', response);
  
        // Guardamos los datos del usuario en el localStorage
        localStorage.setItem('user', JSON.stringify(response.user)); // Guardamos los datos completos del usuario
        localStorage.setItem('userId', response.user.id); // Guardamos el id del usuario
  
        // Accedemos al rol del usuario directamente
        const userRole = response.user.rol;
  
        console.log('Rol recibido:', userRole);  // Verifica que el rol es correcto
  
        // Redirigir al usuario dependiendo del rol
        if (userRole === 'administrador') {
          this.router.navigate(['/administrador']);
        } else if (userRole === 'usuario') {
          this.router.navigate(['/usuario']);
        } else {
          alert('Rol no reconocido');
        }
      },
      (error) => {
        console.error('Error de inicio de sesión:', error);
        alert('RFC o contraseña incorrectos');
      }
    );
  }
  
  redirectToRegister() {
    this.router.navigate(['/registro']);
  }
}
