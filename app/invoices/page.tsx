
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Search,
  FileText,
  IndianRupee,
  Clock3,
  CheckCircle2,
  X,
  Printer,
  Trash2,
  Eye,
} from "lucide-react";

type InvoiceItem = {
  id: number;
  product: string;
  qty: number;
  price: number;
};

type Invoice = {
  id: number;
  number: string;
  customer: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  status: "Paid" | "Pending" | "Overdue";
};

const initialInvoices: Invoice[] = [
  {
    id: 1,
    number: "INV-1024",
    customer: "Shree General Stores",
    date: "2026-10-19",
    dueDate: "2026-10-26",
    items: [{ id: 1, product: "Cola 750ml", qty: 25, price: 40 }],
    status: "Paid",
  },
  {
    id: 2,
    number: "INV-1023",
    customer: "City Cold Drinks",
    date: "2026-10-19",
    dueDate: "2026-10-24",
    items: [{ id: 2, product: "Orange Drink 250ml", qty: 40, price: 20 }],
    status: "Pending",
  },
  {
    id: 3,
    number: "INV-1022",
    customer: "New Maharashtra Mart",
    date: "2026-10-18",
    dueDate: "2026-10-25",
    items: [{ id: 3, product: "Cola Family Pack 2L", qty: 20, price: 90 }],
    status: "Paid",
  },
  {
    id: 4,
    number: "INV-1021",
    customer: "Royal Super Market",
    date: "2026-10-12",
    dueDate: "2026-10-17",
    items: [{ id: 4, product: "Lemon Soda 500ml", qty: 100, price: 30 }],
    status: "Overdue",
  },
];

const customerOptions = [
  "Shree General Stores",
  "City Cold Drinks",
  "New Maharashtra Mart",
  "Royal Super Market",
  "Fresh Beverages",
  "New India Mart",
];

const productOptions = [
  { name: "Cola 750ml", price: 40 },
  { name: "Orange Drink 250ml", price: 20 },
  { name: "Cola Family Pack 2L", price: 90 },
  { name: "Lemon Soda 500ml", price: 30 },
  { name: "Mineral Water 1L", price: 20 },
];

const money = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

