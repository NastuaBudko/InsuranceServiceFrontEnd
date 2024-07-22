import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ErrorSnackBarComponent } from '../error-snack-bar/error-snack-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent implements OnInit {
  private authService = inject(AuthService)
  private router = inject(Router)
  private _snackBar = inject(MatSnackBar)
  private destroyRef = inject(DestroyRef)

  form = new FormGroup({
    email: new FormControl('',
      { validators: [Validators.required, Validators.email] }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(5)]
    }),
  })

  ngOnInit() {
    if (this.authService.AuthToken) {
      this.router.navigate(['']);
    }
  }

  get formIsInvalid() {
    return (
      this.form.invalid &&
      this.form.touched &&
      this.form.dirty
    )
  }

  onSubmitted() {
    const { email, password } = this.form.value;

    if (email && password) {
      const subscription = this.authService.login({ email, password }).subscribe({
        next: () => {
          this.router.navigate(['/profile']);
        },
        error: (error: Error) => {
          console.log(error)
          this._snackBar.openFromComponent(ErrorSnackBarComponent, {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            data: {textError: error.message}
          })
        },
      })
      this.destroyRef.onDestroy(() => subscription.unsubscribe());
    }


  }
}
