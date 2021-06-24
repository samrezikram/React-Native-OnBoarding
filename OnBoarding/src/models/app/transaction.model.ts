export interface ITransaction {
    id: number;
    title: string,
    description: string,
    paymentData:  IPaymentData
}

export interface IPaymentData {
    sva: number;
  }

