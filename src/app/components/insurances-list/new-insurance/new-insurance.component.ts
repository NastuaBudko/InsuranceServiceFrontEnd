import { Component, DestroyRef, inject, OnDestroy, OnInit, output, signal } from '@angular/core';
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
export class NewInsuranceComponent implements OnInit, OnDestroy {
  close = output()

  branches = signal<IBranch[]>([])
  insuranceTypes = signal<IType[]>([])
  submitted = signal(false);
  isSubmitting = signal(false)
  formIsValid = signal(false);

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

  ngOnDestroy(): void {
      document.body.classList.remove('no-scroll');
  }

  loadBranches() {
    const subscription = this.branchesService.getAllBranches().subscribe({
      next: (branchesData) => this.branches.set(branchesData),
      error: (error: HttpErrorResponse) => {
        this._snackBar.openFromComponent(ErrorSnackBarComponent, {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
          data: { textError: error.message }
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
          data: { textError: error.message }
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
    return this.submitted() && !this.formIsValid() && this.authService.AuthToken;
  }

  onSubmitted() {

    this.submitted.set(true);

    if (this.form.controls.amount.valid && this.form.controls.branchId.valid &&
      this.form.controls.rate.valid && this.form.controls.typeId.valid) {
      this.formIsValid.set(true)
    }

    this.isSubmitting.set(true)
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
        this.isSubmitting.set(false)
      },
      error: (error: Error) => {
        this._snackBar.openFromComponent(ErrorSnackBarComponent, {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
          data: { textError: error.message }
        })
        this.isSubmitting.set(false)
      },

    })
    this.destroyRef.onDestroy(() => subscription.unsubscribe());


  }
}
