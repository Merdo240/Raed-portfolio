import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import GroupsManager from "./groups/GroupsManager";

export default async function AdminPage() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-[#F5F8FC]">

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>
            <h1 className="text-xl font-bold text-[#071A2F]">
              RAED
            </h1>

            <p className="text-xs tracking-widest text-[#00B8D9]">
              ADMIN PANEL
            </p>
          </div>

          <div className="text-right">

            <p className="text-sm font-medium text-[#071A2F]">
              {admin.email}
            </p>

            <p className="text-xs text-[#5B6B7F]">
              {admin.role}
            </p>

          </div>

        </div>
      </header>


      <section className="mx-auto max-w-7xl px-6 py-12">

        <h2 className="text-3xl font-bold text-[#071A2F]">
          Dashboard
        </h2>

      
        <p className="mt-2 text-[#5B6B7F]">
          Welcome to the RAED portfolio administration panel.
        </p>


        <div className="mt-10 grid gap-6 md:grid-cols-3">

          <div className="rounded-xl bg-white p-6 shadow-sm">

            <p className="text-sm text-[#5B6B7F]">
              Portfolio Groups
            </p>

            <p className="mt-2 text-3xl font-bold text-[#071A2F]">
              —
            </p>

          </div>


          <div className="rounded-xl bg-white p-6 shadow-sm">

            <p className="text-sm text-[#5B6B7F]">
              Images
            </p>

            <p className="mt-2 text-3xl font-bold text-[#071A2F]">
              —
            </p>

          </div>


          <div className="rounded-xl bg-white p-6 shadow-sm">

            <p className="text-sm text-[#5B6B7F]">
              Admin
            </p>

            <p className="mt-2 text-3xl font-bold text-[#071A2F]">
              1
            </p>

          </div>

        </div>

      </section>
      
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <GroupsManager />
      </section>  

    </main>
  );
}