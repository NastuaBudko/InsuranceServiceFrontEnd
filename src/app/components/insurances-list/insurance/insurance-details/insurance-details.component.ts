import { Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { InsurancesService } from '../../../../services/insurances.service';
import { IInsuranceForServer } from '../../../../models/insurance.model';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { AuthService } from '../../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorSnackBarComponent } from '../../../error-snack-bar/error-snack-bar.component';

@Component({
  selector: 'app-insurance-details',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, RouterLink],
  templateUrl: './insurance-details.component.html',
  styleUrl: './insurance-details.component.css'
})
export class InsuranceDetailsComponent implements OnInit {
  private insuranceService = inject(InsurancesService);
  private destroyRef = inject(DestroyRef)
  private authService = inject(AuthService)
  private router = inject(Router);
  private _snackBar = inject(MatSnackBar)

  insuranceId = input.required<string>();

  insurance = signal<IInsuranceForServer | null>(null)

  ngOnInit() {
    if (!this.authService.AuthToken) {
      this.router.navigate(['']);
    }
    if (this.insuranceId()) {
      const subscription = this.insuranceService.getInsurance(this.insuranceId()).subscribe({
        next: (insuranceData) => this.insurance.set(insuranceData),
        error: (error: Error) => {
          this.router.navigate(['']);
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

  get insuranceRate(): number {
    return this.insurance()?.tariffRate && this.insurance()?.insuranceSum
      ? this.insurance()!.tariffRate * this.insurance()!.insuranceSum
      : 0;
  }

  get IconPath(): string {
    switch (this.insurance()?.insuranceType.type) {
      case 'vehicle':
        return 'vehicle-icon.png';
      case 'medical':
        return 'medicine-icon.png';
      case 'house':
        return 'house-icon.png';
      default:
        return '';
    }
  }
}
