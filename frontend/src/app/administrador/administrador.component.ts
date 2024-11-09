import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.component.html',
  styleUrls: ['./administrador.component.css']
})
export class AdministradorComponent implements OnInit {
  usuarios: any[] = [];
  bancos: any[] = [];

  errorMessage: string = '';
  errorMessageBancos: string = '';

  mostrarLista: boolean = false;
  mostrarBancos: boolean = false;

  prestamos: any[] = [];
  errorMessagePrestamos: string = '';
  mostrarPrestamos: boolean = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarBancos();
    this.cargarPrestamos();
  }

  cargarUsuarios() {
    this.http.get<any[]>('http://localhost:3000/api/usuarios').subscribe(
      (data) => {
        this.usuarios = data;
      },
      (error) => {
        this.errorMessage = 'Error al cargar los usuarios';
        console.error(error);
      }
    );
  }

  toggleLista() {
    this.mostrarLista = !this.mostrarLista;
  }
  cargarBancos() {
    this.http.get<any[]>('http://localhost:3000/api/bancosMostrar').subscribe(
      (data) => {
        this.bancos = data;
      },
      (error) => {
        this.errorMessageBancos = 'Error al cargar los bancos';
        console.error(error);
      }
    );
  }

  toggleBancos() {
    this.mostrarBancos = !this.mostrarBancos;
  }

  habilitarEdicion(banco: any) {
    banco.editando = true;
  }

  guardarCambios(banco: any) {
    this.http.put(`http://localhost:3000/api/bancos/${banco.id}`, {
      interes: banco.interes,
      anios: banco.anios,
      enganche: banco.enganche
    }).subscribe(
      () => {
        banco.editando = false;
        alert('Cambios guardados con éxito.');
      },
      (error) => {
        console.error('Error al guardar los cambios:', error);
        alert('Hubo un error al guardar los cambios.');
      }
    );
  }
  cargarPrestamos() {
    this.http.get<any[]>('http://localhost:3000/api/prestamos').subscribe(
      (data) => {
        this.prestamos = data;
      },
      (error) => {
        this.errorMessagePrestamos = 'Error al cargar los préstamos';
        console.error(error);
      }
    );
  }

  togglePrestamos() {
    this.mostrarPrestamos = !this.mostrarPrestamos;
  }
}

