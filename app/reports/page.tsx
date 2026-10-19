
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  TrendingUp,
  IndianRupee,
  ShoppingCart,
  Users,
  CreditCard,
  Package,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

type Range = "7 days" | "30 days" | "90 days";

const salesData: Record<Range, { label: string; sales: number; orders: number }[]> = {
  "7 days": [
    { label: "Mon", sales: 18000, orders: 12 },
    { label: "Tue", sales: 24000, orders: 16 },
    { label: "Wed", sales: 21000, orders: 14 },
    { label: "Thu", sales: 32000, orders: 20 },
    { label: "Fri", sales: 28000, orders: 18 },
    { label: "Sat", sales: 39000, orders: 25 },
    { label: "Sun", sales: 35000, orders: 22 },
  ],
  "30 days": [
    { label: "Week 1", sales: 125000, orders: 82 },
    { label: "Week 2", sales: 148000, orders: 95 },
    { label: "Week 3", sales: 136000, orders: 88 },
    { label: "Week 4", sales: 175000, orders: 112 },
  ],
  "90 days": [
    { label: "Aug", sales: 410000, orders: 265 },
    { label: "Sep", sales: 465000, orders: 302 },
    { label: "Oct", sales: 584000, orders: 377 },
  ],
};

const topProducts = [
  { name: "Cold Drinks", sales: 145000, units: 1250 },
  { name: "Packaged Snacks", sales: 112000, units: 980 },
  { name: "Bottled Water", sales: 98000, units: 1600 },
  { name: "Dairy Products", sales: 76000, units: 620 },
  { name: "Biscuits", sales: 53000, units: 740 },
];

const initialTeam = [
  { name: "Aarav Sharma", target: 500000, achieved: 385000 },
  { name: "Priya Patil", target: 400000, achieved: 340000 },
  { name: "Rahul Deshmukh", target: 350000, achieved: 210000 },
  { name: "Sneha Kulkarni", target: 300000, achieved: 120000 },
];

const invoiceData = [
  { name: "Paid", value: 68, color: "#10b981" },
  { name: "Pending", value: 22, color: "#f59e0b" },
  { name: "Overdue", value: 10, color: "#ef4444" },
];

const paymentData = [
  { mode: "UPI", amount: 145000 },
  { mode: "Cash", amount: 95000 },
  { mode: "Bank", amount: 180000 },
  { mode: "Cheque", amount: 45000 },
];

