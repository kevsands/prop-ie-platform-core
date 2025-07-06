'use client';

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

interface Payment {
  id: string;
  purchaseId: string;
  propertyName: string;
  amount: number;
  type: "deposit" | "installment" | "final" | "other";
  status: "pending" | "completed" | "failed";
  dueDate: string;
  paidDate?: string;
  reference?: string;
  notes?: string;
}

interface PaymentSchedule {
  id: string;
  purchaseId: string;
  propertyName: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  nextPaymentDate?: string;
  nextPaymentAmount?: number;
  payments: Payment[];
}

const BuyerFinancialDashboard: React.FC = () => {
  const { user } = useAuth();
  const [paymentSchedules, setPaymentSchedules] = useState<PaymentSchedule[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSchedule, setSelectedSchedule] =
    useState<PaymentSchedule | null>(null);

  // Mock API function - will be replaced with actual API call
  const fetchPaymentSchedules = async () => {
    // Simulate API call
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: [
            {
              id: "schedule-1",
              purchaseId: "purchase-1",
              propertyName: "Fitzgerald Gardens - Unit 14",
              totalAmount: 350000,
              paidAmount: 35000,
              remainingAmount: 315000,
              nextPaymentDate: new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000,
              ).toISOString(),
              nextPaymentAmount: 35000,
              payments: [
                {
                  id: "payment-1",
                  purchaseId: "purchase-1",
                  propertyName: "Fitzgerald Gardens - Unit 14",
                  amount: 10000,
                  type: "deposit",
                  status: "completed",
                  dueDate: new Date(
                    Date.now() - 30 * 24 * 60 * 60 * 1000,
                  ).toISOString(),
                  paidDate: new Date(
                    Date.now() - 28 * 24 * 60 * 60 * 1000,
                  ).toISOString(),
                  reference: "DEP-10001",
                  notes: "Initial booking deposit",
                },
                {
                  id: "payment-2",
                  purchaseId: "purchase-1",
                  propertyName: "Fitzgerald Gardens - Unit 14",
                  amount: 25000,
                  type: "installment",
                  status: "completed",
                  dueDate: new Date(
                    Date.now() - 15 * 24 * 60 * 60 * 1000,
                  ).toISOString(),
                  paidDate: new Date(
                    Date.now() - 14 * 24 * 60 * 60 * 1000,
                  ).toISOString(),
                  reference: "INS-10002",
                  notes: "First installment payment",
                },
                {
                  id: "payment-3",
                  purchaseId: "purchase-1",
                  propertyName: "Fitzgerald Gardens - Unit 14",
                  amount: 35000,
                  type: "installment",
                  status: "pending",
                  dueDate: new Date(
                    Date.now() + 30 * 24 * 60 * 60 * 1000,
                  ).toISOString(),
                  notes: "Second installment payment",
                },
                {
                  id: "payment-4",
                  purchaseId: "purchase-1",
                  propertyName: "Fitzgerald Gardens - Unit 14",
                  amount: 280000,
                  type: "final",
                  status: "pending",
                  dueDate: new Date(
                    Date.now() + 90 * 24 * 60 * 60 * 1000,
                  ).toISOString(),
                  notes: "Final payment on completion",
                },
              ],
            },
            {
              id: "schedule-2",
              purchaseId: "purchase-2",
              propertyName: "Ballymakennyview - Unit 8",
              totalAmount: 275000,
              paidAmount: 10000,
              remainingAmount: 265000,
              nextPaymentDate: new Date(
                Date.now() + 15 * 24 * 60 * 60 * 1000,
              ).toISOString(),
              nextPaymentAmount: 20000,
              payments: [
                {
                  id: "payment-5",
                  purchaseId: "purchase-2",
                  propertyName: "Ballymakennyview - Unit 8",
                  amount: 10000,
                  type: "deposit",
                  status: "completed",
                  dueDate: new Date(
                    Date.now() - 10 * 24 * 60 * 60 * 1000,
                  ).toISOString(),
                  paidDate: new Date(
                    Date.now() - 9 * 24 * 60 * 60 * 1000,
                  ).toISOString(),
                  reference: "DEP-10003",
                  notes: "Initial booking deposit",
                },
                {
                  id: "payment-6",
                  purchaseId: "purchase-2",
                  propertyName: "Ballymakennyview - Unit 8",
                  amount: 20000,
                  type: "installment",
                  status: "pending",
                  dueDate: new Date(
                    Date.now() + 15 * 24 * 60 * 60 * 1000,
                  ).toISOString(),
                  notes: "First installment payment",
                },
                {
                  id: "payment-7",
                  purchaseId: "purchase-2",
                  propertyName: "Ballymakennyview - Unit 8",
                  amount: 245000,
                  type: "final",
                  status: "pending",
                  dueDate: new Date(
                    Date.now() + 120 * 24 * 60 * 60 * 1000,
                  ).toISOString(),
                  notes: "Final payment on completion",
                },
              ],
            },
          ],
        });
      }, 1000);
    });
  };

  useEffect(() => {
    const loadPaymentSchedules = async () => {
      try {
        setLoading(true);
        const response = await fetchPaymentSchedules();

        if (response.success) {
          setPaymentSchedules(response.data);
          if (response.data.length > 0) {
            setSelectedSchedule(response.data[0]);
          }
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch payment schedules");
        console.error("Error fetching payment schedules:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPaymentSchedules();
  }, []);

  const handleScheduleSelect = (schedule: PaymentSchedule) => {
    setSelectedSchedule(schedule);
  };

  const getPaymentTypeText = (type: string) => {
    switch (type) {
      case "deposit":
        return "Booking Deposit";
      case "installment":
        return "Installment Payment";
      case "final":
        return "Final Payment";
      case "other":
        return "Other Payment";
      default:
        return type;
    }
  };

  const getPaymentStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateProgress = (paidAmount: number, totalAmount: number) => {
    return Math.round((paidAmount / totalAmount) * 100);
  };

  if (loading && paymentSchedules.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && paymentSchedules.length === 0) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (paymentSchedules.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          No payment schedules
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          You don't have any active payment schedules.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Financial Dashboard
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Track your payments and financial status for your property purchases.
        </p>
      </div>

      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <h4 className="text-md font-medium text-gray-900 mb-4">
              Your Properties
            </h4>

            <div className="overflow-y-auto max-h-96 pr-2">
              <ul className="divide-y divide-gray-200">
                {paymentSchedules.map((schedule) => (
                  <li key={schedule.id}>
                    <button
                      onClick={() => handleScheduleSelect(schedule)}
                      className={`block w-full text-left px-4 py-4 hover:bg-gray-50 focus:outline-none ${selectedSchedule?.id === schedule.id ? "bg-blue-50" : ""}`}
                    >
                      <div className="flex flex-col">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-blue-600">
                            {schedule.propertyName}
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(schedule.totalAmount)}
                          </p>
                        </div>
                        <div className="mt-2">
                          <div className="relative pt-1">
                            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                              <div
                                style={{
                                  width: `${calculateProgress(schedule.paidAmount, schedule.totalAmount)}%`,
                                }}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                              ></div>
                            </div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>
                              Paid: {formatCurrency(schedule.paidAmount)}
                            </span>
                            <span>
                              {calculateProgress(
                                schedule.paidAmount,
                                schedule.totalAmount,
                              )}
                              %
                            </span>
                          </div>
                        </div>
                        {schedule.nextPaymentDate && (
                          <p className="mt-2 text-xs text-gray-500">
                            Next payment:{" "}
                            {formatCurrency(schedule.nextPaymentAmount || 0)}{" "}
                            due on {formatDate(schedule.nextPaymentDate)}
                          </p>
                        )}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedSchedule && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-md font-medium text-gray-900">
                    {selectedSchedule.propertyName} - Payment Schedule
                  </h4>
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Download Statement
                  </button>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded shadow">
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="text-xl font-semibold text-gray-900">
                        {formatCurrency(selectedSchedule.totalAmount)}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                      <p className="text-sm text-gray-500">Paid Amount</p>
                      <p className="text-xl font-semibold text-green-600">
                        {formatCurrency(selectedSchedule.paidAmount)}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                      <p className="text-sm text-gray-500">Remaining Amount</p>
                      <p className="text-xl font-semibold text-blue-600">
                        {formatCurrency(selectedSchedule.remainingAmount)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                            Payment Progress
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block text-blue-600">
                            {calculateProgress(
                              selectedSchedule.paidAmount,
                              selectedSchedule.totalAmount,
                            )}
                            %
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                        <div
                          style={{
                            width: `${calculateProgress(selectedSchedule.paidAmount, selectedSchedule.totalAmount)}%`,
                          }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <h5 className="text-sm font-medium text-gray-900 mb-3">
                  Payment History
                </h5>

                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          Type
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Amount
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Due Date
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Reference
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {selectedSchedule.payments.map((payment) => (
                        <tr key={payment.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {getPaymentTypeText(payment.type)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {formatCurrency(payment.amount)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {formatDate(payment.dueDate)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusBadgeClass(payment.status)}`}
                            >
                              {payment.status.charAt(0).toUpperCase() +
                                payment.status.slice(1)}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {payment.reference || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {selectedSchedule.nextPaymentDate && (
                  <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-blue-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3 flex-1 md:flex md:justify-between">
                        <p className="text-sm text-blue-700">
                          Your next payment of{" "}
                          {formatCurrency(
                            selectedSchedule.nextPaymentAmount || 0,
                          )}{" "}
                          is due on{" "}
                          {formatDate(selectedSchedule.nextPaymentDate)}.
                        </p>
                        <p className="mt-3 text-sm md:mt-0 md:ml-6">
                          <button className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600">
                            Make Payment <span aria-hidden="true">&rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerFinancialDashboard;
