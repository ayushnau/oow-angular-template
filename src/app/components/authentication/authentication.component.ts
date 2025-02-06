import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { IoMdAddComponent } from '../../icons/io-md-add.component';
import { LoginPageComponent } from './login/login.component';
import { OtpDialogComponent } from './otp-validation/otp-dialog.component';
import { SuccessPageComponent } from './success-page/success-page.component';
import { ComponentType } from '@angular/cdk/overlay';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [CommonModule, DialogModule, IoMdAddComponent],
  template: `
    @if (isHeader) {
      <button
        (click)="openDialog()"
        class="h-10 hover:text-white hover:bg-[var(--temp-back)] border-[var(--temp-back)] text-[var(--temp-back)] w-16 font-[600] border-2 rounded-lg"
      >
        Login
      </button>
    } @else {
      <i-io-md-add
        class="text-[var(--temp-back)] hover:text-white bg-white hover:bg-[var(--temp-back)] border border-[var(--temp-back)] p-1 rounded-full cursor-pointer"
        [size]="25"
        (click)="openDialog()"
      />
    }
  `
})
export class AuthenticationComponent {
  @Input() isHeader: boolean = false;
  currentPage = 0;

  constructor(private dialog: Dialog) {}

  openDialog() {
    this.currentPage = 0;
    const dialogRef = this.dialog.open(LoginPageComponent, {
      width: '425px',
      data: { changePage: (page: number) => this.changePage(page) }
    });

    dialogRef.closed.subscribe(() => {
      this.currentPage = 0;
    });
  }

  private changePage(page: number) {
    this.currentPage = page;
    this.dialog.closeAll();

    let component;
    switch (page) {
      case 1:
        component = OtpDialogComponent;
        break;
      case 2:
        component = SuccessPageComponent;
        break;
      default:
        component = LoginPageComponent;
    }

    if (component) {
      this.dialog.open(component as ComponentType<any>, {
        width: '425px',
        data: { changePage: (p: number) => this.changePage(p) }
      });
    }
  }
} 