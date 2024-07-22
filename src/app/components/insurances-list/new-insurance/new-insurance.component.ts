import { Component, DestroyRef, inject, OnInit, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InsurancesService } from '../../../services/insurances.service';
import { IBranch } from '../../../models/branch.model';
import { BranchesService } from '../../../services/branches.service';
import { InsuranceTypesService } from '../../../services/insurance-types.service';
import { IType } from '../../../models/insurance-type.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorSnackBarComponent } from '../../error-snack-bar/error-snack-bar.component';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-new-insurance',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './new-insurance.component.html',
  styleUrl: './new-insurance.component.css'
})
export class NewInsuranceComponent implements OnInit {
  close = output()

  branches = signal<IBranch[]>([])
  insuranceTypes = signal<IType[]>([])
  submitted = signal(false);

  private insuranceService = inject(InsurancesService)
  private branchesService = inject(BranchesService)
  private authService = inject(AuthService)
  private insuranceTypesService = inject(InsuranceTypesService)
  private destroyRef = inject(DestroyRef)
  private _snackBar = inject(MatSnackBar)

  form = new FormGroup({
    typeId: new FormControl('',
       { validators: [Validators.required] }),
    amount: new FormControl('', {
      validators: [Validators.required]
    }),
    rate: new FormControl('', {
      validators: [Validators.required]
    }),
    branchId: new FormControl('',
      { validators: [Validators.required] }),
    date: new FormControl('', {
      validators: [Validators.required]
    }),
  })

  ngOnInit() {
    this.loadBranches()
    this.loadInsuranceTypes()
    document.body.classList.add('no-scroll');
  }

  loadBranches() {
    const subscription = this.branchesService.getAllBranches().subscribe({
      next: (branchesData) => this.branches.set(branchesData),
      error: (error: HttpErrorResponse) => {
        this._snackBar.openFromComponent(ErrorSnackBarComponent, {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
          data: {textError: error.message}
        })
      }
    })
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  loadInsuranceTypes() {
    const subscription = this.insuranceTypesService.getAllTypes().subscribe({
      next: (insuranceTypesData) => this.insuranceTypes.set(insuranceTypesData),
      error: (error: HttpErrorResponse) => {
        this._snackBar.openFromComponent(ErrorSnackBarComponent, {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
          data: {textError: error.message}
        })
      }
    })
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  onCancel() {
    this.close.emit();
    document.body.classList.remove('no-scroll');
  }

  get formIsInvalid() {
    return this.form.invalid && this.submitted() && this.authService.AuthToken;
}

  onSubmitted() {
    this.submitted.set(true);

    const formData = this.form.value
    const insuranceData = {
      insuranceSum: formData.amount!,
      tariffRate: formData.rate!,
      branch: this.branches().find(branch => branch._id === formData.branchId)!,
      insuranceType: this.insuranceTypes().find(insuranceType => insuranceType._id === formData.typeId)!,
    };

    const subscription = this.insuranceService.addInsurance(insuranceData).subscribe({
      next: (createdInsurance) => {
        console.log('Insurance created successfully', createdInsurance);
        this.form.reset();
        this.close.emit();
        document.body.classList.remove('no-scroll');
      },
      error: (error: Error) => {
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
