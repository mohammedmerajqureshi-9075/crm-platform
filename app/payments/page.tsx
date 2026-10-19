
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Plus,
  IndianRupee,
  Wallet,
  Clock3,
  CheckCircle2,
  X,
  Eye,
  Download,
} from "lucide-react";

type PaymentStatus = "Completed" | "Pending" | "Failed";
type PaymentMode = "Cash" | "UPI" | "Bank Transfer" | "Cheque";

type Payment = {
  id: number;
  receipt: string;
  customer: string;
  invoice: string;
  amount: number;
  date: string;
  mode: PaymentMode;
  status: PaymentStatus;
  reference: string;
};

const initialPayments: Payment[] = [
  {
    id: 1,
    receipt: "REC-2001",
    customer: "Shree General Stores",
    invoice: "INV-1024",
    amount: 1000,
    date: "2026-10-19",
    mode: "UPI",
    status: "Completed",
    reference: "UPI-DEMO-1001",
  },
  {
    id: 2,
    receipt: "REC-2002",
    customer: "City Cold Drinks",
    invoice: "INV-1023",
    amount: 500,
    date: "2026-10-19",
    mode: "Cash",
    status: "Pending",
    reference: "CASH-DEMO-1002",
  },
  {
    id: 3,
    receipt: "REC-2003",
    customer: "New Maharashtra Mart",
    invoice: "INV-1022",
    amount: 1800,
    date: "2026-10-18",
    mode: "Bank Transfer",
    status: "Completed",
    reference: "BANK-DEMO-1003",
  },
  {
    id: 4,
    receipt: "REC-2004",
    customer: "Royal Super Market",
    invoice: "INV-1021",
    amount: 750,
    date: "2026-10-18",
    mode: "Cheque",
    status: "Failed",
    reference: "CHQ-DEMO-1004",
  },
];

const customers = [
  "Shree General Stores",
  "City Cold Drinks",
  "New Maharashtra Mart",
  "Royal Super Market",
  "Fresh Beverages",
  "New India Mart",
];

const invoices = ["INV-1021", "INV-1022", "INV-1023", "INV-1024"];

const money = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

