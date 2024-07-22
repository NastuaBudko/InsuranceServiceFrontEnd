import { Routes } from '@angular/router';
import { InsurancesListComponent } from './components/insurances-list/insurances-list.component';
import { InsuranceDetailsComponent } from './components/insurances-list/insurance/insurance-details/insurance-details.component';
import { PersonalAccountComponent } from './components/personal-account/personal-account.component';

export const routes: Routes = [
    {
        path: '',
        component: InsurancesListComponent
    },
    {
        path: 'insurances/:insuranceId',
        component: InsuranceDetailsComponent
    },
    {
        path: 'profile',
        component: PersonalAccountComponent
    },
    
];
