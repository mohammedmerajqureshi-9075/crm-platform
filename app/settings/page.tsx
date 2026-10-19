
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  UserRound,
  ReceiptText,
  Bell,
  Save,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";

type BusinessSettings = {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gstin: string;
  currency: string;
  invoicePrefix: string;
  nextInvoiceNumber: string;
  taxRate: string;
  paymentTerms: string;
};

const defaultSettings: BusinessSettings = {
  businessName: "DistribuFlow Distributors",
  ownerName: "Business Owner",
  email: "business@example.com",
  phone: "",
  address: "",
  city: "Nanded",
  state: "Maharashtra",
  pincode: "",
  gstin: "",
  currency: "INR",
  invoicePrefix: "INV-",
  nextInvoiceNumber: "1025",
  taxRate: "18",
  paymentTerms: "15",
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Business Profile");
  const [settings, setSettings] = useState(defaultSettings);
  const [notifications, setNotifications] = useState({
    lowStock: true,
    pendingPayments: true,
    invoiceUpdates: true,
    salesReports: false,
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function updateField(
    field: keyof BusinessSettings,
    value: string
  ) {
    setSettings((current) => ({ ...current, [field]: value }));
    setSaved(false);
    setError("");
  }

  function saveSettings(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const tax = Number(settings.taxRate);
    const invoiceNumber = Number(settings.nextInvoiceNumber);
    const validGstin = settings.gstin.trim();

    if (!Number.isFinite(tax) || tax < 0 || tax > 100) {
      setError("Tax rate 0 se 100 ke beech hona chahiye.");
      return;
    }

    if (!Number.isInteger(invoiceNumber) || invoiceNumber < 1) {
      setError("Next invoice number ek positive whole number hona chahiye.");
      return;
    }

    if (
      validGstin &&
      !/^[0-9A-Z]{15}$/.test(validGstin.toUpperCase())
    ) {
      setError("GSTIN enter kiya hai toh usmein 15 alphanumeric characters hone chahiye.");
      return;
    }

    setSaved(true);
  }

  function resetSettings() {
    setSettings(defaultSettings);
    setNotifications({
      lowStock: true,
      pendingPayments: true,
      invoiceUpdates: true,
      salesReports: false,
    });
    setSaved(false);
    setError("");
  }

  const tabs = [
    { name: "Business Profile", icon: <Building2 size={18} /> },
    { name: "Invoice & Tax", icon: <ReceiptText size={18} /> },
    { name: "Notifications", icon: <Bell size={18} /> },
    { name: "My Profile", icon: <UserRound size={18} /> },
  ];

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
              Settings
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your business details and preferences.
            </p>
          </div>

          <button
            type="button"
            onClick={resetSettings}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold hover:bg-slate-50"
          >
            <RotateCcw size={16} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-8">
        {saved && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <CheckCircle2 size={19} />
            Settings validated successfully. This demo does not persist changes after refresh.
          </div>
        )}

        {error && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid items-start gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
          <aside className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <p className="px-3 pb-3 pt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Preferences
            </p>

            <nav className="flex gap-2 overflow-x-auto lg:flex-col">
              {tabs.map((tab) => (
                <button
                  type="button"
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium transition ${
                    activeTab === tab.name
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {tab.icon}
                  {tab.name}
                </button>
              ))}
            </nav>
          </aside>

          <form onSubmit={saveSettings} className="space-y-6">
            {activeTab === "Business Profile" && (
              <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <SectionHeader
                  title="Business Profile"
                  description="The basic details of your distribution business."
                  icon={<Building2 size={20} />}
                />

                <div className="grid gap-5 p-5 sm:grid-cols-2">
                  <Field label="Business Name">
                    <input
                      required
                      value={settings.businessName}
                      onChange={(e) => updateField("businessName", e.target.value)}
                      className="field"
                      placeholder="Your business name"
                    />
                  </Field>

                  <Field label="Owner Name">
                    <input
                      required
                      value={settings.ownerName}
                      onChange={(e) => updateField("ownerName", e.target.value)}
                      className="field"
                      placeholder="Owner name"
                    />
                  </Field>

                  <Field label="Business Email">
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className="field"
                      placeholder="business@example.com"
                    />
                  </Field>

                  <Field label="Business Phone">
                    <input
                      value={settings.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className="field"
                      placeholder="Enter contact number"
                    />
                  </Field>

                  <div className="sm:col-span-2">
                    <Field label="Business Address">
                      <textarea
                        rows={3}
                        value={settings.address}
                        onChange={(e) => updateField("address", e.target.value)}
                        className="field"
                        placeholder="Shop, office or warehouse address"
                      />
                    </Field>
                  </div>

                  <Field label="City">
                    <input
                      value={settings.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      className="field"
                    />
                  </Field>

                  <Field label="State">
                    <input
                      value={settings.state}
                      onChange={(e) => updateField("state", e.target.value)}
                      className="field"
                    />
                  </Field>

                  <Field label="PIN Code">
                    <input
                      inputMode="numeric"
                      value={settings.pincode}
                      onChange={(e) => updateField("pincode", e.target.value)}
                      className="field"
                      placeholder="6-digit PIN code"
                    />
                  </Field>

                  <Field label="GSTIN (optional)">
                    <input
                      value={settings.gstin}
                      onChange={(e) => updateField("gstin", e.target.value.toUpperCase())}
                      className="field"
                      placeholder="15-character GSTIN"
                      maxLength={15}
                    />
                  </Field>
                </div>
              </section>
            )}

            {activeTab === "Invoice & Tax" && (
              <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <SectionHeader
                  title="Invoice & Tax Settings"
                  description="Configure default invoice preferences."
                  icon={<ReceiptText size={20} />}
                />

                <div className="space-y-5 p-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Currency">
                      <select
                        value={settings.currency}
                        onChange={(e) => updateField("currency", e.target.value)}
                        className="field"
                      >
                        <option value="INR">INR — Indian Rupee (₹)</option>
                        <option value="USD">USD — US Dollar ($)</option>
                        <option value="AED">AED — UAE Dirham</option>
                      </select>
                    </Field>

                    <Field label="Invoice Prefix">
                      <input
                        required
                        value={settings.invoicePrefix}
                        onChange={(e) => updateField("invoicePrefix", e.target.value)}
                        className="field"
                        placeholder="INV-"
                      />
                    </Field>

                    <Field label="Next Invoice Number">
                      <input
                        required
                        type="number"
                        min="1"
                        step="1"
                        value={settings.nextInvoiceNumber}
                        onChange={(e) => updateField("nextInvoiceNumber", e.target.value)}
                        className="field"
                      />
                    </Field>

                    <Field label="Default Tax Rate (%)">
                      <input
                        required
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={settings.taxRate}
                        onChange={(e) => updateField("taxRate", e.target.value)}
                        className="field"
                      />
                    </Field>

                    <Field label="Payment Terms (days)">
                      <select
                        value={settings.paymentTerms}
                        onChange={(e) => updateField("paymentTerms", e.target.value)}
                        className="field"
                      >
                        <option value="0">Due immediately</option>
                        <option value="7">7 days</option>
                        <option value="15">15 days</option>
                        <option value="30">30 days</option>
                        <option value="45">45 days</option>
                      </select>
                    </Field>
                  </div>

                  <div className="rounded-lg bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                    Tax rate is a default preference for this demo, not tax advice.
                    Actual GST treatment depends on the goods, transaction and applicable rules.
                    Confirm tax calculations before issuing real invoices.
                  </div>
                </div>
              </section>
            )}

            {activeTab === "Notifications" && (
              <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <SectionHeader
                  title="Notification Preferences"
                  description="Choose which alerts you want enabled in the interface."
                  icon={<Bell size={20} />}
                />

                <div className="divide-y divide-slate-100 px-5">
                  <ToggleRow
                    title="Low Stock Alerts"
                    description="Alert when a product falls below its stock threshold."
                    checked={notifications.lowStock}
                    onChange={(checked) =>
                      setNotifications((current) => ({ ...current, lowStock: checked }))
                    }
                  />
                  <ToggleRow
                    title="Pending Payment Alerts"
                    description="Show reminders for outstanding customer payments."
                    checked={notifications.pendingPayments}
                    onChange={(checked) =>
                      setNotifications((current) => ({
                        ...current,
                        pendingPayments: checked,
                      }))
                    }
                  />
                  <ToggleRow
                    title="Invoice Updates"
                    description="Receive notifications about invoice status changes."
                    checked={notifications.invoiceUpdates}
                    onChange={(checked) =>
                      setNotifications((current) => ({
                        ...current,
                        invoiceUpdates: checked,
                      }))
                    }
                  />
                  <ToggleRow
                    title="Sales Reports"
                    description="Enable the preference for periodic sales summaries."
                    checked={notifications.salesReports}
                    onChange={(checked) =>
                      setNotifications((current) => ({
                        ...current,
                        salesReports: checked,
                      }))
                    }
                  />
                </div>

                <p className="border-t border-slate-100 p-5 text-xs text-slate-500">
                  These switches only store state while this page is open. Actual email,
                  SMS and push notifications require backend integration.
                </p>
              </section>
            )}

            {activeTab === "My Profile" && (
              <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <SectionHeader
                  title="My Profile"
                  description="Your contact information for this demo."
                  icon={<UserRound size={20} />}
                />

                <div className="space-y-5 p-5">
                  <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700">
                      {(settings.ownerName.trim()[0] || "U").toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold">{settings.ownerName || "Business Owner"}</p>
                      <p className="mt-1 text-sm text-slate-500">Business Administrator</p>
                    </div>
                  </div>

                  <Field label="Display Name">
                    <input
                      required
                      value={settings.ownerName}
                      onChange={(e) => updateField("ownerName", e.target.value)}
                      className="field"
                    />
                  </Field>

                  <Field label="Email Address">
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className="field"
                    />
                  </Field>

                  <Field label="Contact Number">
                    <input
                      value={settings.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className="field"
                    />
                  </Field>

                  <p className="text-xs text-slate-500">
                    Login credentials, password changes and access control will be
                    implemented with authentication in the backend phase.
                  </p>
                </div>
              </section>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Save size={17} />
                Save Preferences
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

function SectionHeader({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-slate-100 p-5">
      <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600">{icon}</div>
      <div>
        <h2 className="font-bold">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
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

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-5">
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-sm leading-5 text-slate-500">{description}</p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-blue-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}
