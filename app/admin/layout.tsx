import NavAdmin from "@/components/NavAdmin";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <NavAdmin />
      <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
