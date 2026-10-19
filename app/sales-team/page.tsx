
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Plus,
  Users,
  Target,
  TrendingUp,
  MapPin,
  Eye,
  Pencil,
  Trash2,
  X,
  Download,
} from "lucide-react";

type SalesRep = {
  id: number;
  name: string;
  email: string;
  phone: string;
  area: string;
  target: number;
  achieved: number;
  status: "Active" | "Inactive";
};

const initialReps: SalesRep[] = [
  {
    id: 1,
    name: "Aarav Sharma",
    email: "aarav@example.com",
    phone: "9876543210",
    area: "Nanded City",
    target: 500000,
    achieved: 385000,
    status: "Active",
  },
  {
    id: 2,
    name: "Priya Patil",
    email: "priya@example.com",
    phone: "9876543211",
    area: "Vazirabad",
    target: 400000,
    achieved: 340000,
    status: "Active",
  },
  {
    id: 3,
    name: "Rahul Deshmukh",
    email: "rahul@example.com",
    phone: "9876543212",
    area: "CIDCO",
    target: 350000,
    achieved: 210000,
    status: "Active",
  },
  {
    id: 4,
    name: "Sneha Kulkarni",
    email: "sneha@example.com",
    phone: "9876543213",
    area: "Taroda",
    target: 300000,
    achieved: 120000,
    status: "Inactive",
  },
];

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  area: "",
  target: "",
  achieved: "0",
  status: "Active" as SalesRep["status"],
};

