'use client';

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

interface Payment {
  id: string;
  purchaseId: string;
  propertyName: string;
  buyerName: string;
  amount: number;
  type: "deposit" | "installment" | "final" | "other";
  status: "pending" | "completed" | "failed";
  dueDate: string;
  paidDate?: string;
  reference?: string;
  notes?: string;
}

interface FinancialSummary {
  totalProperties: number;
  totalValue: number;
  totalPaid: number;
  totalPending: number;
  depositsPaid: number;
  depositsTotal: number;
  installmentsPaid: number;
  installmentsTotal: number;
  finalPaymentsPaid: number;
  finalPaymentsTotal: number;
}

const AdminFinancialDashboard: React.FC = () => {
  const { user } = useAuth();
  const [paymentssetPayments] = useState<Payment[]>([]);
  const [summarysetSummary] = useState<FinancialSummary | null>(null);
  const [loadingsetLoading] = useState(true);
  const [errorsetError] = useState<string | null>(null);
  const [filtersetFilter] = useState("all");
  const [dateRangesetDateRange] = useState("all");
  const [selectedPaymentsetSelectedPayment] = useState<Payment | null>(null);

  // Mock API function - will be replaced with actual API call
  const fetchFinancialData = async (filter = "all", dateRange = "all") => {
    // Simulate API call
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const mockPayments = [
          {
            id: "payment-1",
            purchaseId: "purchase-1",
            propertyName: "Fitzgerald Gardens - Unit 14",
            buyerName: "John Smith",
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
          {
            id: "payment-2",
            purchaseId: "purchase-1",
            propertyName: "Fitzgerald Gardens - Unit 14",
            buyerName: "John Smith",
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
          {
            id: "payment-3",
            purchaseId: "purchase-1",
            propertyName: "Fitzgerald Gardens - Unit 14",
            buyerName: "John Smith",
            amount: 35000,
            type: "installment",
            status: "pending",
            dueDate: new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            notes: "Second installment payment",
          {
            id: "payment-4",
            purchaseId: "purchase-1",
            propertyName: "Fitzgerald Gardens - Unit 14",
            buyerName: "John Smith",
            amount: 280000,
            type: "final",
            status: "pending",
            dueDate: new Date(
              Date.now() + 90 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            notes: "Final payment on completion",
          {
            id: "payment-5",
            purchaseId: "purchase-2",
            propertyName: "Ballymakennyview - Unit 8",
            buyerName: "Jane Doe",
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
          {
            id: "payment-6",
            purchaseId: "purchase-2",
            propertyName: "Ballymakennyview - Unit 8",
            buyerName: "Jane Doe",
            amount: 20000,
            type: "installment",
            status: "pending",
            dueDate: new Date(
              Date.now() + 15 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            notes: "First installment payment",
          {
            id: "payment-7",
            purchaseId: "purchase-2",
            propertyName: "Ballymakennyview - Unit 8",
            buyerName: "Jane Doe",
            amount: 245000,
            type: "final",
            status: "pending",
            dueDate: new Date(
              Date.now() + 120 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            notes: "Final payment on completion",
          {
            id: "payment-8",
            purchaseId: "purchase-3",
            propertyName: "Fitzgerald Gardens - Unit 15",
            buyerName: "Robert Johnson",
            amount: 15000,
            type: "deposit",
            status: "completed",
            dueDate: new Date(
              Date.now() - 20 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            paidDate: new Date(
              Date.now() - 19 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            reference: "DEP-10004",
            notes: "Initial booking deposit"];

        // Filter payments based on filter and dateRange
        let filteredPayments = [...mockPayments];

        if (filter !== "all") {
          filteredPayments = filteredPayments.filter(
            (payment) => payment.status === filter,
          );
        }

        if (dateRange !== "all") {
          const now = new Date();
          const startDate = new Date();

          switch (dateRange) {
            case "today":
              startDate.setHours(0, 0, 00);
              break;
            case "week":
              startDate.setDate(now.getDate() - 7);
              break;
            case "month":
              startDate.setMonth(now.getMonth() - 1);
              break;
            case "quarter":
              startDate.setMonth(now.getMonth() - 3);
              break;
            default:
              break;
          }

          filteredPayments = filteredPayments.filter((payment) => {
            const paymentDate = payment.paidDate
              ? new Date(payment.paidDate)
              : new Date(payment.dueDate);
            return paymentDate>= startDate && paymentDate <= now;
          });
        }

        // Calculate summary
        const totalProperties = new Set(
          filteredPayments.map((p) => p.purchaseId),
        ).size;
        const totalValue = filteredPayments.reduce(
          (sump) => sum + p.amount,
          0,
        );
        const totalPaid = filteredPayments
          .filter((p) => p.status === "completed")
          .reduce((sump) => sum + p.amount0);
        const totalPending = filteredPayments
          .filter((p) => p.status === "pending")
          .reduce((sump) => sum + p.amount0);

        const depositsPaid = filteredPayments
          .filter((p) => p.type === "deposit" && p.status === "completed")
          .reduce((sump) => sum + p.amount0);
        const depositsTotal = filteredPayments
          .filter((p) => p.type === "deposit")
          .reduce((sump) => sum + p.amount0);

        const installmentsPaid = filteredPayments
          .filter((p) => p.type === "installment" && p.status === "completed")
          .reduce((sump) => sum + p.amount0);
        const installmentsTotal = filteredPayments
          .filter((p) => p.type === "installment")
          .reduce((sump) => sum + p.amount0);

        const finalPaymentsPaid = filteredPayments
          .filter((p) => p.type === "final" && p.status === "completed")
          .reduce((sump) => sum + p.amount0);
        const finalPaymentsTotal = filteredPayments
          .filter((p) => p.type === "final")
          .reduce((sump) => sum + p.amount0);

        resolve({
          success: true,
          data: {
            payments: filteredPayments,
            summary: {
              totalProperties,
              totalValue,
              totalPaid,
              totalPending,
              depositsPaid,
              depositsTotal,
              installmentsPaid,
              installmentsTotal,
              finalPaymentsPaid,
              finalPaymentsTotal}});
      }, 1000);
    });
  };

  // Mock API function - will be replaced with actual API call
  const processPayment = async (
    paymentId: string,
    status: "pending" | "completed" | "failed",
    notes: string,
  ) => {
    // Simulate API call
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            id: paymentId,
            status,
            notes,
            paidDate: new Date().toISOString()});
      }, 1500);
    });
  };

  useEffect(() => {
    const loadFinancialData = async () => {
      try {
        setLoading(true);
        const response = await fetchFinancialData(filterdateRange);

        if (response.success) {
          setPayments(response.data.payments);
          setSummary(response.data.summary);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch financial data");

      } finally {
        setLoading(false);
      }
    };

    loadFinancialData();
  }, [filterdateRange]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDateRange(e.target.value);
  };

  const handlePaymentSelect = (payment: Payment) => {
    setSelectedPayment(payment);
  };

  const handleProcessPayment = async (status: "pending" | "completed" | "failed") => {
    if (!selectedPayment) return;

    try {
      setLoading(true);

      const response = await processPayment(
        selectedPayment.id,
        status,
        "Payment processed by admin",
      );

      if (response.success) {
        // Update payment in list
        setPayments((prevPayments) =>
          prevPayments.map((payment) =>
            payment.id === selectedPayment.id
              ? { ...payment, status, paidDate: response.data.paidDate }
              : payment,
          ),
        );

        // Update selected payment
        setSelectedPayment({
          ...selectedPayment,
          status,
          paidDate: response.data.paidDate});

        // Refresh summary
        const updatedResponse = await fetchFinancialData(filterdateRange);
        if (updatedResponse.success) {
          setSummary(updatedResponse.data.summary);
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to process payment");

    } finally {
      setLoading(false);
    }
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
      currency: "EUR").format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IE", {
      year: "numeric",
      month: "long",
      day: "numeric");
  };

  if (loading && !summary) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && !summary) {
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

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Financial Management
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Track and manage payments for all property purchases.
        </p>
      </div>

      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        {/* Financial Summary */}
        {summary && (
          <div className="mb-8">
            <h4 className="text-md font-medium text-gray-900 mb-4">
              Financial Summary
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                <p className="text-sm text-gray-500">Total Properties</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {summary.totalProperties}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                <p className="text-sm text-gray-500">Total Value</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(summary.totalValue)}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                <p className="text-sm text-gray-500">Total Paid</p>
                <p className="text-2xl font-semibold text-green-600">
                  {formatCurrency(summary.totalPaid)}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                <p className="text-sm text-gray-500">Total Pending</p>
                <p className="text-2xl font-semibold text-yellow-600">
                  {formatCurrency(summary.totalPending)}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                <p className="text-sm text-gray-500">Deposits</p>
                <p className="text-xl font-semibold text-gray-900">
                  {formatCurrency(summary.depositsPaid)} /{" "
                  {formatCurrency(summary.depositsTotal)}
                </p>
                <div className="mt-2 relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                    <div
                      style={
                        width: `${summary.depositsTotal> 0 ? (summary.depositsPaid / summary.depositsTotal) * 100 : 0}%`}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                    ></div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                <p className="text-sm text-gray-500">Installments</p>
                <p className="text-xl font-semibold text-gray-900">
                  {formatCurrency(summary.installmentsPaid)} /{" "
                  {formatCurrency(summary.installmentsTotal)}
                </p>
                <div className="mt-2 relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                    <div
                      style={
                        width: `${summary.installmentsTotal> 0 ? (summary.installmentsPaid / summary.installmentsTotal) * 100 : 0}%`}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                    ></div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                <p className="text-sm text-gray-500">Final Payments</p>
                <p className="text-xl font-semibold text-gray-900">
                  {formatCurrency(summary.finalPaymentsPaid)} /{" "
                  {formatCurrency(summary.finalPaymentsTotal)}
                </p>
                <div className="mt-2 relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                    <div
                      style={
                        width: `${summary.finalPaymentsTotal> 0 ? (summary.finalPaymentsPaid / summary.finalPaymentsTotal) * 100 : 0}%`}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <h4 className="text-md font-medium text-gray-900 mb-2 md:mb-0">
            Payment Transactions
          </h4>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div>
              <label
                htmlFor="filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="filter"
                name="filter"
                value={filter}
                onChange={handleFilterChange}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">All Payments</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="dateRange"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date Range
              </label>
              <select
                id="dateRange"
                name="dateRange"
                value={dateRange}
                onChange={handleDateRangeChange}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="quarter">Last 90 Days</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Export Report
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Payments Table */}
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Property / Buyer
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {payments.length> 0 ? (
                    payments.map((payment) => (
                      <tr
                        key={payment.id}
                        onClick={() => handlePaymentSelect(payment)}
                        className={`cursor-pointer hover:bg-gray-50 ${selectedPayment?.id === payment.id ? "bg-blue-50" : ""`}
                      >
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="font-medium text-gray-900">
                            {payment.propertyName}
                          </div>
                          <div className="text-gray-500">
                            {payment.buyerName}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {getPaymentTypeText(payment.type)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 font-medium">
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
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-3 py-8 text-sm text-gray-500 text-center"
                      >
                        No payments found matching the current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-1">
            {/* Payment Details */}
            {selectedPayment ? (
              <div className="bg-white rounded-lg shadow border border-gray-200">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Payment Details
                  </h3>
                </div>

                <div className="px-4 py-5 sm:p-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Property
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {selectedPayment.propertyName}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Buyer
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {selectedPayment.buyerName}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Payment Type
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {getPaymentTypeText(selectedPayment.type)}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Amount
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 font-semibold">
                        {formatCurrency(selectedPayment.amount)}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Due Date
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {formatDate(selectedPayment.dueDate)}
                      </dd>
                    </div>

                    {selectedPayment.paidDate && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Paid Date
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {formatDate(selectedPayment.paidDate)}
                        </dd>
                      </div>
                    )}

                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Status
                      </dt>
                      <dd className="mt-1">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusBadgeClass(selectedPayment.status)}`}
                        >
                          {selectedPayment.status.charAt(0).toUpperCase() +
                            selectedPayment.status.slice(1)}
                        </span>
                      </dd>
                    </div>

                    {selectedPayment.reference && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Reference
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {selectedPayment.reference}
                        </dd>
                      </div>
                    )}

                    {selectedPayment.notes && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Notes
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {selectedPayment.notes}
                        </dd>
                      </div>
                    )}
                  </dl>

                  {selectedPayment.status === "pending" && (
                    <div className="mt-6 flex space-x-3">
                      <button
                        type="button"
                        onClick={() => handleProcessPayment("completed")}
                        className="flex-1 bg-green-600 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Mark as Paid
                      </button>
                      <button
                        type="button"
                        onClick={() => handleProcessPayment("failed")}
                        className="flex-1 bg-red-600 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Mark as Failed
                      </button>
                    </div>
                  )}

                  {selectedPayment.status === "completed" && (
                    <div className="mt-6">
                      <button
                        type="button"
                        className="w-full bg-blue-600 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Generate Receipt
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
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
                  No payment selected
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Select a payment from the list to view details.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFinancialDashboard;