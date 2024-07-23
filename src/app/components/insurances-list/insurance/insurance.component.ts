import { Component, DestroyRef, inject, input, output, signal } from '@angular/core';
import { InsurancesService } from '../../../services/insurances.service';
import { IInsuranceForServer } from '../../../models/insurance.model';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { InsuranceDetailsComponent } from './insurance-details/insurance-details.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorSnackBarComponent } from '../../error-snack-bar/error-snack-bar.component';

@Component({
  selector: 'app-insurance',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, InsuranceDetailsComponent, RouterLink],
  templateUrl: './insurance.component.html',
  styleUrl: './insurance.component.css'
})
export class InsuranceComponent {
  insurance = input.required<IInsuranceForServer>();
  insuranceRemoved = output();

  selectedInsuranceId = signal<string>('')

  private insuranceService = inject(InsurancesService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private _snackBar = inject(MatSnackBar)


  get IconPath(): string {
    switch (this.insurance().insuranceType.type) {
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

  onRemoveInsurance() {
    const subscription = this.insuranceService.removeInsurance(this.insurance()).subscribe({
      next: () => this.insuranceRemoved.emit(),
      error: (error: Error) => {
        this._snackBar.openFromComponent(ErrorSnackBarComponent, {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
          data: {textError: error.message}
        })
      },
    })

    this.destroyRef.onDestroy(() => subscription.unsubscribe())
  }
}
