import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { IUser } from '../../models/user.model';
import { Router } from '@angular/router';
import { ErrorSnackBarComponent } from '../error-snack-bar/error-snack-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CurrencyPipe } from '@angular/common';
import { CapitalizePipe } from '../../capitalize.pipe';

@Component({
  selector: 'app-personal-account',
  standalone: true,
  imports: [CapitalizePipe, CurrencyPipe],
  templateUrl: './personal-account.component.html',
  styleUrl: './personal-account.component.css'
})
export class PersonalAccountComponent implements OnInit {
  private authService = inject(AuthService)
  private router = inject(Router)
  private _snackBar = inject(MatSnackBar)
  private destroyRef = inject(DestroyRef)

  user = signal<IUser | null>(null)

  ngOnInit() {
    if (!this.authService.AuthToken) {
      this.router.navigate(['']);
    }
    const subscription = this.authService.getMe().subscribe({
      next: (user) => this.user.set(user),
      error: (error: Error) => {
        this.router.navigate(['']);
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
