
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Plus,
  Users,
  Download,
  Eye,
  Pencil,
  Trash2,
  X,
  Store,
  Phone,
  MapPin,
} from "lucide-react";

type Customer = {
  id: number;
  name: string;
  shop: string;
  phone: string;
  city: string;
  type: "Retailer" | "Wholesaler" | "Distributor";
  balance: number;
  creditLimit: number;
};

const initialCustomers: Customer[] = [
  { id: 1, name: "Mohammed Irfan", shop: "Shree General Stores", phone: "9876543210", city: "Nanded", type: "Retailer", balance: 12500, creditLimit: 30000 },
  { id: 2, name: "Rahul Patil", shop: "City Cold Drinks", phone: "9876543211", city: "Nanded", type: "Retailer", balance: 8400, creditLimit: 20000 },
  { id: 3, name: "Amit Shah", shop: "Maharashtra Wholesale", phone: "9876543212", city: "Latur", type: "Wholesaler", balance: 45000, creditLimit: 60000 },
  { id: 4, name: "Sohail Khan", shop: "Royal Super Market", phone: "9876543213", city: "Nanded", type: "Retailer", balance: 0, creditLimit: 15000 },
  { id: 5, name: "Vijay Deshmukh", shop: "Fresh Beverages", phone: "9876543214", city: "Parbhani", type: "Distributor", balance: 18500, creditLimit: 50000 },
  { id: 6, name: "Arif Shaikh", shop: "New India Mart", phone: "9876543215", city: "Nanded", type: "Retailer", balance: 6200, creditLimit: 15000 },
];

const emptyForm = {
  name: "",
  shop: "",
  phone: "",
  city: "",
  type: "Retailer" as Customer["type"],
  balance: "0",
  creditLimit: "15000",
};

