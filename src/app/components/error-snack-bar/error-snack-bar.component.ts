import { Component, Inject} from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';


@Component({
  selector: 'app-error-snack-bar',
  standalone: true,
  imports: [],
  templateUrl: './error-snack-bar.component.html',
  styleUrl: './error-snack-bar.component.css'
})
export class ErrorSnackBarComponent{

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { textError: string }) {}
}
