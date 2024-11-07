import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarAdmUsrComponent } from './navbar-adm-usr.component';

describe('NavbarAdmUsrComponent', () => {
  let component: NavbarAdmUsrComponent;
  let fixture: ComponentFixture<NavbarAdmUsrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarAdmUsrComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarAdmUsrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
