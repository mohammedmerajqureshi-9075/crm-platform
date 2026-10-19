
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Package,
  AlertTriangle,
  Boxes,
  Download,
  Pencil,
  Trash2,
  X,
  ArrowLeft,
} from "lucide-react";

type Product = {
  id: number;
  name: string;
  brand: string;
  category: string;
  size: string;
  price: number;
  stock: number;
  reorderLevel: number;
};

const initialProducts: Product[] = [
  { id: 1, name: "Cola", brand: "Distribu Cola", category: "Carbonated", size: "750 ml", price: 40, stock: 120, reorderLevel: 30 },
  { id: 2, name: "Orange Drink", brand: "FreshSip", category: "Fruit Drink", size: "250 ml", price: 20, stock: 14, reorderLevel: 25 },
  { id: 3, name: "Lemon Soda", brand: "LimeFresh", category: "Carbonated", size: "500 ml", price: 30, stock: 18, reorderLevel: 25 },
  { id: 4, name: "Cola Family Pack", brand: "Distribu Cola", category: "Carbonated", size: "2 L", price: 90, stock: 85, reorderLevel: 20 },
  { id: 5, name: "Mango Drink", brand: "FreshSip", category: "Fruit Drink", size: "200 ml", price: 15, stock: 8, reorderLevel: 20 },
  { id: 6, name: "Mineral Water", brand: "ClearDrop", category: "Water", size: "1 L", price: 20, stock: 240, reorderLevel: 50 },
];

const emptyForm = {
  name: "",
  brand: "",
  category: "Carbonated",
  size: "",
  price: "",
  stock: "",
  reorderLevel: "20",
};

const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);

