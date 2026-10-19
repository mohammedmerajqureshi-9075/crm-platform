
"use client";

import {
  CreditCard,
  FileText,
  Users,
  Package,
  Plus,
  Search,
  Bell,
  ArrowUpRight,
  Clock3,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";

const stats = [
  {
    title: "Today's Sales",
    value: "₹48,500",
    change: "+12.8%",
    positive: true,
    icon: CreditCard,
  },
  {
    title: "Outstanding Dues",
    value: "₹2,45,000",
    change: "8 pending",
    positive: false,
    icon: FileText,
  },
  {
    title: "Total Customers",
    value: "248",
    change: "+18 this month",
    positive: true,
    icon: Users,
  },
  {
    title: "Low Stock Items",
    value: "12",
    change: "Needs attention",
    positive: false,
    icon: Package,
  },
];

const salesData = [
  { day: "Mon", sales: 32000 },
  { day: "Tue", sales: 45000 },
  { day: "Wed", sales: 38000 },
  { day: "Thu", sales: 56000 },
  { day: "Fri", sales: 42000 },
  { day: "Sat", sales: 68000 },
  { day: "Sun", sales: 48500 },
];

const orders = [
  {
    id: "INV-1024",
    customer: "Shree General Stores",
    date: "19 Oct 2026",
    amount: "₹12,500",
    status: "Paid",
  },
  {
    id: "INV-1023",
    customer: "City Cold Drinks",
    date: "19 Oct 2026",
    amount: "₹8,400",
    status: "Pending",
  },
  {
    id: "INV-1022",
    customer: "New Maharashtra Mart",
    date: "18 Oct 2026",
    amount: "₹15,200",
    status: "Paid",
  },
  {
    id: "INV-1021",
    customer: "Royal Super Market",
    date: "18 Oct 2026",
    amount: "₹6,800",
    status: "Overdue",
  },
];

const products = [
  { name: "Cola 750ml", stock: "8 cases", level: "Critical" },
  { name: "Orange Drink 250ml", stock: "14 cases", level: "Low" },
  { name: "Lemon Soda 500ml", stock: "18 cases", level: "Low" },
];

export default function DashboardPage() {
  return (
    // Sidebar and left spacing are handled by app/layout.tsx
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-8">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">Dashboard</h1>
          <p className="mt-1 hidden text-sm text-slate-500 sm:block">
            Welcome back! Here&apos;s your business overview.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
            <Search size={17} className="text-slate-400" />
            <input
              placeholder="Search anything..."
              className="w-36 bg-transparent text-sm outline-none"
            />
          </div>

          <button
            aria-label="Notifications"
            className="relative rounded-lg border border-slate-200 p-2.5"
          >
            <Bell size={19} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>

          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold">Admin User</p>
            <p className="text-xs text-slate-500">Super Admin</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] space-y-7 p-4 sm:p-8">
        {/* Page heading */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-slate-500">
              Monday, 19 October 2026
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight">
              Business Overview
            </h2>
          </div>

          <Link
            href="/invoices"
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            <Plus size={18} />
            Create New Invoice
          </Link>
        </div>

        {/* Summary cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>
                <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600">
                  <stat.icon size={20} />
                </div>
              </div>

              <p className="mt-4 text-2xl font-bold tracking-tight">
                {stat.value}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
                {stat.positive ? (
                  <ArrowUpRight
                    size={15}
                    className="text-emerald-600"
                  />
                ) : (
                  <Clock3 size={14} className="text-amber-600" />
                )}

                <span
                  className={
                    stat.positive
                      ? "font-semibold text-emerald-600"
                      : "text-amber-700"
                  }
                >
                  {stat.change}
                </span>

                {stat.positive && (
                  <span className="text-slate-400">
                    vs last period
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Sales chart and quick actions */}
        <div className="grid gap-6 xl:grid-cols-3">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 xl:col-span-2">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-bold">Sales Overview</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Weekly sales performance
                </p>
              </div>

              <span className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600">
                This week
              </span>
            </div>

            <div className="mt-6 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient
                      id="salesFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#2563eb"
                        stopOpacity={0.22}
                      />
                      <stop
                        offset="95%"
                        stopColor="#2563eb"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    stroke="#e2e8f0"
                    strokeDasharray="4 4"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    tickFormatter={(value) => `₹${value / 1000}k`}
                    width={48}
                  />

                  <Tooltip
                    formatter={(value) => [
                      `₹${Number(value).toLocaleString("en-IN")}`,
                      "Sales",
                    ]}
                  />

                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    fill="url(#salesFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Quick actions */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="font-bold">Quick Actions</h3>
            <p className="mt-1 text-sm text-slate-500">Common tasks</p>

            <div className="mt-5 space-y-3">
              {[
                {
                  label: "Add New Customer",
                  href: "/customers",
                  icon: Users,
                },
                {
                  label: "View Products",
                  href: "/products",
                  icon: Package,
                },
                {
                  label: "Create Invoice",
                  href: "/invoices",
                  icon: FileText,
                },
                {
                  label: "Record Payment",
                  href: "/payments",
                  icon: CreditCard,
                },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 text-sm font-medium transition hover:border-blue-300 hover:bg-blue-50"
                >
                  <span className="rounded-lg bg-slate-100 p-2 text-slate-600">
                    <action.icon size={18} />
                  </span>
                  {action.label}
                  <span className="ml-auto text-slate-400">→</span>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Recent invoices and inventory alerts */}
        <div className="grid gap-6 xl:grid-cols-3">
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h3 className="font-bold">Recent Invoices</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Latest billing activity
                </p>
              </div>

              <Link
                href="/invoices"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                View all
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-medium">Invoice</th>
                    <th className="px-5 py-3 font-medium">Customer</th>
                    <th className="px-5 py-3 font-medium">Amount</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50">
                      <td className="whitespace-nowrap px-5 py-4 font-semibold text-blue-700">
                        {order.id}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <p className="font-medium">{order.customer}</p>
                        <p className="mt-1 text-xs text-slate-400">
                          {order.date}
                        </p>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 font-semibold">
                        {order.amount}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            order.status === "Paid"
                              ? "bg-emerald-50 text-emerald-700"
                              : order.status === "Pending"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-red-50 text-red-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Low stock alerts */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold">Low Stock Alerts</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Products needing restock
                </p>
              </div>
              <Package className="text-amber-500" size={20} />
            </div>

            <div className="mt-5 space-y-4">
              {products.map((product) => (
                <div
                  key={product.name}
                  className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4 last:border-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {product.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {product.stock} remaining
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-md px-2 py-1 text-xs font-semibold ${
                      product.level === "Critical"
                        ? "bg-red-50 text-red-600"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {product.level}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/products"
              className="mt-3 block w-full rounded-lg border border-slate-200 py-2.5 text-center text-sm font-semibold hover:bg-slate-50"
            >
              View Inventory
            </Link>
          </section>
        </div>

        <footer className="pb-2 text-center text-xs text-slate-400">
          DistribuFlow CRM · Developed by GenAlliance · Demo data
        </footer>
      </main>
    </div>
  );
}
