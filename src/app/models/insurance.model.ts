import { IBranch } from "./branch.model"
import { IType } from "./insurance-type.model"

export interface IInsurance {
    insuranceSum: string;
    tariffRate: string;
    branch: IBranch;
    insuranceType: IType;
}

export interface IInsuranceForServer {
    _id: string;
    insuranceSum: number;
    tariffRate: number;
    branch: IBranch;
    insuranceType: IType;
    createdAt: Date;
}
