import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  user: any = {};  // Almacenará los datos del usuario
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    // Obtener el ID del usuario desde el localStorage
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.getUserData(userId);  // Llamamos a la función para obtener los datos
    } else {
      this.errorMessage = 'No se ha encontrado el ID del usuario';
    }
  }

  // Función para obtener los datos del usuario
  getUserData(userId: string): void {
    this.http.get(`http://localhost:3000/api/usuarios/${userId}`).subscribe(
      (response: any) => {
        this.user = response;  // Asignamos los datos del usuario a la variable
      },
      (error) => {
        console.error('Error al obtener los datos del usuario:', error);
        this.errorMessage = 'No se pudo cargar la información del usuario';
      }
    );
  }
  editProfile(){
    
  }
}
