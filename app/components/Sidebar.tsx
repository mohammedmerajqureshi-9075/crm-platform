
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  CreditCard,
  Truck,
  ChartNoAxesCombined,
  Settings,
  Menu,
  X,
  Bell,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Products & Inventory", href: "/products", icon: Package },
  { name: "Billing & Invoices", href: "/invoices", icon: FileText },
  { name: "Payments", href: "/payments", icon: CreditCard },
  { name: "Sales Team", href: "/sales-team", icon: Truck },
  { name: "Reports", href: "/reports", icon: ChartNoAxesCombined },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigation = (
    <>
      <div className="flex h-[120px] items-center gap-4 border-b border-slate-200 px-5">
        <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white">
          <Truck size={32} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            DistribuFlow
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Distribution CRM
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-6">
        <p className="mb-4 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">
          Workspace
        </p>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-4 rounded-xl px-4 py-4 text-[15px] transition-colors ${
                  active
                    ? "bg-blue-50 font-semibold text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-blue-700"
                }`}
              >
                <Icon size={24} className="shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <p className="mb-4 mt-8 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">
          Preferences
        </p>

        <Link
          href="/settings"
          onClick={() => setMobileOpen(false)}
          className={`flex items-center gap-4 rounded-xl px-4 py-4 text-[15px] transition-colors ${
            pathname === "/settings"
              ? "bg-blue-50 font-semibold text-blue-700"
              : "text-slate-600 hover:bg-slate-50 hover:text-blue-700"
          }`}
        >
          <Settings size={24} className="shrink-0" />
          Settings
        </Link>
      </div>

      <div className="border-t border-slate-200 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
            AU
          </div>

          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-800">
              Admin User
            </p>
            <p className="text-sm text-slate-500">
              Administrator
            </p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top navigation */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Truck size={23} />
          </div>

          <div>
            <p className="font-bold text-slate-900">DistribuFlow</p>
            <p className="text-xs text-slate-500">Distribution CRM</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={mobileOpen}
          className="rounded-lg border border-slate-200 p-2.5 text-slate-700 hover:bg-slate-50"
        >
          <Menu size={23} />
        </button>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
        />
      )}

      {/* Desktop sidebar + mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="absolute right-3 top-3 z-10 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation menu"
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {navigation}
      </aside>
    </>
  );
}
