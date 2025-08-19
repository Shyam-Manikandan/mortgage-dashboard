import type { AmortizationPayment } from "../pages/AmortizationSchedule";

export function findBreakPoint(schedule: AmortizationPayment[]): number | null{
    for (const payment of schedule){
        if(payment.Principal > payment.Interest){
            return payment.paymentNumber;
        }
    }
    return null;
}