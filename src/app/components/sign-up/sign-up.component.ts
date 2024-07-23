import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IUser } from '../../models/user.model';
import { IBranch } from '../../models/branch.model';
import { BranchesService } from '../../services/branches.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorSnackBarComponent } from '../error-snack-bar/error-snack-bar.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent implements OnInit{
  private authService = inject(AuthService)
  private branchesService = inject(BranchesService)
  private destroyRef = inject(DestroyRef)
  private router = inject(Router)
  private _snackBar = inject(MatSnackBar)

  branches = signal<IBranch[]>([])
  submitted = signal(false);

  get formIsInvalid() {
      return this.form.invalid && this.submitted();
  }

  ngOnInit() {
    this.loadBranches()
    if (this.authService.AuthToken) {
      this.router.navigate(['']);
    }
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
      },
    })
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  form = new FormGroup({
    email: new FormControl('',
      { validators: [Validators.required, Validators.email] }
    ),
    name: new FormControl('',
      { validators: [Validators.required, Validators.minLength(3)] }
    ),
    lastName: new FormControl('',
      { validators: [Validators.required, Validators.minLength(3)] }
    ),
    middleName: new FormControl('',
      { validators: [Validators.required, Validators.minLength(3)] }
    ),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(5)]
    }),
    phoneNumber: new FormControl('',
      {validators: [Validators.required, Validators.pattern(/^\d{10}$/)]}
    ),
    branch: new FormControl('',
      {validators: [Validators.required]}
    )
  })

  filterSpaces(event: KeyboardEvent) {
    const key = event.key;
    if (key === ' ') {
      event.preventDefault();
    }
  }

  onSubmitted() {
    this.submitted.set(true);

    if(this.form.valid) {
      const formData = this.form.value
      
      const userData: IUser = {
        email: formData.email!,
        name: formData.name!,
        lastName: formData.lastName!,
        middleName: formData.middleName!,
        password: formData.password!,
        phoneNumber: formData.phoneNumber!,
        branch: this.branches().find(branch => branch._id === formData.branch)!,
      };
      const subscription = this.authService.register(userData).subscribe({
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