const money = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function ReportsPage() {
  const [range, setRange] = useState<Range>("30 days");
  const [reportType, setReportType] = useState("Sales Overview");

  const currentSales = useMemo(() => salesData[range], [range]);

  const totalSales = currentSales.reduce((sum, item) => sum + item.sales, 0);
  const totalOrders = currentSales.reduce((sum, item) => sum + item.orders, 0);
  const averageOrderValue = totalOrders ? totalSales / totalOrders : 0;

  const teamTotal = initialTeam.reduce((sum, member) => sum + member.achieved, 0);
  const teamTarget = initialTeam.reduce((sum, member) => sum + member.target, 0);
  const teamProgress = teamTarget
    ? Math.round((teamTotal / teamTarget) * 100)
    : 0;

  function exportReport() {
    let headers: string[];
    let rows: (string | number)[][];

    if (reportType === "Sales Overview") {
      headers = ["Period", "Sales Amount", "Orders"];
      rows = currentSales.map((item) => [
        item.label,
        item.sales,
        item.orders,
      ]);
    } else if (reportType === "Top Products") {
      headers = ["Product", "Sales Amount", "Units Sold"];
      rows = topProducts.map((item) => [
        item.name,
        item.sales,
        item.units,
      ]);
    } else if (reportType === "Sales Team") {
      headers = ["Representative", "Target", "Achieved", "Achievement %"];
      rows = initialTeam.map((member) => [
        member.name,
        member.target,
        member.achieved,
        Math.round((member.achieved / member.target) * 100),
      ]);
    } else if (reportType === "Payment Methods") {
      headers = ["Payment Method", "Amount"];
      rows = paymentData.map((item) => [item.mode, item.amount]);
    } else {
      headers = ["Invoice Status", "Share %"];
      rows = invoiceData.map((item) => [item.name, item.value]);
    }

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
    anchor.download = `distribuflow-${reportType
      .toLowerCase()
      .replace(/\s+/g, "-")}.csv`;
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
              Reports & Analytics
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Understand sales, collections and team performance.
            </p>
          </div>

          <button
            onClick={exportReport}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 sm:px-4"
          >
            <Download size={17} />
            <span className="hidden sm:inline">Export Report</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-8">
        <section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold">Analytics Overview</h2>
            <p className="mt-1 text-sm text-slate-500">
              Select a period to update the sales chart and summary.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {(["7 days", "30 days", "90 days"] as Range[]).map((item) => (
              <button
                key={item}
                onClick={() => setRange(item)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                  range === item
                    ? "bg-blue-600 text-white"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Sales in Selected Period"
            value={money(totalSales)}
            detail={`${range} sample sales`}
            icon={<IndianRupee size={21} />}
          />
          <MetricCard
            title="Orders"
            value={totalOrders.toLocaleString("en-IN")}
            detail="Orders in selected period"
            icon={<ShoppingCart size={21} />}
          />
          <MetricCard
            title="Average Order Value"
            value={money(averageOrderValue)}
            detail="Sales ÷ orders"
            icon={<TrendingUp size={21} />}
          />
          <MetricCard
            title="Team Target Achieved"
            value={`${teamProgress}%`}
            detail={`${money(teamTotal)} achieved of ${money(teamTarget)}`}
            icon={<Users size={21} />}
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 xl:col-span-2">
            <div className="mb-5">
              <h2 className="font-bold">Sales Performance</h2>
              <p className="mt-1 text-sm text-slate-500">
                Revenue across the selected period.
              </p>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentSales}>
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.22} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `₹${Number(value) / 1000}k`}
                    width={55}
                  />
                  <Tooltip formatter={(value) => money(Number(value))} />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    name="Sales"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    fill="url(#salesGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="font-bold">Invoice Status</h2>
            <p className="mt-1 text-sm text-slate-500">
              Illustrative invoice distribution.
            </p>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={invoiceData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={58}
                    outerRadius={85}
                    paddingAngle={4}
                  >
                    {invoiceData.map((item) => (
                      <Cell key={item.name} fill={item.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {invoiceData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.name}
                  </span>
                  <span className="font-semibold">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-5">
              <h2 className="font-bold">Top Selling Products</h2>
              <p className="mt-1 text-sm text-slate-500">
                Sample sales by product category.
              </p>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts} margin={{ left: 4, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                    height={65}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `₹${Number(value) / 1000}k`}
                  />
                  <Tooltip formatter={(value) => money(Number(value))} />
                  <Bar dataKey="sales" name="Sales" fill="#2563eb" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-5">
              <h2 className="font-bold">Sales Team Performance</h2>
              <p className="mt-1 text-sm text-slate-500">
                Achieved sales compared with individual targets.
              </p>
            </div>

            <div className="space-y-5">
              {initialTeam.map((member) => {
                const progress = Math.round(
                  (member.achieved / member.target) * 100
                );

                return (
                  <div key={member.name}>
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-medium">{member.name}</span>
                      <span className="text-xs text-slate-500">
                        {money(member.achieved)} / {money(member.target)}
                      </span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    <p className="mt-1 text-right text-xs font-semibold text-slate-500">
                      {progress}% achieved
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-indigo-50 p-2.5 text-indigo-600">
                <CreditCard size={21} />
              </div>
              <div>
                <h2 className="font-bold">Payment Methods</h2>
                <p className="text-sm text-slate-500">Sample collection breakdown</p>
              </div>
            </div>

            <div className="space-y-4">
              {paymentData.map((item) => {
                const maxAmount = Math.max(...paymentData.map((row) => row.amount));
                const percent = (item.amount / maxAmount) * 100;

                return (
                  <div key={item.mode}>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span>{item.mode}</span>
                      <span className="font-semibold">{money(item.amount)}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-indigo-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-50 p-2.5 text-amber-600">
                <Package size={21} />
              </div>
              <div>
                <h2 className="font-bold">Product Sales Summary</h2>
                <p className="text-sm text-slate-500">
                  Product category totals for the demo.
                </p>
              </div>
            </div>

            <div className="mt-5 divide-y divide-slate-100">
              {topProducts.map((product) => (
                <div
                  key={product.name}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold">{product.name}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {product.units.toLocaleString("en-IN")} units sold
                    </p>
                  </div>
                  <p className="whitespace-nowrap text-sm font-bold">
                    {money(product.sales)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <p className="text-center text-xs leading-5 text-slate-500">
          Demo analytics only. Reports currently use sample data and are not
          connected to your customers, invoices, products or payments.
        </p>
      </div>
    </main>
  );
}

function MetricCard({
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
