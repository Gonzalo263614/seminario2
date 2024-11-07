import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido_paterno: ['', Validators.required],
      apellido_materno: [''],
      rfc: ['', [Validators.required, Validators.maxLength(13)]],
      curp: ['', [Validators.required, Validators.maxLength(18)]],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(0)]],
      telefono: ['', [Validators.required, Validators.maxLength(15)]],
      rol: ['', Validators.required]
    });
  }

  onRegister() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      this.http.post('http://localhost:3000/api/register', formData).subscribe(
        (response: any) => {
          console.log(response.message);
          alert('Usuario registrado exitosamente');
          
          // Limpiar el formulario después de un registro exitoso
          this.registerForm.reset();
        },
        (error) => {
          console.error('Error en el registro:', error);
          alert('Error en el registro');
        }
      );
    }
  }
}
