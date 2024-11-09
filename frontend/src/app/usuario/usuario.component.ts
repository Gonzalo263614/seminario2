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
  montoapagar: number | null = null;  // Nueva variable para almacenar la mensualidad
  prestamosUsuario: any[] = []; // Cotizaciones del usuario actual
  mostrarPrestamos: boolean = false; // Control para mostrar/ocultar cotizaciones
  constructor(private http: HttpClient) { }

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
    console.log('Banco seleccionado:', this.bancoSeleccionado);  // Agrega esta línea para verificar el valor seleccionado
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
      this.montoapagar = this.mensualidad * n;
    }
  }
  calcularPrestamoCasa(anios: number | null) {
    if (anios === null) return;

    const costoCasaInput = document.getElementById('costocasa') as HTMLInputElement;
    const costoCasa = parseFloat(costoCasaInput.value);

    if (isNaN(costoCasa)) {
      console.error("El costo de la casa es inválido");
      return;
    }

    const r = (this.interes / 100) / 12; // Tasa de interés mensual
    const n = anios * 12; // Número total de pagos

    // Cálculo del préstamo máximo con la fórmula PMT
    this.resultadoPrestamo = costoCasa * (1 - (this.enganche / 100));
    this.engancheCalculado = costoCasa * (this.enganche / 100);

    // Cálculo de la mensualidad usando la fórmula de la imagen
    this.mensualidad = this.resultadoPrestamo * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    this.montoapagar = this.mensualidad * n;
  }

  onOptionChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedOption = target.value;
  }
  guardarPrestamoCasa() {
    // Obtén el ID del usuario desde localStorage
    const idUsuario = JSON.parse(localStorage.getItem('userId') || 'null');

    if (!idUsuario) {
      console.error("Usuario no encontrado en localStorage");
      return;
    }

    // Usa el nombre del banco en lugar del ID del banco
    const bancoSeleccionado = this.bancos.find(b => b.nombre === this.bancoSeleccionado);
    const nombreBanco = bancoSeleccionado?.nombre;
    console.log(nombreBanco);
    if (!nombreBanco) {
      console.error("Banco no seleccionado correctamente");
      return;
    }

    // Define el objeto del préstamo con los datos necesarios
    const prestamoData = {
      id_usuario: idUsuario,  // Usamos el id del usuario desde localStorage
      nombre_banco: nombreBanco,  // Usamos el nombre del banco seleccionado
      costo_casa: this.selectedOption === '2' ? parseFloat((document.getElementById('costocasa') as HTMLInputElement).value) : 0,
      enganche: this.engancheCalculado,
      monto_prestamo: this.resultadoPrestamo,
      mensualidad: this.mensualidad,
      interes: this.interes,
      plazo_anios: this.anioSeleccionado,
      fecha_creacion: new Date().toISOString().split('T')[0]  // Solo la fecha de creación
    };

    // Llama al backend para guardar el préstamo
    this.http.post('http://localhost:3000/api/prestamos', prestamoData).subscribe(
      (response) => {
        console.log('Préstamo guardado con éxito:', response);
        alert('Préstamo guardado con éxito.');
      },
      (error) => {
        console.error('Error al guardar el préstamo:', error);
        alert('Error al guardar el préstamo.');
      }
    );
  }

  guardarPrestamoSueldo() {
    // Obtén el ID del usuario desde localStorage
    const idUsuario = JSON.parse(localStorage.getItem('userId') || 'null');

    if (!idUsuario) {
      console.error("Usuario no encontrado en localStorage");
      return;
    }

    // Usa el nombre del banco en lugar del ID del banco
    const bancoSeleccionado = this.bancos.find(b => b.nombre === this.bancoSeleccionado);
    const nombreBanco = bancoSeleccionado?.nombre;
    console.log(nombreBanco);
    if (!nombreBanco) {
      console.error("Banco no seleccionado correctamente");
      return;
    }

    // Define el objeto del préstamo con los datos necesarios
    const prestamoData = {
      id_usuario: idUsuario,  // Usamos el id del usuario desde localStorage
      nombre_banco: nombreBanco,  // Usamos el nombre del banco seleccionado
      costo_casa: this.selectedOption === '1' ? parseFloat((document.getElementById('suelInp') as HTMLInputElement).value) : 0,
      enganche: this.engancheCalculado,
      monto_prestamo: this.resultadoPrestamo,
      mensualidad: this.mensualidad,
      interes: this.interes,
      plazo_anios: this.anioSeleccionado,
      fecha_creacion: new Date().toISOString().split('T')[0]  // Solo la fecha de creación
    };

    // Llama al backend para guardar el préstamo
    this.http.post('http://localhost:3000/api/prestamos', prestamoData).subscribe(
      (response) => {
        console.log('Préstamo guardado con éxito:', response);
        alert('Préstamo guardado con éxito.');
      },
      (error) => {
        console.error('Error al guardar el préstamo:', error);
        alert('Error al guardar el préstamo.');
      }
    );
  }
  // Método para alternar la visibilidad de las cotizaciones
  togglePrestamosUsuario() {
    this.mostrarPrestamos = !this.mostrarPrestamos;
    if (this.mostrarPrestamos) {
      this.obtenerCotizacionesUsuario();
    }
  }

  // Método para obtener las cotizaciones del usuario actual
  obtenerCotizacionesUsuario() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('Usuario no encontrado en localStorage');
      return;
    }

    this.http.get<any[]>(`http://localhost:3000/api/prestamos/usuario/${userId}`).subscribe(
      (response) => {
        this.prestamosUsuario = response;
      },
      (error) => {
        console.error('Error al obtener las cotizaciones:', error);
      }
    );
  }

}





