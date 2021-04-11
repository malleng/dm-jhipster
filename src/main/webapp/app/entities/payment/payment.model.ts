import { PaymentMethod } from 'app/entities/enumerations/payment-method.model';

export interface IPayment {
  id?: number;
  paymentMethod?: PaymentMethod;
}

export class Payment implements IPayment {
  constructor(public id?: number, public paymentMethod?: PaymentMethod) {}
}

export function getPaymentIdentifier(payment: IPayment): number | undefined {
  return payment.id;
}
