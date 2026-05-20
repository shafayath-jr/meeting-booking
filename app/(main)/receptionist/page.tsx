import { getAllBuildings } from "@/actions/building";
import { Building } from "@/types/building";
import { ClipboardList } from "lucide-react";
import ReceptionistView from "./components/receptionist-view";

export default async function ReceptionistPage() {
  const { buildings } = await getAllBuildings();

  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="animate-fade-in-up mb-8 flex items-center gap-5">
          <div>
            <p className="mb-0.5 text-[10px] font-semibold tracking-[0.22em] text-white/35 uppercase">
              Receptionist
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-secondary">
              Book a Meeting Room
            </h2>
          </div>
          <div className="h-px flex-1 bg-white/10" />
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2.5">
            <ClipboardList className="h-5 w-5 text-emerald-400" />
          </div>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: "120ms" }}>
          <ReceptionistView buildings={(buildings as Building[]) ?? []} />
        </div>
      </div>
    </div>
  );
}
