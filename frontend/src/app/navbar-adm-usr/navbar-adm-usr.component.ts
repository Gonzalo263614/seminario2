import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar-adm-usr',
  templateUrl: './navbar-adm-usr.component.html',
  styleUrls: ['./navbar-adm-usr.component.css']
})
export class NavbarAdmUsrComponent implements OnInit {
  userRole: string | null = null;

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userRole = user ? user.rol : null;
  }
}
