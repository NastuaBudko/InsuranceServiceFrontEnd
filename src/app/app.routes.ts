import { Routes } from '@angular/router';
import { InsurancesListComponent } from './components/insurances-list/insurances-list.component';
import { InsuranceDetailsComponent } from './components/insurances-list/insurance/insurance-details/insurance-details.component';

export const routes: Routes = [
    {
        path: '',
        component: InsurancesListComponent
    },
    {
        path: 'insurances/:insuranceId',
        component: InsuranceDetailsComponent
    },
    
];