export default function ProductsPage() {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch = [
        product.name,
        product.brand,
        product.category,
        product.size,
      ].some((value) => value.toLowerCase().includes(query));

      return (
        matchesSearch &&
        (categoryFilter === "All" ||
          product.category === categoryFilter)
      );
    });
  }, [products, search, categoryFilter]);

  const lowStock = products.filter(
    (product) => product.stock <= product.reorderLevel
  ).length;

  const totalUnits = products.reduce(
    (sum, product) => sum + product.stock,
    0
  );

  function openAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  }

  function openEdit(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      brand: product.brand,
      category: product.category,
      size: product.size,
      price: String(product.price),
      stock: String(product.stock),
      reorderLevel: String(product.reorderLevel),
    });
    setError("");
    setModalOpen(true);
  }

  function saveProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const price = Number(form.price);
    const stock = Number(form.stock);
    const reorderLevel = Number(form.reorderLevel);

    if (
      !Number.isFinite(price) ||
      !Number.isFinite(stock) ||
      !Number.isFinite(reorderLevel) ||
      price < 0 ||
      stock < 0 ||
      reorderLevel < 0
    ) {
      setError("Price and stock values must be valid non-negative numbers.");
      return;
    }

    const productData = {
      name: form.name.trim(),
      brand: form.brand.trim(),
      category: form.category,
      size: form.size.trim(),
      price,
      stock,
      reorderLevel,
    };

    if (editingId !== null) {
      setProducts((current) =>
        current.map((product) =>
          product.id === editingId
            ? { ...product, ...productData }
            : product
        )
      );
    } else {
      setProducts((current) => [
        { id: Date.now(), ...productData },
        ...current,
      ]);
    }

    setModalOpen(false);
    setForm(emptyForm);
  }

  function deleteProduct(product: Product) {
    if (!window.confirm(`Delete ${product.name} from this demo list?`)) {
      return;
    }

    setProducts((current) =>
      current.filter((item) => item.id !== product.id)
    );
  }

  function exportCSV() {
    const headers = [
      "Product",
      "Brand",
      "Category",
      "Pack Size",
      "Price",
      "Stock Units",
      "Reorder Level",
    ];

    const rows = filteredProducts.map((product) => [
      product.name,
      product.brand,
      product.category,
      product.size,
      product.price,
      product.stock,
      product.reorderLevel,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\r\n");

    const url = URL.createObjectURL(
      new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=utf-8;",
      })
    );

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "distribution-products.csv";
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
              Products & Inventory
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage products, prices and available stock.
            </p>
          </div>

          <button
            onClick={openAdd}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 sm:px-4"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Product</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryCard
            title="Total Products"
            value={String(products.length)}
            detail="Registered product types"
            icon={<Package size={21} />}
          />
          <SummaryCard
            title="Total Stock Units"
            value={totalUnits.toLocaleString("en-IN")}
            detail="Sum of demo stock quantities"
            icon={<Boxes size={21} />}
          />
          <SummaryCard
            title="Low Stock Products"
            value={String(lowStock)}
            detail="At or below reorder level"
            icon={<AlertTriangle size={21} />}
          />
        </div>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <h2 className="font-bold">Product Catalogue</h2>
              <p className="mt-1 text-sm text-slate-500">
                {filteredProducts.length} product(s) found
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

          <div className="flex flex-col gap-3 p-4 sm:flex-row">
            <div className="flex flex-1 items-center gap-2 rounded-lg border border-slate-200 px-3">
              <Search size={18} className="shrink-0 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products, brands or pack sizes..."
                className="min-w-0 flex-1 py-3 text-sm outline-none"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="All">All categories</option>
              <option value="Carbonated">Carbonated</option>
              <option value="Fruit Drink">Fruit Drink</option>
              <option value="Water">Water</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Product</th>
                  <th className="px-5 py-4 font-semibold">Category</th>
                  <th className="px-5 py-4 font-semibold">Pack Size</th>
                  <th className="px-5 py-4 font-semibold">Unit Price</th>
                  <th className="px-5 py-4 font-semibold">Stock Units</th>
                  <th className="px-5 py-4 font-semibold">Stock Status</th>
                  <th className="px-5 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product) => {
                  const low = product.stock <= product.reorderLevel;

                  return (
                    <tr key={product.id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            <Package size={20} />
                          </div>
                          <div>
                            <p className="font-semibold">{product.name}</p>
                            <p className="mt-1 text-xs text-slate-500">
                              {product.brand}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">{product.category}</td>
                      <td className="whitespace-nowrap px-5 py-4">{product.size}</td>
                      <td className="whitespace-nowrap px-5 py-4 font-semibold">
                        {money(product.price)}
                      </td>
                      <td className="px-5 py-4 font-semibold">{product.stock}</td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            low
                              ? "bg-amber-50 text-amber-700"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {low ? "Low Stock" : "In Stock"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => openEdit(product)}
                            title="Edit product"
                            className="rounded-md p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-700"
                          >
                            <Pencil size={17} />
                          </button>
                          <button
                            onClick={() => deleteProduct(product)}
                            title="Delete product"
                            className="rounded-md p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                      No products found. Try a different search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-100 px-5 py-4 text-xs text-slate-500">
            Demo inventory · Stock is shown as units, not cases.
            Changes reset when the page is refreshed.
          </div>
        </section>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 p-4">
          <form
            onSubmit={saveProduct}
            className="my-6 w-full max-w-xl rounded-2xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h2 className="text-lg font-bold">
                  {editingId !== null ? "Edit Product" : "Add New Product"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Enter product and stock details.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Close form"
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <Field label="Product Name">
                <input
                  required
                  maxLength={100}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="field"
                  placeholder="e.g. Cola"
                />
              </Field>

              <Field label="Brand">
                <input
                  required
                  maxLength={100}
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  className="field"
                  placeholder="Brand name"
                />
              </Field>

              <Field label="Category">
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="field"
                >
                  <option>Carbonated</option>
                  <option>Fruit Drink</option>
                  <option>Water</option>
                </select>
              </Field>

              <Field label="Pack Size">
                <input
                  required
                  maxLength={30}
                  value={form.size}
                  onChange={(e) => setForm({ ...form, size: e.target.value })}
                  className="field"
                  placeholder="e.g. 750 ml"
                />
              </Field>

              <Field label="Unit Price (₹)">
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="field"
                  placeholder="0.00"
                />
              </Field>

              <Field label="Stock Units">
                <input
                  required
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="field"
                  placeholder="0"
                />
              </Field>

              <Field label="Reorder Level">
                <input
                  required
                  type="number"
                  min="0"
                  step="1"
                  value={form.reorderLevel}
                  onChange={(e) =>
                    setForm({ ...form, reorderLevel: e.target.value })
                  }
                  className="field"
                />
              </Field>
            </div>

            {error && (
              <p role="alert" className="mx-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <div className="flex justify-end gap-3 border-t border-slate-100 p-5">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                {editingId !== null ? "Save Changes" : "Add Product"}
              </button>
            </div>
          </form>
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
