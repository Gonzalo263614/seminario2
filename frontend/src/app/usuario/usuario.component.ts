import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  selectedOption: string = '';
  bancos: any[] = [];
  anios: string[] = [];
  interes: number = 0;
  enganche: number = 0;
  bancoSeleccionado: string = '';
  sueldo: number = 0;
  anioSeleccionado: number | null = null;
  resultadoPrestamo: number | null = null;
  engancheCalculado: number | null = null;
  mensualidad: number | null = null;  // Nueva variable para almacenar la mensualidad

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerBancos();
  }

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

  onBancoSeleccionado(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.bancoSeleccionado = select.value;

    this.http.get<string[]>(`http://localhost:3000/api/bancos/anios/${this.bancoSeleccionado}`).subscribe(
      (response) => {
        this.anios = response;
      },
      (error) => {
        console.error('Error al obtener los años del banco:', error);
      }
    );

    const banco = this.bancos.find(b => b.nombre === this.bancoSeleccionado);
    if (banco) {
      this.interes = banco.interes;
      this.enganche = banco.enganche;
    }
  }

  calcularPrestamo(anios: number | null) {
    if (anios === null) return;

    const r = (this.interes / 100) / 12; // Tasa de interés mensual
    const n = anios * 12; // Número total de pagos
    const salarioPor40 = this.sueldo * 0.40;

    // Cálculo del préstamo máximo usando la fórmula
    this.resultadoPrestamo = (salarioPor40 * ((Math.pow((1 + r), n) - 1))) / (r * Math.pow((1 + r), n));

    // Cálculo del enganche como porcentaje del monto del préstamo
    if (this.resultadoPrestamo !== null) {
      this.engancheCalculado = this.resultadoPrestamo * (this.enganche / 100);

      // Cálculo de la mensualidad
      this.mensualidad = this.resultadoPrestamo * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }
  }

  onOptionChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedOption = target.value;
  }
}





