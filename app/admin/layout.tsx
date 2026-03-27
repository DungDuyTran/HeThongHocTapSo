import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-64 shrink-0 min-h-screen sticky top-0 z-50 bg-slate-900 shadow-2xl">
        <AdminSidebar />
      </aside>
      
      <main className="flex-1 p-8">
        <div className="max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}