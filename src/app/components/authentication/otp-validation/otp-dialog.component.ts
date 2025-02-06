import { Component, Inject, OnDestroy, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DIALOG_DATA, DialogRef, DialogModule } from '@angular/cdk/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';
import { Store } from '@ngrx/store';
import { authFeature } from '../../../store/slices/auth.slice';
import { AuthService } from '../../../services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-otp-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DialogModule],
  templateUrl: './otp-dialog.component.html',
  animations: [
   
    trigger('backdropAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class OtpDialogComponent implements OnDestroy, OnInit {
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;
  
  otpForm: FormGroup;
  private destroy$ = new Subject<void>();
  phone: string = '';
  countryCode: string = '';
  timer: number = 30;
  resendAvailable: boolean = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: DialogRef,
    @Inject(DIALOG_DATA) public data: { changePage: (page: number) => void },
    private authService: AuthService,
    private toast: ToastService,
    private store: Store
  ) {
    this.store.select(authFeature.selectAuthState)
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        if (state) {
          this.phone = state.phone;
          this.countryCode = state.countryCode;
        }
      });

    this.otpForm = this.fb.group({
      digit0: ['', [Validators.required, Validators.pattern('^[0-9]$')]],
      digit1: ['', [Validators.required, Validators.pattern('^[0-9]$')]],
      digit2: ['', [Validators.required, Validators.pattern('^[0-9]$')]],
      digit3: ['', [Validators.required, Validators.pattern('^[0-9]$')]],
      digit4: ['', [Validators.required, Validators.pattern('^[0-9]$')]],
      digit5: ['', [Validators.required, Validators.pattern('^[0-9]$')]]
    });
  }

  ngOnInit() {
    this.startTimer();
  }

  startTimer() {
    const interval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        this.resendAvailable = true;
        clearInterval(interval);
      }
    }, 1000);
  }

  onOtpInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Remove any non-numeric characters
    value = value.replace(/[^0-9]/g, '');
    
    // Update the input with cleaned value
    input.value = value;
    this.otpForm.get(`digit${index}`)?.setValue(value);

    // Move to next input if value exists
    if (value && index < 5) {
      const inputsArray = this.otpInputs.toArray();
      if (inputsArray[index + 1]) {
        inputsArray[index + 1].nativeElement.focus();
      }
    }

    // If pasting multiple numbers
    if (value.length > 1) {
      const values = value.split('');
      for (let i = 0; i < values.length && index + i < 6; i++) {
        this.otpForm.get(`digit${index + i}`)?.setValue(values[i]);
      }
      // Focus the next empty input or the last input
      const inputsArray = this.otpInputs.toArray();
      for (let i = index; i < 6; i++) {
        if (!this.otpForm.get(`digit${i}`)?.value && inputsArray[i]) {
          inputsArray[i].nativeElement.focus();
          break;
        }
      }
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace' && index > 0 && !this.otpForm.get(`digit${index}`)?.value) {
      const inputsArray = this.otpInputs.toArray();
      if (inputsArray[index - 1]) {
        inputsArray[index - 1].nativeElement.focus();
      }
    }
  }

  resendOtp() {
    if (this.phone && this.countryCode) {
      this.authService.login(this.countryCode, this.phone).subscribe({
        next: (response) => {
          if (response.code === 200) {
            this.toast.success('OTP sent to your mobile number');
            this.timer = 30;
            this.resendAvailable = false;
            this.startTimer();
          } else {
            this.toast.error(response.message || 'Failed to resend OTP');
          }
        },
        error: (error) => {
          this.toast.error(error.error?.message || 'Failed to resend OTP', 'Error', 5000);
        }
      });
    } else {
      this.toast.error('Unable to resend OTP');
    }
  }

  onSubmit() {
    if (this.otpForm.valid && this.phone && this.countryCode) {
      const otp = Object.values(this.otpForm.value).join('');
      
      this.authService.verifyOtp(this.countryCode, this.phone, otp).subscribe({
        next: (response) => {
          if (response.code === 201) {
            this.toast.success('Successfully logged in');
            this.dialogRef.close();
          }
        },
        error: (error) => {
          this.toast.error('OTP you entered is invalid. Kindly try again or resend it.', 'Error', 5000);
          // Reset OTP form
          Object.keys(this.otpForm.controls).forEach(key => {
            this.otpForm.get(key)?.setValue('');
          });
        }
      });
    } else {
      this.toast.error('Please enter a valid OTP');
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
} 