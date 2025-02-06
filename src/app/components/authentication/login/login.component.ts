import { Component, Inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DIALOG_DATA, DialogRef, DialogModule } from '@angular/cdk/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DialogModule],
  templateUrl: './login.component.html',
})
export class LoginPageComponent implements AfterViewInit {
  @ViewChild('phoneInput') phoneInput!: ElementRef;
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: DialogRef,
    private authService: AuthService,
    private toast: ToastService,
    private store: Store,
    @Inject(DIALOG_DATA) public data: { changePage: (page: number) => void }
  ) {
    this.loginForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    });
  }

  ngAfterViewInit() {
    // Prevent auto-focus
    setTimeout(() => {
      if (this.phoneInput?.nativeElement) {
        this.phoneInput.nativeElement.blur();
      }
    }, 0);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const phone = this.loginForm.get('phone')?.value;
      
      this.authService.login('+91', phone).subscribe({
        next: (response) => {
          if (response.code === 200) {
            this.toast.success('OTP sent to your mobile number');
            this.data.changePage(1);
          } else {
            this.toast.error(response.message || 'Something went wrong');
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          this.toast.error(error.error?.message || 'Failed to send OTP', 'Error', 5000);
        }
      });
    } else {
      this.toast.error('Please enter a valid phone number');
    }
  }
} 