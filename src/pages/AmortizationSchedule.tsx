import { useState, useEffect, Fragment, useMemo} from "react";
import type { ReactNode } from "react";
import { ChevronUp, ChevronDown } from "@carbon/icons-react";
import { ContentSwitcher, Switch } from "@carbon/react";
import {
  formatCurrency,
  formatPercentage,
} from "../utils/formatFunctions";
import "../pages/amortization-schedule.css";


export interface AmortizationPayment {
  paymentNumber: number;
  Amount: number;
  Principal: number;
  Interest: number;
  Balance: number;
  childRows?: AmortizationPayment[];
}

interface AmortizationScheduleProps {
  amortizationSchedule: AmortizationPayment[];
  aprValue: number;
}

const AmortizationSchedule: React.FC<AmortizationScheduleProps> = ({
  amortizationSchedule,
  aprValue,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [tableData, setTableData] = useState<AmortizationPayment[]>([]);
 
  const breakPoint = useMemo(
    () => findBreakPoint(amortizationSchedule)
    ,[amortizationSchedule]);
    


  useEffect(() => {
    if (!amortizationSchedule || amortizationSchedule.length === 0) {
      setTableData([]);
      return;
    }
    
    if (activeTab === 0) {
      const yearlyData: AmortizationPayment[] = [];
      for (let i = 0; i < amortizationSchedule.length; i += 12) {
        const yearArr = amortizationSchedule.slice(i, i + 12);
        const totals = yearArr.reduce(
          (acc, payment) => {
            acc.Amount += payment.Amount;
            acc.Principal += payment.Principal;
            acc.Interest += payment.Interest;
            return acc;
          },
          {
            Amount: 0,
            Principal: 0,
            Interest: 0,
            Balance: 0,
            paymentNumber: i / 12 + 1,
            childRows: [],
          } as AmortizationPayment
        );
        totals.Balance = yearArr[yearArr.length - 1].Balance;
        totals.childRows = yearArr;
        yearlyData.push(totals);
      }
      setTableData(yearlyData);
    } else {
      setTableData(amortizationSchedule);
    }
  }, [activeTab, amortizationSchedule]);

  return (
    <div className="min-w-[200px] max-h-[calc(100vh-190px)] h-[550px] text-[11px]">
      <div className="flex justify-between mt-1 mb-3">
        <div className="text-xl !text-[var(--rl-gray)]">
          <span>APR - </span>
          <span className="font-bold">{formatPercentage(aprValue)}</span>
        </div>
        <ContentSwitcher
          onChange={({ index }: { index?: number }) => {
            if (index !== undefined) setActiveTab(index);
          }}
          selectedIndex={activeTab}
          size="sm"
          className="border-1 border-[var(--rl-gray-border)] !w-[130px]"
        >
          <Switch
            name="yearly"
            text="Yearly"
            className="!text-[10px] !px-2 !py-1 justify-center"
          />
          <Switch
            name="monthly"
            text="Monthly"
            className="!text-[10px] !px-2 !py-1 justify-center"
          />
        </ContentSwitcher>
      </div>

      <div className="max-h-[calc(100vh-240px)] h-[500px] overflow-auto pr-[5px] border-t-1 border-[#e0e0e0]">
        <table className="amortization-schedule w-full" cellSpacing={0}>
          <thead>
            <tr className="row-container sticky top-0 bg-white z-25 ">
              <th className="text-center">{activeTab === 0 ? "" : "Month"}</th>
              <th>Paid</th>
              <th>Interest</th>
              <th>Principal</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((payment, index) => (
              <Fragment key={payment.paymentNumber}>
                {activeTab === 0 ? (
                  <CollapsibleRow
                    payment={payment}
                    defaultIsOpen={true}
                    stickyHeaderIndex={index + 1}
                  >
                    {payment.childRows?.map((row) => (
                      <tr key={row.paymentNumber} 
                      className={row.paymentNumber === breakPoint ? "bg-gray-300":""}>
                        <td className="text-center pl-3">{row.paymentNumber}</td>
                        <td>{formatCurrency(row.Amount, 0)}</td>
                        <td>{formatCurrency(row.Interest, 0)}</td>
                        <td>{formatCurrency(row.Principal, 0)}</td>
                        <td>{formatCurrency(row.Balance, 0)}</td>
                      </tr>
                    ))}
                  </CollapsibleRow>
                ) : (
                  <tr key={payment.paymentNumber} 
                  className={payment.paymentNumber === breakPoint ? "bg-gray-300":""} >
                    <td className="text-center">{payment.paymentNumber}</td>
                    <td>{formatCurrency(payment.Amount, 0)}</td>
                    <td>{formatCurrency(payment.Interest, 0)}</td>
                    <td>{formatCurrency(payment.Principal, 0)}</td>
                    <td>{formatCurrency(payment.Balance, 0)}</td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface CollapsibleRowProps {
  payment: AmortizationPayment;
  defaultIsOpen?: boolean;
  children: ReactNode;
  stickyHeaderIndex?: number;
}

const CollapsibleRow: React.FC<CollapsibleRowProps> = ({
  payment,
  defaultIsOpen = false,
  children,
  stickyHeaderIndex = 0,
}) => {
  const [isOpen, setIsOpen] = useState(defaultIsOpen);

  return (
    <>
      <tr
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-[var(--rl-gray-light)] cursor-pointer ${
          stickyHeaderIndex ? "sticky top-[29px] z-10" : ""
        }`}
      >
        <td colSpan={5}>
          <div className="flex items-center font-bold gap-1.5">
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            <span>Year {payment.paymentNumber}</span>
            <span>Total amount Paid: {formatCurrency(payment.Amount, 0)}</span>
            <span>Total Interest: {formatCurrency(payment.Interest, 0)}</span>
            <span>Total Principal: {formatCurrency(payment.Principal, 0)}</span>
            <span>Current Balance: {formatCurrency(payment.Balance, 0)}</span>
          </div>
        </td>
      </tr>
      {isOpen && children}
    </>
  );
};

function findBreakPoint(schedule: AmortizationPayment[]): number | null{
    for (const payment of schedule){
        if(payment.Principal > payment.Interest){
            return payment.paymentNumber;
        }
    }
    return null;
}


export default AmortizationSchedule;