const dateLabel = (value: string) =>
  new Date(`${value}T12:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

function invoiceTotal(invoice: Invoice) {
  return invoice.items.reduce(
    (sum, item) => sum + item.qty * item.price,
    0
  );
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);
  const [customer, setCustomer] = useState(customerOptions[0]);
  const [dueDate, setDueDate] = useState("2026-10-26");
  const [selectedProduct, setSelectedProduct] = useState(productOptions[0].name);
  const [quantity, setQuantity] = useState("1");
  const [discount, setDiscount] = useState("0");
  const [error, setError] = useState("");

  const filteredInvoices = useMemo(() => {
    const query = search.trim().toLowerCase();

    return invoices.filter((invoice) => {
      const matchesSearch =
        invoice.number.toLowerCase().includes(query) ||
        invoice.customer.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || invoice.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [invoices, search, statusFilter]);

  const totalBilled = invoices.reduce(
    (sum, invoice) => sum + invoiceTotal(invoice),
    0
  );

  const collected = invoices
    .filter((invoice) => invoice.status === "Paid")
    .reduce((sum, invoice) => sum + invoiceTotal(invoice), 0);

  const outstanding = invoices
    .filter((invoice) => invoice.status !== "Paid")
    .reduce((sum, invoice) => sum + invoiceTotal(invoice), 0);

  const selectedProductInfo = productOptions.find(
    (product) => product.name === selectedProduct
  ) ?? productOptions[0];

  const qty = Number(quantity) || 0;
  const subtotal = qty * selectedProductInfo.price;
  const discountValue = Number(discount) || 0;
  const total = Math.max(0, subtotal - discountValue);

  function resetForm() {
    setCustomer(customerOptions[0]);
    setDueDate("2026-10-26");
    setSelectedProduct(productOptions[0].name);
    setQuantity("1");
    setDiscount("0");
    setError("");
  }

  function createInvoice(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!customer || !dueDate || qty <= 0 || !Number.isInteger(qty)) {
      setError("Choose a customer, due date and a whole-number quantity greater than zero.");
      return;
    }

    if (
      !Number.isFinite(discountValue) ||
      discountValue < 0 ||
      discountValue > subtotal
    ) {
      setError("Discount must be between zero and the subtotal.");
      return;
    }

    const nextNumber =
      1025 +
      invoices.filter((invoice) => Number(invoice.number.slice(4)) >= 1025).length;

    const newInvoice: Invoice = {
      id: Date.now(),
      number: `INV-${nextNumber}`,
      customer,
      date: new Date().toISOString().slice(0, 10),
      dueDate,
      items: [
        {
          id: Date.now(),
          product: selectedProduct,
          qty,
          price: selectedProductInfo.price,
        },
      ],
      status: "Pending",
    };

    setInvoices((current) => [newInvoice, ...current]);
    setModalOpen(false);
    resetForm();
  }

  function updateStatus(invoiceId: number, status: Invoice["status"]) {
    setInvoices((current) =>
      current.map((invoice) =>
        invoice.id === invoiceId ? { ...invoice, status } : invoice
      )
    );

    setViewInvoice((current) =>
      current?.id === invoiceId ? { ...current, status } : current
    );
  }

  function exportCSV() {
    const headers = ["Invoice", "Customer", "Date", "Due Date", "Total", "Status"];
    const rows = filteredInvoices.map((invoice) => [
      invoice.number,
      invoice.customer,
      invoice.date,
      invoice.dueDate,
      invoiceTotal(invoice),
      invoice.status,
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
    anchor.download = "distribution-invoices.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function printInvoice(invoice: Invoice) {
    const printWindow = window.open("", "_blank", "width=800,height=700");

    if (!printWindow) {
      window.alert("Please allow pop-ups to print the invoice.");
      return;
    }

    const rows = invoice.items
      .map(
        (item) => `
          <tr>
            <td>${item.product}</td>
            <td>${item.qty}</td>
            <td>${money(item.price)}</td>
            <td>${money(item.qty * item.price)}</td>
          </tr>`
      )
      .join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${invoice.number}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 36px; color: #1e293b; }
          h1 { color: #2563eb; }
          .meta { line-height: 1.8; margin-bottom: 28px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: left; }
          .total { margin-top: 24px; text-align: right; font-size: 22px; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>DistribuFlow</h1>
        <h2>Tax Invoice / Sales Invoice</h2>
        <div class="meta">
          <strong>Invoice:</strong> ${invoice.number}<br />
          <strong>Customer:</strong> ${invoice.customer}<br />
          <strong>Invoice date:</strong> ${dateLabel(invoice.date)}<br />
          <strong>Due date:</strong> ${dateLabel(invoice.dueDate)}<br />
          <strong>Status:</strong> ${invoice.status}
        </div>
        <table>
          <thead>
            <tr><th>Product</th><th>Qty</th><th>Unit price</th><th>Amount</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <div class="total">Total: ${money(invoiceTotal(invoice))}</div>
        <p>Generated from the DistribuFlow CRM frontend demo.</p>
        <script>window.onload = () => window.print();</script>
      </body>
      </html>
    `);
    printWindow.document.close();
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
              Billing & Invoices
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Create invoices and track customer payments.
            </p>
          </div>

          <button
            onClick={() => {
              resetForm();
              setModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 sm:px-4"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Create Invoice</span>
            <span className="sm:hidden">Create</span>
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard title="Total Invoices" value={String(invoices.length)} detail="All demo invoices" icon={<FileText size={21} />} />
          <SummaryCard title="Total Billed" value={money(totalBilled)} detail="Invoice face value" icon={<IndianRupee size={21} />} />
          <SummaryCard title="Collected" value={money(collected)} detail="Marked as paid" icon={<CheckCircle2 size={21} />} />
          <SummaryCard title="Outstanding" value={money(outstanding)} detail="Pending and overdue invoices" icon={<Clock3 size={21} />} />
        </div>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <h2 className="font-bold">Invoice Register</h2>
              <p className="mt-1 text-sm text-slate-500">
                {filteredInvoices.length} invoice(s) found
              </p>
            </div>

            <button
              onClick={exportCSV}
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-50"
            >
              <FileText size={17} /> Export CSV
            </button>
          </div>

          <div className="flex flex-col gap-3 p-4 sm:flex-row">
            <div className="flex flex-1 items-center gap-2 rounded-lg border border-slate-200 px-3">
              <Search size={18} className="text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search invoice number or customer..."
                className="min-w-0 flex-1 py-3 text-sm outline-none"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm"
            >
              <option value="All">All statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Invoice</th>
                  <th className="px-5 py-4 font-semibold">Customer</th>
                  <th className="px-5 py-4 font-semibold">Invoice Date</th>
                  <th className="px-5 py-4 font-semibold">Due Date</th>
                  <th className="px-5 py-4 font-semibold">Amount</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-slate-50/70">
                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-blue-700">
                      {invoice.number}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 font-medium">
                      {invoice.customer}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">{dateLabel(invoice.date)}</td>
                    <td className="whitespace-nowrap px-5 py-4">{dateLabel(invoice.dueDate)}</td>
                    <td className="whitespace-nowrap px-5 py-4 font-semibold">
                      {money(invoiceTotal(invoice))}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        invoice.status === "Paid"
                          ? "bg-emerald-50 text-emerald-700"
                          : invoice.status === "Pending"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-red-50 text-red-700"
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        <button
                          title="View invoice"
                          onClick={() => setViewInvoice(invoice)}
                          className="rounded-md p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-700"
                        >
                          <Eye size={17} />
                        </button>
                        <button
                          title="Print invoice"
                          onClick={() => printInvoice(invoice)}
                          className="rounded-md p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-700"
                        >
                          <Printer size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredInvoices.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                      No invoices found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-100 px-5 py-4 text-xs text-slate-500">
            Demo invoices only · Amounts are illustrative and exclude tax calculations.
          </div>
        </section>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 p-4">
          <form onSubmit={createInvoice} className="my-6 w-full max-w-xl rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h2 className="text-lg font-bold">Create New Invoice</h2>
                <p className="mt-1 text-sm text-slate-500">Select a customer and add an item.</p>
              </div>
              <button type="button" onClick={() => setModalOpen(false)} aria-label="Close" className="rounded-lg p-2 hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <Field label="Customer">
                <select value={customer} onChange={(e) => setCustomer(e.target.value)} className="field">
                  {customerOptions.map((name) => <option key={name}>{name}</option>)}
                </select>
              </Field>

              <Field label="Due Date">
                <input type="date" required value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="field" />
              </Field>

              <Field label="Product">
                <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} className="field">
                  {productOptions.map((product) => (
                    <option key={product.name} value={product.name}>
                      {product.name} — {money(product.price)}
                    </option>
                  ))}
                </select>
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Quantity">
                  <input type="number" required min="1" step="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="field" />
                </Field>

                <Field label="Discount (₹)">
                  <input type="number" required min="0" step="0.01" value={discount} onChange={(e) => setDiscount(e.target.value)} className="field" />
                </Field>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Subtotal</span>
                  <span>{money(subtotal)}</span>
                </div>
                <div className="mt-2 flex justify-between text-sm text-slate-600">
                  <span>Discount</span>
                  <span>- {money(Math.min(discountValue, subtotal))}</span>
                </div>
                <div className="mt-3 flex justify-between border-t border-slate-200 pt-3 font-bold">
                  <span>Invoice Total</span>
                  <span className="text-blue-700">{money(total)}</span>
                </div>
              </div>
            </div>

            {error && <p role="alert" className="mx-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

            <div className="flex justify-end gap-3 border-t border-slate-100 p-5">
              <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold">
                Cancel
              </button>
              <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                Create Invoice
              </button>
            </div>
          </form>
        </div>
      )}

      {viewInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 p-4">
          <div className="my-6 w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h2 className="text-lg font-bold">{viewInvoice.number}</h2>
                <p className="mt-1 text-sm text-slate-500">{viewInvoice.customer}</p>
              </div>
              <button onClick={() => setViewInvoice(null)} aria-label="Close details" className="rounded-lg p-2 hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Invoice date</span>
                <span>{dateLabel(viewInvoice.date)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Due date</span>
                <span>{dateLabel(viewInvoice.dueDate)}</span>
              </div>

              <div className="divide-y divide-slate-100 rounded-lg border border-slate-200">
                {viewInvoice.items.map((item) => (
                  <div key={item.id} className="flex justify-between gap-3 p-3 text-sm">
                    <div>
                      <p className="font-medium">{item.product}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.qty} × {money(item.price)}
                      </p>
                    </div>
                    <p className="font-semibold">{money(item.qty * item.price)}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between border-t border-slate-200 pt-4 font-bold">
                <span>Total</span>
                <span>{money(invoiceTotal(viewInvoice))}</span>
              </div>

              <Field label="Update Demo Status">
                <select
                  value={viewInvoice.status}
                  onChange={(e) => updateStatus(viewInvoice.id, e.target.value as Invoice["status"])}
                  className="field"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </Field>
            </div>

            <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 p-5">
              <button onClick={() => printInvoice(viewInvoice)} className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold">
                <Printer size={17} /> Print
              </button>
              <button onClick={() => setViewInvoice(null)} className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white">
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
        <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600">{icon}</div>
      </div>
      <p className="mt-4 text-2xl font-bold">{value}</p>
      <p className="mt-2 text-xs text-slate-500">{detail}</p>
    </div>
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
