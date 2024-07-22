import { Component, DestroyRef, inject, OnInit, output, signal } from '@angular/core';
import { InsurancesService } from '../../services/insurances.service';
import { InsuranceComponent } from "./insurance/insurance.component";
import { NewInsuranceComponent } from './new-insurance/new-insurance.component';
import { IInsuranceForServer } from '../../models/insurance.model';
import { ErrorSnackBarComponent } from '../error-snack-bar/error-snack-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-insurances-list',
  standalone: true,
  imports: [InsuranceComponent, NewInsuranceComponent],
  templateUrl: './insurances-list.component.html',
  styleUrl: './insurances-list.component.css'
})
export class InsurancesListComponent implements OnInit {
  private insurancesService = inject(InsurancesService)
  private destroyRef = inject(DestroyRef)
  private _snackBar = inject(MatSnackBar)

  insurances = signal<IInsuranceForServer[]>([])
  isAddingInsurance = signal(false)
  isLoading = signal(true)

  onAddInsurance() {
    this.isAddingInsurance.set(true);
  }

  onRemove() {
    this.loadInsurances()
  }

  onCloseCreatingInsurance() {
    this.isAddingInsurance.set(false);
    this.loadInsurances();
  }

  loadInsurances() {
    const subscription = this.insurancesService.loadInsurances().subscribe({
      next: (insurances) => {
        this.insurances.set(insurances.reverse()), 
        this.isLoading.set(false)},
      error: (error: Error) => {
        this._snackBar.openFromComponent(ErrorSnackBarComponent, {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
          data: {textError: error.message}
        }),
        this.isLoading.set(false)
      },
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  ngOnInit() {
    this.loadInsurances()
  }



}