const dateLabel = (date: string) =>
  new Date(`${date}T12:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function PaymentsPage() {
  const [payments, setPayments] = useState(initialPayments);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modeFilter, setModeFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [error, setError] = useState("");

  const [customer, setCustomer] = useState(customers[0]);
  const [invoice, setInvoice] = useState(invoices[3]);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("2026-10-19");
  const [mode, setMode] = useState<PaymentMode>("UPI");
  const [reference, setReference] = useState("");

  const filteredPayments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return payments.filter((payment) => {
      const matchesSearch =
        payment.receipt.toLowerCase().includes(query) ||
        payment.customer.toLowerCase().includes(query) ||
        payment.invoice.toLowerCase().includes(query) ||
        payment.reference.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || payment.status === statusFilter;

      const matchesMode = modeFilter === "All" || payment.mode === modeFilter;

      return matchesSearch && matchesStatus && matchesMode;
    });
  }, [payments, search, statusFilter, modeFilter]);

  const completedTotal = payments
    .filter((payment) => payment.status === "Completed")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const pendingTotal = payments
    .filter((payment) => payment.status === "Pending")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const failedTotal = payments
    .filter((payment) => payment.status === "Failed")
    .reduce((sum, payment) => sum + payment.amount, 0);

  function resetForm() {
    setCustomer(customers[0]);
    setInvoice(invoices[3]);
    setAmount("");
    setDate(new Date().toISOString().slice(0, 10));
    setMode("UPI");
    setReference("");
    setError("");
  }

  function addPayment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const parsedAmount = Number(amount);

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Payment amount zero se zyada hona chahiye.");
      return;
    }

    const nextId = Math.max(0, ...payments.map((payment) => payment.id)) + 1;

    const payment: Payment = {
      id: nextId,
      receipt: `REC-${2000 + nextId}`,
      customer,
      invoice,
      amount: parsedAmount,
      date,
      mode,
      status: "Pending",
      reference: reference.trim() || "Not provided",
    };

    setPayments((current) => [payment, ...current]);
    setShowForm(false);
    resetForm();
  }

  function updateStatus(id: number, status: PaymentStatus) {
    setPayments((current) =>
      current.map((payment) =>
        payment.id === id ? { ...payment, status } : payment
      )
    );

    setSelectedPayment((current) =>
      current?.id === id ? { ...current, status } : current
    );
  }

  function exportCSV() {
    const headers = [
      "Receipt",
      "Customer",
      "Invoice",
      "Amount",
      "Date",
      "Mode",
      "Status",
      "Reference",
    ];

    const rows = filteredPayments.map((payment) => [
      payment.receipt,
      payment.customer,
      payment.invoice,
      payment.amount,
      payment.date,
      payment.mode,
      payment.status,
      payment.reference,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\r\n");

    const url = URL.createObjectURL(
      new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
    );

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "distribuflow-payments.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b border-slate-200 bg-white px-4 py-5 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <Link
            href="/"
            aria-label="Back to dashboard"
            className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50"
          >
            <ArrowLeft size={19} />
          </Link>

          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              DistribuFlow CRM
            </p>
            <h1 className="mt-1 text-xl font-bold sm:text-2xl">
              Payments & Collections
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Track customer collections and payment records.
            </p>
          </div>

          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 sm:px-4"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Record Payment</span>
            <span className="sm:hidden">Record</span>
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Total Records"
            value={String(payments.length)}
            detail="All payment entries"
            icon={<Wallet size={21} />}
          />
          <SummaryCard
            title="Collected"
            value={money(completedTotal)}
            detail="Completed records only"
            icon={<CheckCircle2 size={21} />}
          />
          <SummaryCard
            title="Pending"
            value={money(pendingTotal)}
            detail="Awaiting confirmation"
            icon={<Clock3 size={21} />}
          />
          <SummaryCard
            title="Failed"
            value={money(failedTotal)}
            detail="Not counted as collected"
            icon={<IndianRupee size={21} />}
          />
        </div>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <h2 className="font-bold">Collection Register</h2>
              <p className="mt-1 text-sm text-slate-500">
                {filteredPayments.length} payment record(s)
              </p>
            </div>

            <button
              onClick={exportCSV}
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-50"
            >
              <Download size={17} />
              Export CSV
            </button>
          </div>

          <div className="grid gap-3 p-4 md:grid-cols-3">
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3">
              <Search size={18} className="text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search receipt, customer..."
                className="min-w-0 flex-1 py-3 text-sm outline-none"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm"
            >
              <option value="All">All statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>

            <select
              value={modeFilter}
              onChange={(event) => setModeFilter(event.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm"
            >
              <option value="All">All payment modes</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Receipt</th>
                  <th className="px-5 py-4 font-semibold">Customer</th>
                  <th className="px-5 py-4 font-semibold">Invoice</th>
                  <th className="px-5 py-4 font-semibold">Date</th>
                  <th className="px-5 py-4 font-semibold">Mode</th>
                  <th className="px-5 py-4 font-semibold">Amount</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 text-right font-semibold">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50/70">
                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-blue-700">
                      {payment.receipt}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 font-medium">
                      {payment.customer}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      {payment.invoice}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      {dateLabel(payment.date)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      {payment.mode}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 font-semibold">
                      {money(payment.amount)}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={payment.status} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        title="View payment"
                        onClick={() => setSelectedPayment(payment)}
                        className="rounded-md p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <Eye size={17} />
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredPayments.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-5 py-12 text-center text-slate-500"
                    >
                      No payment records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-100 px-5 py-4 text-xs text-slate-500">
            Frontend demo data only. No actual bank, UPI or payment gateway is connected.
          </div>
        </section>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 p-4">
          <form
            onSubmit={addPayment}
            className="my-6 w-full max-w-xl rounded-2xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h2 className="text-lg font-bold">Record Customer Payment</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Add a payment entry for tracking.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                aria-label="Close"
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <Field label="Customer">
                <select
                  value={customer}
                  onChange={(event) => setCustomer(event.target.value)}
                  className="field"
                >
                  {customers.map((name) => (
                    <option key={name}>{name}</option>
                  ))}
                </select>
              </Field>

              <Field label="Invoice">
                <select
                  value={invoice}
                  onChange={(event) => setInvoice(event.target.value)}
                  className="field"
                >
                  {invoices.map((number) => (
                    <option key={number}>{number}</option>
                  ))}
                </select>
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Amount (₹)">
                  <input
                    type="number"
                    required
                    min="0.01"
                    step="0.01"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    placeholder="Enter amount"
                    className="field"
                  />
                </Field>

                <Field label="Payment Date">
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    className="field"
                  />
                </Field>
              </div>

              <Field label="Payment Mode">
                <select
                  value={mode}
                  onChange={(event) =>
                    setMode(event.target.value as PaymentMode)
                  }
                  className="field"
                >
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </Field>

              <Field label="Transaction / Reference ID (optional)">
                <input
                  value={reference}
                  onChange={(event) => setReference(event.target.value)}
                  placeholder="e.g. UTR or transaction reference"
                  className="field"
                />
              </Field>

              <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                New records are saved as Pending until you manually confirm them.
              </div>

              {error && (
                <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 p-5">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Save Payment
              </button>
            </div>
          </form>
        </div>
      )}

      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 p-4">
          <div className="my-6 w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                  Payment details
                </p>
                <h2 className="mt-1 text-lg font-bold">
                  {selectedPayment.receipt}
                </h2>
              </div>
              <button
                onClick={() => setSelectedPayment(null)}
                aria-label="Close details"
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <Detail label="Customer" value={selectedPayment.customer} />
              <Detail label="Invoice" value={selectedPayment.invoice} />
              <Detail label="Payment date" value={dateLabel(selectedPayment.date)} />
              <Detail label="Payment mode" value={selectedPayment.mode} />
              <Detail label="Reference" value={selectedPayment.reference} />

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Payment amount</p>
                <p className="mt-1 text-2xl font-bold">
                  {money(selectedPayment.amount)}
                </p>
              </div>

              <Field label="Update demo status">
                <select
                  value={selectedPayment.status}
                  onChange={(event) =>
                    updateStatus(
                      selectedPayment.id,
                      event.target.value as PaymentStatus
                    )
                  }
                  className="field"
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Failed">Failed</option>
                </select>
              </Field>
            </div>

            <div className="flex justify-end border-t border-slate-100 p-5">
              <button
                onClick={() => setSelectedPayment(null)}
                className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function SummaryCard({
  title,
  value,
  detail,
  icon,
}: {
  title: string;
  value: string;
  detail: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600">
          {icon}
        </div>
      </div>
      <p className="mt-4 text-2xl font-bold">{value}</p>
      <p className="mt-2 text-xs text-slate-500">{detail}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: PaymentStatus }) {
  const styles = {
    Completed: "bg-emerald-50 text-emerald-700",
    Pending: "bg-amber-50 text-amber-700",
    Failed: "bg-red-50 text-red-700",
  };

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      {children}
    </label>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap justify-between gap-2 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