const money = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function SalesTeamPage() {
  const [reps, setReps] = useState(initialReps);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedRep, setSelectedRep] = useState<SalesRep | null>(null);
  const [deleteRep, setDeleteRep] = useState<SalesRep | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const filteredReps = useMemo(() => {
    const query = search.trim().toLowerCase();

    return reps.filter((rep) => {
      const matchesSearch =
        rep.name.toLowerCase().includes(query) ||
        rep.email.toLowerCase().includes(query) ||
        rep.phone.includes(query) ||
        rep.area.toLowerCase().includes(query);

      return (
        matchesSearch &&
        (statusFilter === "All" || rep.status === statusFilter)
      );
    });
  }, [reps, search, statusFilter]);

  const activeCount = reps.filter((rep) => rep.status === "Active").length;
  const totalTarget = reps
    .filter((rep) => rep.status === "Active")
    .reduce((sum, rep) => sum + rep.target, 0);
  const totalAchieved = reps
    .filter((rep) => rep.status === "Active")
    .reduce((sum, rep) => sum + rep.achieved, 0);
  const overallProgress =
    totalTarget > 0 ? Math.round((totalAchieved / totalTarget) * 100) : 0;

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  }

  function openEditForm(rep: SalesRep) {
    setEditingId(rep.id);
    setForm({
      name: rep.name,
      email: rep.email,
      phone: rep.phone,
      area: rep.area,
      target: String(rep.target),
      achieved: String(rep.achieved),
      status: rep.status,
    });
    setError("");
    setShowForm(true);
  }

  function saveRep(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const target = Number(form.target);
    const achieved = Number(form.achieved);

    if (!form.name.trim() || !form.area.trim()) {
      setError("Name aur sales area required hain.");
      return;
    }

    if (
      !Number.isFinite(target) ||
      target <= 0 ||
      !Number.isFinite(achieved) ||
      achieved < 0
    ) {
      setError("Valid target aur achieved sales amount enter karo.");
      return;
    }

    if (form.phone && !/^[0-9+\-\s()]{7,18}$/.test(form.phone)) {
      setError("Valid phone number enter karo.");
      return;
    }

    if (editingId !== null) {
      setReps((current) =>
        current.map((rep) =>
          rep.id === editingId
            ? {
                ...rep,
                name: form.name.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                area: form.area.trim(),
                target,
                achieved,
                status: form.status,
              }
            : rep
        )
      );
    } else {
      const nextId = Math.max(0, ...reps.map((rep) => rep.id)) + 1;

      setReps((current) => [
        {
          id: nextId,
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          area: form.area.trim(),
          target,
          achieved,
          status: form.status,
        },
        ...current,
      ]);
    }

    setShowForm(false);
    setForm(emptyForm);
  }

  function confirmDelete() {
    if (!deleteRep) return;

    setReps((current) =>
      current.filter((rep) => rep.id !== deleteRep.id)
    );
    setDeleteRep(null);
  }

  function exportCSV() {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Area",
      "Monthly Target",
      "Achieved Sales",
      "Progress %",
      "Status",
    ];

    const rows = filteredReps.map((rep) => [
      rep.name,
      rep.email,
      rep.phone,
      rep.area,
      rep.target,
      rep.achieved,
      Math.round((rep.achieved / rep.target) * 100),
      rep.status,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\r\n");

    const url = URL.createObjectURL(
      new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=utf-8;",
      })
    );

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "distribuflow-sales-team.csv";
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
              Sales Team
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage representatives, sales areas and monthly targets.
            </p>
          </div>

          <button
            onClick={openAddForm}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 sm:px-4"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Representative</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Total Representatives"
            value={String(reps.length)}
            detail="All team members"
            icon={<Users size={21} />}
          />
          <SummaryCard
            title="Active Members"
            value={String(activeCount)}
            detail="Currently active"
            icon={<TrendingUp size={21} />}
          />
          <SummaryCard
            title="Monthly Sales Target"
            value={money(totalTarget)}
            detail="Active representatives"
            icon={<Target size={21} />}
          />
          <SummaryCard
            title="Target Achievement"
            value={`${overallProgress}%`}
            detail={`${money(totalAchieved)} achieved`}
            icon={<TrendingUp size={21} />}
          />
        </div>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <h2 className="font-bold">Team Representatives</h2>
              <p className="mt-1 text-sm text-slate-500">
                {filteredReps.length} representative(s) found
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

          <div className="grid gap-3 p-4 md:grid-cols-2">
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3">
              <Search size={18} className="text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, email or area..."
                className="min-w-0 flex-1 py-3 text-sm outline-none"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm"
            >
              <option value="All">All statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Representative</th>
                  <th className="px-5 py-4 font-semibold">Sales Area</th>
                  <th className="px-5 py-4 font-semibold">Monthly Target</th>
                  <th className="px-5 py-4 font-semibold">Achieved</th>
                  <th className="px-5 py-4 font-semibold">Progress</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredReps.map((rep) => {
                  const progress = Math.round(
                    (rep.achieved / rep.target) * 100
                  );

                  return (
                    <tr key={rep.id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                            {rep.name
                              .split(" ")
                              .map((part) => part[0])
                              .slice(0, 2)
                              .join("")
                              .toUpperCase()}
                          </div>
                          <div>
                            <p className="whitespace-nowrap font-semibold">
                              {rep.name}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {rep.email || "No email added"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <span className="flex items-center gap-1.5">
                          <MapPin size={15} className="text-slate-400" />
                          {rep.area}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 font-medium">
                        {money(rep.target)}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 font-medium">
                        {money(rep.achieved)}
                      </td>

                      <td className="px-5 py-4">
                        <div className="w-32">
                          <div className="mb-1.5 flex justify-between text-xs">
                            <span className="font-semibold">{progress}%</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={`h-full rounded-full ${
                                progress >= 100
                                  ? "bg-emerald-500"
                                  : "bg-blue-600"
                              }`}
                              style={{
                                width: `${Math.min(progress, 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={rep.status} />
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          <button
                            title="View details"
                            onClick={() => setSelectedRep(rep)}
                            className="rounded-md p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-700"
                          >
                            <Eye size={17} />
                          </button>
                          <button
                            title="Edit representative"
                            onClick={() => openEditForm(rep)}
                            className="rounded-md p-2 text-slate-500 hover:bg-amber-50 hover:text-amber-700"
                          >
                            <Pencil size={17} />
                          </button>
                          <button
                            title="Delete representative"
                            onClick={() => setDeleteRep(rep)}
                            className="rounded-md p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredReps.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-12 text-center text-slate-500"
                    >
                      No representatives found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 p-4">
          <form
            onSubmit={saveRep}
            className="my-6 w-full max-w-2xl rounded-2xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h2 className="text-lg font-bold">
                  {editingId !== null
                    ? "Edit Representative"
                    : "Add Representative"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Enter team member details and sales targets.
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

            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <Field label="Full Name">
                <input
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  placeholder="Enter full name"
                  className="field"
                />
              </Field>

              <Field label="Email">
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm({ ...form, email: event.target.value })
                  }
                  placeholder="name@example.com"
                  className="field"
                />
              </Field>

              <Field label="Phone Number">
                <input
                  value={form.phone}
                  onChange={(event) =>
                    setForm({ ...form, phone: event.target.value })
                  }
                  placeholder="Enter phone number"
                  className="field"
                />
              </Field>

              <Field label="Assigned Sales Area">
                <input
                  required
                  value={form.area}
                  onChange={(event) =>
                    setForm({ ...form, area: event.target.value })
                  }
                  placeholder="e.g. Nanded City"
                  className="field"
                />
              </Field>

              <Field label="Monthly Sales Target (₹)">
                <input
                  type="number"
                  required
                  min="1"
                  value={form.target}
                  onChange={(event) =>
                    setForm({ ...form, target: event.target.value })
                  }
                  placeholder="500000"
                  className="field"
                />
              </Field>

              <Field label="Achieved Sales (₹)">
                <input
                  type="number"
                  required
                  min="0"
                  value={form.achieved}
                  onChange={(event) =>
                    setForm({ ...form, achieved: event.target.value })
                  }
                  placeholder="0"
                  className="field"
                />
              </Field>

              <Field label="Status">
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      status: event.target.value as SalesRep["status"],
                    })
                  }
                  className="field"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </Field>

              {error && (
                <p
                  role="alert"
                  className="self-end rounded-lg bg-red-50 p-3 text-sm text-red-700 sm:col-span-2"
                >
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
                {editingId !== null ? "Save Changes" : "Add Representative"}
              </button>
            </div>
          </form>
        </div>
      )}

      {selectedRep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 p-4">
          <div className="my-6 w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                  Representative details
                </p>
                <h2 className="mt-1 text-lg font-bold">{selectedRep.name}</h2>
              </div>
              <button
                onClick={() => setSelectedRep(null)}
                aria-label="Close details"
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <Detail label="Email" value={selectedRep.email || "Not provided"} />
              <Detail label="Phone" value={selectedRep.phone || "Not provided"} />
              <Detail label="Sales area" value={selectedRep.area} />
              <Detail label="Monthly target" value={money(selectedRep.target)} />
              <Detail label="Achieved sales" value={money(selectedRep.achieved)} />
              <Detail
                label="Remaining target"
                value={money(Math.max(0, selectedRep.target - selectedRep.achieved))}
              />
              <Detail
                label="Achievement"
                value={`${Math.round((selectedRep.achieved / selectedRep.target) * 100)}%`}
              />
              <Detail label="Status" value={selectedRep.status} />
            </div>

            <div className="flex justify-end border-t border-slate-100 p-5">
              <button
                onClick={() => setSelectedRep(null)}
                className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteRep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Trash2 size={22} />
            </div>
            <h2 className="text-lg font-bold">Delete representative?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to delete{" "}
              <strong className="text-slate-700">{deleteRep.name}</strong>?
              This removes the record from this demo page.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteRep(null)}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
              >
                Delete
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

function StatusBadge({ status }: { status: SalesRep["status"] }) {
  const styles = {
    Active: "bg-emerald-50 text-emerald-700",
    Inactive: "bg-slate-100 text-slate-600",
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
