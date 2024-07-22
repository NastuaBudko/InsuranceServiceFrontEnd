import { IBranch } from "./branch.model";

export interface IUser {
    email: string
    name: string,
    lastName: string,
    middleName: string,
    password: string,
    phoneNumber: string,
    branch: IBranch,
    insuranceCount?: number;
    salary?: number;
}