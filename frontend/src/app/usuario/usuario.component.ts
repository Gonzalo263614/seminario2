import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  selectedOption: string = '';
  bancos: any[] = []; // Lista completa de bancos obtenidos de la BD (con todos sus datos)
  anios: string[] = []; // Años disponibles para el banco seleccionado
  interes: number = 0; // Interés seleccionado
  enganche: number = 0; // Enganche seleccionado
  bancoSeleccionado: string = ''; // Banco seleccionado

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerBancos();
  }

  // Obtener los bancos completos desde la API (con todos sus datos)
  obtenerBancos() {
    this.http.get<any[]>('http://localhost:3000/api/bancos').subscribe(
      (response) => {
        this.bancos = response; // Lista completa de bancos
      },
      (error) => {
        console.error('Error al obtener los bancos:', error);
      }
    );
  }

  // Evento cuando un banco es seleccionado
  onBancoSeleccionado(event: Event): void {
    const select = event.target as HTMLSelectElement; // Aseguramos que es un select
    this.bancoSeleccionado = select.value;

    // Obtener los años disponibles para el banco seleccionado
    this.http.get<string[]>(`http://localhost:3000/api/bancos/anios/${this.bancoSeleccionado}`).subscribe(
      (response) => {
        this.anios = response; // Actualiza los años disponibles
      },
      (error) => {
        console.error('Error al obtener los años del banco:', error);
      }
    );

    // Buscar el banco completo en el array de bancos
    const banco = this.bancos.find(b => b.nombre === this.bancoSeleccionado);
    if (banco) {
      // Asignar los valores de interés y enganche del banco seleccionado
      this.interes = banco.interes;
      this.enganche = banco.enganche;
    }
  }

  // Evento cuando se selecciona un año
  onAnioSeleccionado(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const anioSeleccionado = select.value;

    // Buscar el banco completo en el array de bancos y el año seleccionado
    const banco = this.bancos.find(b => b.nombre === this.bancoSeleccionado && b.anios === anioSeleccionado);
    if (banco) {
      // Asignar los valores de interés y enganche del banco y año seleccionados
      this.interes = banco.interes;
      this.enganche = banco.enganche;
    }
  }
  onOptionChange(event: Event) {
    const target = event.target as HTMLSelectElement; // Conversión de tipo
    this.selectedOption = target.value;
  }
}



