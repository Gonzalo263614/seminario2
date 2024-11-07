import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { AdministradorComponent } from './administrador/administrador.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PerfilComponent } from './perfil/perfil.component';
import { AuthGuard } from './auth.guard'; // Importar el guard

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  {
    path: 'administrador',
    component: PerfilComponent, // Componente del perfil de administrador
    canActivate: [AuthGuard],
    data: { role: 'administrador' } // Rol requerido para esta ruta
  },
  {
    path: 'usuario',
    component: PerfilComponent, // Componente del perfil de usuario
    canActivate: [AuthGuard],
    data: { role: 'usuario' } // Rol requerido para esta ruta
  },
  { path: 'home', component: HomeComponent },
  { path: 'navbar', component: NavbarComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Cambiado de '/login' a '/home'
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