const money = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function CustomersPage() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const filteredCustomers = useMemo(() => {
    const query = search.toLowerCase().trim();

    return customers.filter((customer) => {
      const matchesSearch = [
        customer.name,
        customer.shop,
        customer.phone,
        customer.city,
      ].some((value) => value.toLowerCase().includes(query));

      const matchesType =
        typeFilter === "All" || customer.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [customers, search, typeFilter]);

  const totalOutstanding = customers.reduce(
    (sum, customer) => sum + customer.balance,
    0
  );

  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  }

  function openEditModal(customer: Customer) {
    setEditingId(customer.id);
    setForm({
      name: customer.name,
      shop: customer.shop,
      phone: customer.phone,
      city: customer.city,
      type: customer.type,
      balance: String(customer.balance),
      creditLimit: String(customer.creditLimit),
    });
    setError("");
    setModalOpen(true);
  }

  function saveCustomer(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!/^\d{10}$/.test(form.phone.trim())) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    const balance = Number(form.balance);
    const creditLimit = Number(form.creditLimit);

    if (
      !Number.isFinite(balance) ||
      !Number.isFinite(creditLimit) ||
      balance < 0 ||
      creditLimit < 0
    ) {
      setError("Balance and credit limit must be valid non-negative amounts.");
      return;
    }

    const customerData = {
      name: form.name.trim(),
      shop: form.shop.trim(),
      phone: form.phone.trim(),
      city: form.city.trim(),
      type: form.type,
      balance,
      creditLimit,
    };

    if (editingId !== null) {
      setCustomers((current) =>
        current.map((customer) =>
          customer.id === editingId
            ? { ...customer, ...customerData }
            : customer
        )
      );
    } else {
      setCustomers((current) => [
        { id: Date.now(), ...customerData },
        ...current,
      ]);
    }

    setModalOpen(false);
    setForm(emptyForm);
  }

  function deleteCustomer(customer: Customer) {
    const confirmed = window.confirm(
      `Delete ${customer.shop} from this demo customer list?`
    );

    if (!confirmed) return;

    setCustomers((current) =>
      current.filter((item) => item.id !== customer.id)
    );

    if (selected?.id === customer.id) setSelected(null);
  }

  function exportCSV() {
    const headers = [
      "Customer",
      "Shop",
      "Phone",
      "City",
      "Type",
      "Outstanding",
      "Credit Limit",
    ];

    const rows = filteredCustomers.map((customer) => [
      customer.name,
      customer.shop,
      customer.phone,
      customer.city,
      customer.type,
      customer.balance,
      customer.creditLimit,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\r\n");

    const url = URL.createObjectURL(
      new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
    );

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "distribution-customers.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b border-slate-200 bg-white px-4 py-5 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <Link
            href="/"
            className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50"
            aria-label="Back to dashboard"
          >
            <ArrowLeft size={19} />
          </Link>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              DistribuFlow CRM
            </p>
            <h1 className="mt-1 text-xl font-bold sm:text-2xl">
              Customers
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your shops, customer balances and credit limits.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 sm:px-4"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Customer</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <SummaryCard
            label="Total Customers"
            value={String(customers.length)}
            detail="All registered customers"
            icon={<Users size={21} />}
          />
          <SummaryCard
            label="Outstanding Dues"
            value={money(totalOutstanding)}
            detail="Total demo customer balances"
            icon={<Store size={21} />}
          />
          <SummaryCard
            label="Credit Available"
            value={money(
              customers.reduce(
                (sum, customer) =>
                  sum + Math.max(0, customer.creditLimit - customer.balance),
                0
              )
            )}
            detail="Based on demo credit limits"
            icon={<Users size={21} />}
          />
        </div>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <h2 className="font-bold">Customer Directory</h2>
              <p className="mt-1 text-sm text-slate-500">
                {filteredCustomers.length} customer(s) found
              </p>
            </div>
            <button
              onClick={exportCSV}
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-50"
            >
              <Download size={17} /> Export CSV
            </button>
          </div>

          <div className="flex flex-col gap-3 p-4 sm:flex-row">
            <div className="flex flex-1 items-center gap-2 rounded-lg border border-slate-200 px-3">
              <Search size={18} className="shrink-0 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, shop, phone or city..."
                className="min-w-0 flex-1 py-3 text-sm outline-none"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="All">All customer types</option>
              <option value="Retailer">Retailer</option>
              <option value="Wholesaler">Wholesaler</option>
              <option value="Distributor">Distributor</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Customer</th>
                  <th className="px-5 py-4 font-semibold">Contact</th>
                  <th className="px-5 py-4 font-semibold">Type</th>
                  <th className="px-5 py-4 font-semibold">Outstanding</th>
                  <th className="px-5 py-4 font-semibold">Credit Limit</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 font-bold text-blue-700">
                          {customer.shop.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold">{customer.shop}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            {customer.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p>{customer.phone}</p>
                      <p className="mt-1 text-xs text-slate-500">{customer.city}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-md bg-slate-100 px-2.5 py-1.5 text-xs font-medium">
                        {customer.type}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 font-semibold">
                      {money(customer.balance)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      {money(customer.creditLimit)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          customer.balance === 0
                            ? "bg-emerald-50 text-emerald-700"
                            : customer.balance >= customer.creditLimit
                              ? "bg-red-50 text-red-700"
                              : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {customer.balance === 0
                          ? "Clear"
                          : customer.balance >= customer.creditLimit
                            ? "Limit Reached"
                            : "Outstanding"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => setSelected(customer)}
                          title="View customer"
                          className="rounded-md p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-700"
                        >
                          <Eye size={17} />
                        </button>
                        <button
                          onClick={() => openEditModal(customer)}
                          title="Edit customer"
                          className="rounded-md p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-700"
                        >
                          <Pencil size={17} />
                        </button>
                        <button
                          onClick={() => deleteCustomer(customer)}
                          title="Delete customer"
                          className="rounded-md p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredCustomers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                      No customers found. Try another search or add a customer.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-100 px-5 py-4 text-xs text-slate-500">
            Demo data only · Changes reset when the page is refreshed.
          </div>
        </section>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 p-4">
          <form
            onSubmit={saveCustomer}
            className="my-6 w-full max-w-xl rounded-2xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h2 className="text-lg font-bold">
                  {editingId !== null ? "Edit Customer" : "Add New Customer"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Enter the customer and shop details.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-2 hover:bg-slate-100"
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <Field label="Contact Person">
                <input required maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="field" placeholder="Enter full name" />
              </Field>
              <Field label="Shop / Business Name">
                <input required maxLength={120} value={form.shop} onChange={(e) => setForm({ ...form, shop: e.target.value })} className="field" placeholder="Enter shop name" />
              </Field>
              <Field label="Phone Number">
                <input required inputMode="numeric" maxLength={10} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} className="field" placeholder="10-digit mobile number" />
              </Field>
              <Field label="City">
                <input required maxLength={80} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="field" placeholder="Enter city" />
              </Field>
              <Field label="Customer Type">
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Customer["type"] })} className="field">
                  <option>Retailer</option>
                  <option>Wholesaler</option>
                  <option>Distributor</option>
                </select>
              </Field>
              <Field label="Credit Limit (₹)">
                <input required type="number" min="0" value={form.creditLimit} onChange={(e) => setForm({ ...form, creditLimit: e.target.value })} className="field" />
              </Field>
              <Field label="Opening Outstanding (₹)">
                <input required type="number" min="0" value={form.balance} onChange={(e) => setForm({ ...form, balance: e.target.value })} className="field" />
              </Field>
            </div>

            {error && (
              <p role="alert" className="mx-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <div className="flex justify-end gap-3 border-t border-slate-100 p-5">
              <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold">
                Cancel
              </button>
              <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                {editingId !== null ? "Save Changes" : "Add Customer"}
              </button>
            </div>
          </form>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold">{selected.shop}</h2>
                <p className="mt-1 text-sm text-slate-500">{selected.name}</p>
              </div>
              <button onClick={() => setSelected(null)} aria-label="Close details" className="rounded-lg p-2 hover:bg-slate-100">
                <X size={19} />
              </button>
            </div>
            <div className="mt-6 space-y-4 text-sm">
              <p className="flex items-center gap-3"><Phone size={17} className="text-slate-400" />{selected.phone}</p>
              <p className="flex items-center gap-3"><MapPin size={17} className="text-slate-400" />{selected.city}</p>
              <p>Type: <strong>{selected.type}</strong></p>
              <p>Outstanding: <strong>{money(selected.balance)}</strong></p>
              <p>Credit limit: <strong>{money(selected.creditLimit)}</strong></p>
            </div>
            <button onClick={() => setSelected(null)} className="mt-6 w-full rounded-lg bg-blue-600 py-2.5 font-semibold text-white">
              Close Details
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function SummaryCard({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
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
