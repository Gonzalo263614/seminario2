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
        // Definir el tipo de los bancos
        interface Banco {
          id: number;
          nombre: string;
          interes: number;
          anios: number;
          enganche: number;
          editando?: boolean;
        }

        // Filtramos los bancos para que solo se muestren los primeros con cada nombre único
        const bancosUnicos: Banco[] = [];  // Declaramos el tipo explícitamente

        data.forEach((banco) => {
          if (!bancosUnicos.some((b) => b.nombre === banco.nombre)) {
            bancosUnicos.push(banco);
          }
        });

        this.bancos = bancosUnicos; // Asignamos los bancos únicos
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
    // No se modifica el campo de años en el backend, ya que es fijo
    this.http.put(`http://localhost:3000/api/bancos/${banco.id}`, {
      interes: banco.interes,
      enganche: banco.enganche,
      nombre: banco.nombre  // Enviamos solo los campos que queremos actualizar
    }).subscribe(
      () => {
        // Actualizamos todos los bancos con el mismo nombre en el frontend
        this.bancos.forEach((b) => {
          if (b.nombre === banco.nombre) {
            b.interes = banco.interes;
            b.enganche = banco.enganche;
            // No actualizamos el campo "anios" aquí
          }
        });

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
  eliminarUsuario(id: number) {
    // Confirmar la eliminación
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar este usuario?');
    
    if (confirmacion) {
      // Hacer la solicitud HTTP para eliminar el usuario
      this.http.delete(`http://localhost:3000/api/usuarios/${id}`).subscribe(
        () => {
          // Eliminar el usuario de la lista en el frontend
          this.usuarios = this.usuarios.filter(usuario => usuario.id !== id);
          alert('Usuario eliminado con éxito.');
        },
        (error) => {
          console.error('Error al eliminar el usuario:', error);
          alert('Hubo un error al eliminar el usuario.');
        }
      );
    }
  }
}

