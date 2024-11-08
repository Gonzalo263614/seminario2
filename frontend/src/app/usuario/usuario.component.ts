import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  selectedOption: string = '';
  bancos: any[] = []; // Lista de bancos con todos los datos
  anios: string[] = []; // Años disponibles para el banco seleccionado
  interes: number = 0; // Interés seleccionado
  enganche: number = 0; // Enganche seleccionado
  bancoSeleccionado: string = ''; // Banco seleccionado

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerBancos();
  }

  // Obtener bancos completos desde la API
  obtenerBancos() {
    this.http.get<any[]>('http://localhost:3000/api/bancos').subscribe(
      (response) => {
        this.bancos = response;
      },
      (error) => {
        console.error('Error al obtener los bancos:', error);
      }
    );
  }

  // Banco seleccionado
  onBancoSeleccionado(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.bancoSeleccionado = select.value;

    // Obtener los años disponibles para el banco seleccionado
    this.http.get<string[]>(`http://localhost:3000/api/bancos/anios/${this.bancoSeleccionado}`).subscribe(
      (response) => {
        this.anios = response;
      },
      (error) => {
        console.error('Error al obtener los años del banco:', error);
      }
    );

    // Asigna interes y enganche del banco seleccionado
    const banco = this.bancos.find(b => b.nombre === this.bancoSeleccionado);
    if (banco) {
      this.interes = banco.interes;
      this.enganche = banco.enganche;
    }
  }

  // Año seleccionado
  onAnioSeleccionado(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const anioSeleccionado = select.value;

    // No es necesario volver a buscar el banco, ya que el interés y enganche
    // no dependen del año según este diseño de datos
  }

  onOptionChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedOption = target.value;
  }
}




