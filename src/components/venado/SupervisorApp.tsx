import { useState, useMemo } from "react";
import { Hop as Home, Users, ChartBar as BarChart3, Sparkles, Menu, Bell, Search, ChevronDown, Phone, Mail, Clock, MapPin, Plus, TriangleAlert as AlertTriangle, TrendingUp, Calendar, Download, Target, Timer, LogOut, Share2, CircleCheck as CheckCircle2, ArrowDown, ArrowUp, Shield, Activity, Network, FileText } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { useVenado } from "@/lib/venado-store";
import { VenadoLogo } from "./VenadoLogo";
import { generatePDFReport } from "@/lib/pdf-generator";

type STab = "dashboard" | "equipo" | "reportes" | "ia";

export function SupervisorApp() {
  const [tab, setTab] = useState<STab>("dashboard");
  return (
    <div className="min-h-screen bg-background pb-24">
      {tab === "dashboard" && <Dashboard />}
      {tab === "equipo" && <Equipo />}
      {tab === "reportes" && <Reportes />}
      {tab === "ia" && <IASoluciones />}
      <SBottomNav tab={tab} setTab={setTab} />
    </div>
  );
}

function SHeader() {
  const { logout } = useVenado();
  return (
    <div className="px-5 pt-6 pb-2 flex items-center justify-between">
      <button className="text-foreground"><Menu className="h-6 w-6" /></button>
      <VenadoLogo className="h-9 w-auto" />
      <div className="flex items-center gap-2">
        <button className="relative h-10 w-10 flex items-center justify-center text-primary">
          <Bell className="h-6 w-6" />
          <span className="absolute top-0 right-1 h-4 w-4 rounded-full bg-destructive text-[10px] text-white flex items-center justify-center font-bold">3</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold text-sm">JP</div>
          <div className="text-xs leading-tight">
            <div className="font-bold">Juan Pérez</div>
            <div className="text-muted-foreground">Supervisor</div>
          </div>
          <button onClick={logout}><LogOut className="h-4 w-4 text-muted-foreground" /></button>
        </div>
      </div>
    </div>
  );
}

// ============ DASHBOARD ============

function Dashboard() {
  return (
    <div>
      <SHeader />
      <div className="px-5 mt-2">
        <p className="text-sm text-muted-foreground">¡Buenos días!</p>
        <h1 className="text-2xl font-black text-foreground">Juan Pérez</h1>
        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-primary text-xs font-medium">
          <Calendar className="h-4 w-4" /> Lunes, 20 de mayo
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <KPI icon={<MapPin className="h-5 w-5" />} color="text-success" label="Cobertura actual" value="185 / 220" sub="PDV visitados" ring={84} />
          <KPI icon={<Users className="h-5 w-5" />} color="text-primary" label="Reponedores activos" value="18 / 20" sub="activos" />
          <KPI icon={<Clock className="h-5 w-5" />} color="text-[oklch(0.55_0.2_295)]" label="Tiempo promedio" value="24.3 min" sub="por visita" />
          <KPI icon={<Share2 className="h-5 w-5" />} color="text-warning" label="Distancia promedio" value="18.6 km" sub="recorridos" />
        </div>

        <h2 className="mt-6 font-bold text-foreground">Mapa de densidad de PDV - La Paz</h2>
        <HeatMap />

        <div className="mt-5 flex items-center justify-between">
          <h2 className="font-bold">Alertas inteligentes</h2>
          <button className="text-primary text-sm font-medium flex items-center gap-1">Ver todas</button>
        </div>
        <div className="mt-2 space-y-2">
          <Alert color="destructive" title="Juan Pérez" sub="35 min promedio (+7 min sobre lo esperado)" time="10:24 a. m." />
          <Alert color="warning" title="Zona Sur" sub="12 PDV pendientes" time="10:15 a. m." />
          <Alert color="warning" title="Ruta 5" sub="Sobrecarga operativa" time="09:58 a. m." />
          <Alert color="primary" title="Mayorista San José" sub="Inventario crítico" time="09:40 a. m." icon={<TrendingUp className="h-5 w-5" />} />
        </div>
      </div>
    </div>
  );
}

function KPI({ icon, color, label, value, sub, ring }: { icon: React.ReactNode; color: string; label: string; value: string; sub: string; ring?: number }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-3 relative">
      <div className={`h-9 w-9 rounded-full bg-current/10 flex items-center justify-center ${color}`} style={{ backgroundColor: "color-mix(in oklab, currentColor 12%, transparent)" }}>{icon}</div>
      <p className="text-xs text-muted-foreground mt-2">{label}</p>
      <p className="text-xl font-black text-foreground leading-tight">{value}</p>
      <p className="text-xs text-muted-foreground">{sub}</p>
      {ring !== undefined && (
        <div className="mt-2 flex items-center gap-2">
          <svg viewBox="0 0 36 36" className="h-9 w-9">
            <circle cx="18" cy="18" r="15" fill="none" stroke="oklch(0.92 0.015 255)" strokeWidth="4" />
            <circle cx="18" cy="18" r="15" fill="none" stroke="oklch(0.65 0.17 150)" strokeWidth="4" strokeDasharray={`${(ring / 100) * 94} 94`} strokeLinecap="round" transform="rotate(-90 18 18)" />
          </svg>
          <span className="text-success font-bold">{ring}%</span>
        </div>
      )}
    </div>
  );
}

function HeatMap() {
  const points = useMemo(() => {
    const out: { x: number; y: number; c: string; size: number }[] = [];
    const colors = ["oklch(0.7 0.18 145)", "oklch(0.75 0.17 60)", "oklch(0.65 0.22 25)"];
    for (let i = 0; i < 22; i++) {
      out.push({
        x: 20 + (i * 47) % 320,
        y: 30 + ((i * 73) % 170),
        c: colors[i % 3],
        size: 8 + (i % 3) * 3,
      });
    }
    return out;
  }, []);
  return (
    <div className="mt-3 rounded-2xl overflow-hidden relative h-64 bg-[oklch(0.18_0.05_220)]">
      <svg viewBox="0 0 360 240" className="absolute inset-0 w-full h-full">
        <defs>
          <radialGradient id="heat" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.8 0.2 60)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="oklch(0.8 0.2 60)" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* fake city grid */}
        <g stroke="oklch(0.35 0.1 220)" strokeWidth="0.5" opacity="0.5">
          {Array.from({ length: 15 }).map((_, i) => <line key={`h${i}`} x1="0" y1={i * 18} x2="360" y2={i * 18} />)}
          {Array.from({ length: 20 }).map((_, i) => <line key={`v${i}`} x1={i * 20} y1="0" x2={i * 20} y2="240" />)}
        </g>
        {/* heat blobs */}
        {points.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="34" fill="url(#heat)" opacity="0.6" />)}
        {points.map((p, i) => (
          <circle key={`p${i}`} cx={p.x} cy={p.y} r={p.size / 2} fill={p.c} stroke="white" strokeWidth="1.5" />
        ))}
        {/* center */}
        <circle cx="180" cy="120" r="14" fill="oklch(0.45 0.2 265)" stroke="white" strokeWidth="2" />
        <text x="180" y="124" textAnchor="middle" fill="white" fontSize="11" fontWeight="700">🏠</text>
        <text x="180" y="148" textAnchor="middle" fill="white" fontSize="13" fontWeight="700">La Paz</text>
        <text x="80" y="60" fill="white" fontSize="10" fontWeight="600">San Antonio</text>
        <text x="220" y="190" fill="white" fontSize="10" fontWeight="600">Obrajes</text>
        <text x="270" y="100" fill="white" fontSize="10" fontWeight="600">Miraflores</text>
        <text x="30" y="100" fill="white" fontSize="10" fontWeight="600">El Alto</text>
      </svg>
      <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur rounded-lg p-2 text-white text-[10px] space-y-1">
        <div className="font-bold">Leyenda</div>
        <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[oklch(0.7_0.18_145)]" /> PDV atendidos</div>
        <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[oklch(0.75_0.17_60)]" /> En proceso</div>
        <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[oklch(0.65_0.22_25)]" /> Pendientes</div>
      </div>
    </div>
  );
}

function Alert({ color, title, sub, time, icon }: { color: "destructive" | "warning" | "primary"; title: string; sub: string; time: string; icon?: React.ReactNode }) {
  const map = { destructive: "bg-destructive text-destructive-foreground", warning: "bg-warning text-foreground", primary: "bg-primary text-primary-foreground" };
  return (
    <div className="rounded-2xl bg-card border border-border p-3 flex items-center gap-3">
      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${map[color]}`}>{icon ?? <AlertTriangle className="h-5 w-5" />}</div>
      <div className="flex-1">
        <p className="font-bold text-sm">{title}</p>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
      <div className="text-xs text-muted-foreground">{time}</div>
    </div>
  );
}

// ============ EQUIPO ============

const team = [
  { id: "jp", name: "Juan Pérez", ruta: "Ruta Norte", status: "En ruta", color: "success", since: "Ene 2024", efic: 84, visits: 35, time: "24.3 min", km: "18.6 km", cumpl: 84 },
  { id: "al", name: "Ana López", ruta: "Ruta Sur", status: "En ruta", color: "success", since: "Mar 2024", efic: 78, visits: 28, time: "22.1 min", km: "16.2 km", cumpl: 80 },
  { id: "cr", name: "Carlos Rojas", ruta: "Ruta Este", status: "En pausa", color: "warning", since: "Feb 2024", efic: 70, visits: 20, time: "30.5 min", km: "20.1 km", cumpl: 71 },
  { id: "mg", name: "María González", ruta: "Ruta Centro", status: "En ruta", color: "success", since: "Dic 2023", efic: 90, visits: 38, time: "21.0 min", km: "15.8 km", cumpl: 92 },
];

function Equipo() {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState("jp");
  const filtered = team.filter(t => t.name.toLowerCase().includes(q.toLowerCase()));
  const u = team.find(t => t.id === sel)!;

  return (
    <div>
      <SHeader />
      <div className="px-5 mt-2">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-black">Equipo de reponedores</h1>
            <p className="text-sm text-muted-foreground">Gestión y desempeño de tu equipo en tiempo real</p>
          </div>
          <button className="px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1 shrink-0">
            <Plus className="h-4 w-4" /> Agregar
          </button>
        </div>

        <div className="mt-4 flex gap-4 border-b border-border">
          <button className="pb-2 border-b-2 border-primary text-primary font-medium text-sm">Lista del equipo</button>
          <button className="pb-2 text-muted-foreground text-sm">Mapa del equipo</button>
        </div>

        <div className="mt-3 flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar reponedor..." className="w-full h-10 pl-9 pr-3 rounded-lg border border-border bg-card text-sm" />
          </div>
        </div>

        <div className="mt-3 space-y-2">
          {filtered.map(m => (
            <button key={m.id} onClick={() => setSel(m.id)} className={`w-full text-left rounded-xl p-3 flex items-center gap-3 border ${sel === m.id ? "border-primary bg-accent/40" : "border-border bg-card"}`}>
              <div className="relative">
                <div className="h-11 w-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">{m.name.split(" ").map(n => n[0]).join("")}</div>
                <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card ${m.color === "success" ? "bg-success" : "bg-warning"}`} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm">{m.name}</p>
                <p className="text-xs text-muted-foreground">{m.ruta}</p>
                <p className={`text-xs font-medium ${m.color === "success" ? "text-success" : "text-warning"}`}>{m.status}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-5 rounded-2xl overflow-hidden border border-border">
          <div className="bg-primary p-4 flex items-center gap-3 text-primary-foreground">
            <div className="h-14 w-14 rounded-full bg-primary-foreground/20 flex items-center justify-center font-bold text-lg">{u.name.split(" ").map(n => n[0]).join("")}</div>
            <div className="flex-1">
              <p className="font-bold">{u.name}</p>
              <span className="text-xs px-2 py-0.5 rounded bg-success/20 text-success">{u.status}</span>
              <p className="text-xs mt-1">{u.ruta}</p>
              <p className="text-[10px] opacity-80">Reponedor desde: {u.since}</p>
            </div>
            <div className="text-center">
              <svg viewBox="0 0 36 36" className="h-14 w-14">
                <circle cx="18" cy="18" r="15" fill="none" stroke="oklch(1 0 0 / 0.2)" strokeWidth="4" />
                <circle cx="18" cy="18" r="15" fill="none" stroke="oklch(0.7 0.17 150)" strokeWidth="4" strokeDasharray={`${u.efic * 0.94} 94`} strokeLinecap="round" transform="rotate(-90 18 18)" />
                <text x="18" y="20" textAnchor="middle" fontSize="9" fontWeight="700" fill="white">{u.efic}%</text>
              </svg>
              <p className="text-[10px] mt-1">Eficiencia</p>
            </div>
          </div>
          <div className="bg-card grid grid-cols-4 gap-1 p-3 border-b border-border">
            <Mini icon={<Users className="h-4 w-4 text-primary" />} v={u.visits.toString()} l="Visitas hoy" />
            <Mini icon={<Clock className="h-4 w-4 text-[oklch(0.55_0.2_295)]" />} v={u.time} l="Prom. visita" />
            <Mini icon={<Share2 className="h-4 w-4 text-warning" />} v={u.km} l="Recorridos" />
            <Mini icon={<Shield className="h-4 w-4 text-success" />} v={`${u.cumpl}%`} l="Cumplimiento" />
          </div>
          <div className="bg-card p-4 space-y-3 text-sm">
            <p className="font-bold">Información personal</p>
            <Row icon={<Phone className="h-4 w-4" />} label="Teléfono" value="+506 8888 1234" />
            <Row icon={<Mail className="h-4 w-4" />} label="Correo" value="juan.perez@venadoroute.com" />
            <Row icon={<Clock className="h-4 w-4" />} label="Inicio de jornada" value="7:30 a. m." />
            <Row icon={<MapPin className="h-4 w-4" />} label="Última ubicación" value="Av. 6 de Agosto, La Paz" />

            <p className="font-bold pt-2">Desempeño de hoy</p>
            <Perf label="PDV visitados" value={`${u.visits} / 40`} pct={u.visits / 40 * 100} color="oklch(0.45 0.2 265)" />
            <Perf label="Cobertura" value={`${u.cumpl}%`} pct={u.cumpl} color="oklch(0.65 0.17 150)" />
            <Perf label="Cumplimiento de ruta" value="92%" pct={92} color="oklch(0.55 0.2 295)" />
            <Perf label="Evidencias enviadas" value="32 / 40" pct={80} color="oklch(0.75 0.17 60)" />

            <p className="font-bold pt-2">Últimas evidencias</p>
            <div className="flex gap-2">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-14 w-14 rounded-lg bg-gradient-to-br from-accent to-primary/30 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
              ))}
              <div className="h-14 w-14 rounded-lg bg-foreground text-background flex items-center justify-center text-xs font-bold">+12</div>
            </div>
            <button className="mt-2 w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold">Ver detalle completo</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Mini({ icon, v, l }: { icon: React.ReactNode; v: string; l: string }) {
  return (
    <div className="text-center">
      <div className="mx-auto h-8 w-8 rounded-full bg-accent flex items-center justify-center">{icon}</div>
      <p className="text-sm font-bold mt-1">{v}</p>
      <p className="text-[10px] text-muted-foreground">{l}</p>
    </div>
  );
}
function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-primary shrink-0">{icon}</div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
function Perf({ label, value, pct, color }: { label: string; value: string; pct: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span>{label}</span>
        <span className="font-bold">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-border overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

// ============ REPORTES ============

function Reportes() {
  const xbar = useMemo(() => Array.from({ length: 31 }, (_, i) => ({ d: i + 1, v: 20 + Math.sin(i * 0.7) * 6 + Math.cos(i * 0.3) * 4 + (Math.random() * 4) })), []);
  const sbar = useMemo(() => Array.from({ length: 31 }, (_, i) => ({ d: i + 1, v: 1.5 + Math.sin(i * 0.5) * 0.7 + Math.random() * 0.5 })), []);
  const dist = [{ b: "0-15", v: 18, c: "oklch(0.55 0.2 295)" }, { b: "15-30", v: 46, c: "oklch(0.45 0.2 265)" }, { b: "30-45", v: 24, c: "oklch(0.75 0.17 60)" }, { b: "45+", v: 12, c: "oklch(0.65 0.22 25)" }];
  const km = [{ b: "0-10 km", v: 28, c: "oklch(0.65 0.17 150)" }, { b: "10-20 km", v: 48, c: "oklch(0.45 0.2 265)" }, { b: "20-30 km", v: 18, c: "oklch(0.75 0.17 60)" }, { b: "30+ km", v: 6, c: "oklch(0.65 0.22 25)" }];

  const handleExportPDF = () => {
    const reportData = {
      date: "Lunes, 20 de mayo de 2024",
      supervisor: "Juan Pérez",
      metrics: [
        { label: "Tiempo traslado", value: "24.3 min", delta: "↑ +6.2%" },
        { label: "Distancia PDV", value: "18.6 km", delta: "↑ +5.1%" },
        { label: "PDV visitados", value: "35", delta: "↑ +3.4%" },
        { label: "Cumplimiento", value: "92%", delta: "↑ +4.7%" },
        { label: "Tiempo tienda", value: "12.1 min", delta: "↑ +4.3%" },
        { label: "Jornada", value: "8h 23m", delta: "↑ +3.8%" },
        { label: "Eficiencia", value: "84%", delta: "↑ +5.6%" },
        { label: "Desv. estándar", value: "1.32 min", delta: "↑ +9.1%" },
      ],
      teamPerformance: [
        { name: "Juan Pérez", route: "Ruta Norte", efficiency: 84, visits: 35, avgTime: "24.3 min", distance: "18.6 km", compliance: 84 },
        { name: "Ana López", route: "Ruta Sur", efficiency: 78, visits: 28, avgTime: "22.1 min", distance: "16.2 km", compliance: 80 },
        { name: "Carlos Rojas", route: "Ruta Este", efficiency: 70, visits: 20, avgTime: "30.5 min", distance: "20.1 km", compliance: 71 },
        { name: "María González", route: "Ruta Centro", efficiency: 90, visits: 38, avgTime: "21.0 min", distance: "15.8 km", compliance: 92 },
      ],
      alerts: [
        { type: "critical" as const, title: "Juan Pérez", description: "35 min promedio (+7 min sobre lo esperado)", time: "10:24 a. m." },
        { type: "warning" as const, title: "Zona Sur", description: "12 PDV pendientes", time: "10:15 a. m." },
        { type: "warning" as const, title: "Ruta 5", description: "Sobrecarga operativa", time: "09:58 a. m." },
        { type: "info" as const, title: "Mayorista San José", description: "Inventario crítico", time: "09:40 a. m." },
      ],
    };

    generatePDFReport(reportData);
  };

  return (
    <div>
      <SHeader />
      <div className="px-5 mt-2">
        <h1 className="text-2xl font-black">Reportes</h1>
        <p className="text-sm text-muted-foreground">Datos relevantes para BI y toma de decisiones</p>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          <Pill icon={<Calendar className="h-3.5 w-3.5" />} label="13 - 20 May, 2024" />
          <Pill icon={<Users className="h-3.5 w-3.5" />} label="Todos los reponedores" />
          <Pill icon={<MapPin className="h-3.5 w-3.5" />} label="Todas las rutas" />
          <button
            onClick={handleExportPDF}
            className="shrink-0 inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md hover:bg-primary/90 transition-colors"
          >
            <FileText className="h-3.5 w-3.5" /> Exportar PDF
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <RKPI icon={<Clock className="h-5 w-5" />} color="oklch(0.55 0.2 295)" label="Tiempo de traslado promedio" value="24.3 min" delta="+6.2%" />
          <RKPI icon={<Share2 className="h-5 w-5" />} color="oklch(0.75 0.17 60)" label="Distancia entre PDVs promedio" value="18.6 km" delta="+5.1%" />
          <RKPI icon={<MapPin className="h-5 w-5" />} color="oklch(0.45 0.2 265)" label="PDV visitados promedio" value="35" delta="+3.4%" />
          <RKPI icon={<Shield className="h-5 w-5" />} color="oklch(0.65 0.17 150)" label="Cumplimiento de ruta promedio" value="92%" delta="+4.7%" />
          <RKPI icon={<Timer className="h-5 w-5" />} color="oklch(0.65 0.22 25)" label="Tiempo en tienda promedio" value="12.1 min" delta="+4.3%" />
          <RKPI icon={<MapPin className="h-5 w-5" />} color="oklch(0.75 0.17 60)" label="Inicio - Fin de jornada" value="8h 23m" delta="+3.8%" />
          <RKPI icon={<Target className="h-5 w-5" />} color="oklch(0.65 0.17 150)" label="Eficiencia del equipo" value="84%" delta="+5.6%" />
          <RKPI icon={<TrendingUp className="h-5 w-5" />} color="oklch(0.55 0.2 295)" label="Desviación estándar tiempos" value="1.32 min" delta="+9.1%" />
        </div>

        <div className="mt-5 rounded-2xl bg-card border border-border p-3">
          <p className="text-sm font-bold mb-2">Gráfico de Control de Medias (X̄)</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={xbar}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.015 255)" />
                <XAxis dataKey="d" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 50]} tick={{ fontSize: 10 }} />
                <Tooltip />
                <ReferenceLine y={42} stroke="oklch(0.65 0.22 25)" />
                <ReferenceLine y={5} stroke="oklch(0.65 0.22 25)" />
                <ReferenceLine y={23} stroke="oklch(0.65 0.17 150)" />
                <Line type="monotone" dataKey="v" stroke="oklch(0.45 0.2 265)" strokeWidth={2} dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-3 rounded-2xl bg-card border border-border p-3">
          <p className="text-sm font-bold mb-2">Gráfico de Control de Desviación Estándar (S)</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sbar}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.015 255)" />
                <XAxis dataKey="d" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 4]} tick={{ fontSize: 10 }} />
                <Tooltip />
                <ReferenceLine y={3} stroke="oklch(0.65 0.22 25)" />
                <ReferenceLine y={0.2} stroke="oklch(0.65 0.22 25)" />
                <ReferenceLine y={1.6} stroke="oklch(0.65 0.17 150)" />
                <Line type="monotone" dataKey="v" stroke="oklch(0.45 0.2 265)" strokeWidth={2} dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <HBar title="Distribución de tiempos (minutos)" data={dist} />
        <HBar title="Distancia entre PDVs (km)" data={km} />
      </div>
    </div>
  );
}

function Pill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card text-xs">
      {icon} {label} <ChevronDown className="h-3 w-3" />
    </button>
  );
}
function RKPI({ icon, color, label, value, delta }: { icon: React.ReactNode; color: string; label: string; value: string; delta: string }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-3">
      <div className="h-9 w-9 rounded-full flex items-center justify-center" style={{ backgroundColor: `color-mix(in oklab, ${color} 15%, transparent)`, color }}>{icon}</div>
      <p className="text-xs text-muted-foreground mt-2 leading-tight">{label}</p>
      <p className="text-xl font-black mt-1">{value}</p>
      <p className="text-[10px] text-success mt-1">↑ {delta} vs semana anterior</p>
    </div>
  );
}
function HBar({ title, data }: { title: string; data: { b: string; v: number; c: string }[] }) {
  return (
    <div className="mt-3 rounded-2xl bg-card border border-border p-3">
      <p className="text-sm font-bold mb-2">{title}</p>
      <div className="space-y-2">
        {data.map(d => (
          <div key={d.b} className="flex items-center gap-2 text-xs">
            <span className="w-16 text-muted-foreground">{d.b}</span>
            <div className="flex-1 h-5 rounded bg-border overflow-hidden">
              <div className="h-full rounded" style={{ width: `${d.v}%`, backgroundColor: d.c }} />
            </div>
            <span className="w-10 text-right font-bold">{d.v}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ IA SOLUCIONES ============

function IASoluciones() {
  return (
    <div>
      <SHeader />
      <div className="px-5 mt-2">
        <h1 className="text-2xl font-black">IA Soluciones</h1>
        <p className="text-sm text-muted-foreground">Recomendaciones inteligentes generadas por IA para mejorar el desempeño de tus rutas.</p>

        <div className="mt-4 rounded-2xl bg-card border border-border p-4 flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-[oklch(0.94_0.06_295)] flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-[oklch(0.55_0.2_295)]" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Resumen IA del día</p>
            <p className="font-bold">2 recomendaciones activas</p>
            <p className="text-[10px] text-muted-foreground">Generadas automáticamente por IA predictiva</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div><p className="text-xl font-black text-destructive">1</p><p className="text-[10px] text-destructive">Crítica</p></div>
            <div><p className="text-xl font-black text-warning">1</p><p className="text-[10px] text-warning">Preventiva</p></div>
            <div><p className="text-xl font-black text-success">0</p><p className="text-[10px] text-success">Informativa</p></div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-card border border-border p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-[oklch(0.94_0.06_295)] flex items-center justify-center"><Network className="h-6 w-6 text-[oklch(0.55_0.2_295)]" /></div>
              <h3 className="font-bold text-lg">1. Optimización de cobertura</h3>
            </div>
            <span className="px-2 py-1 rounded-md bg-destructive/15 text-destructive text-[10px] font-bold">CRÍTICA</span>
          </div>
          <div className="mt-3 grid md:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center gap-2 text-foreground"><AlertTriangle className="h-4 w-4 text-warning" /><p className="font-bold text-sm">Problema detectado</p></div>
              <p className="text-xs text-muted-foreground mt-1">La Ruta Norte presenta sobrecarga operativa respecto al promedio del equipo.</p>
              <div className="mt-3 flex items-center gap-2 text-success"><CheckCircle2 className="h-4 w-4" /><p className="font-bold text-sm">Acción sugerida</p></div>
              <p className="text-xs text-muted-foreground mt-1">Mover <b>3 PDV</b> de Juan Pérez a Ana López.</p>
              <button className="mt-3 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold">Ver simulación →</button>
            </div>
            <div className="rounded-xl bg-accent/40 p-3 space-y-2">
              <p className="text-xs font-bold">Impacto estimado</p>
              <Impact icon={<Share2 className="h-4 w-4" />} dir="down" value="12 km" label="menos recorridos" />
              <Impact icon={<Clock className="h-4 w-4" />} dir="down" value="45 min" label="menos de traslado" />
              <Impact icon={<TrendingUp className="h-4 w-4" />} dir="up" value="8%" label="más cobertura" />
              <Impact icon={<Activity className="h-4 w-4" />} dir="up" value="5%" label="más productividad" />
            </div>
          </div>
          <p className="mt-3 text-[10px] text-muted-foreground flex items-center gap-1"><Sparkles className="h-3 w-3" /> Generado automáticamente mediante DSS + IA predictiva</p>
        </div>

        <div className="mt-4 rounded-2xl bg-card border border-border p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center"><Shield className="h-6 w-6 text-destructive" /></div>
              <h3 className="font-bold text-lg">2. Riesgo de incumplimiento</h3>
            </div>
            <span className="px-2 py-1 rounded-md bg-warning/20 text-warning text-[10px] font-bold">PREVENTIVA</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-destructive/5 p-3 text-center">
              <p className="text-xs text-destructive flex items-center justify-center gap-1"><MapPin className="h-3 w-3" /> Ruta Sur</p>
              <p className="text-xs mt-1">Probabilidad de incumplimiento</p>
              <div className="relative mx-auto mt-2 h-20 w-20">
                <svg viewBox="0 0 36 36" className="h-full w-full">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="oklch(0.92 0.015 255)" strokeWidth="4" />
                  <circle cx="18" cy="18" r="15" fill="none" stroke="oklch(0.6 0.22 25)" strokeWidth="4" strokeDasharray={`${0.87 * 94} 94`} strokeLinecap="round" transform="rotate(-90 18 18)" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-destructive font-black">87%</div>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold">Motivos detectados por IA</p>
              <ul className="mt-1 text-xs text-muted-foreground space-y-1 list-disc pl-4">
                <li>Tráfico histórico elevado</li>
                <li>Exceso de visitas programadas</li>
                <li>Tiempos promedio superiores al estándar</li>
              </ul>
              <div className="mt-2 flex items-center gap-1 text-success text-xs"><CheckCircle2 className="h-3 w-3" /><b>Acción recomendada</b></div>
              <p className="text-xs text-muted-foreground">Reducir <b>2 PDV</b> para la jornada de mañana.</p>
              <button className="mt-2 w-full h-9 rounded-xl bg-primary text-primary-foreground text-xs font-bold">Ver impacto →</button>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-card border border-border p-4">
          <p className="font-bold text-sm">Impacto acumulado esperado</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Imp color="oklch(0.55 0.2 295)" icon={<Share2 className="h-4 w-4" />} value="67 km" label="ahorrados" />
            <Imp color="oklch(0.45 0.2 265)" icon={<Clock className="h-4 w-4" />} value="4.3 h" label="recuperadas" />
            <Imp color="oklch(0.65 0.17 150)" icon={<TrendingUp className="h-4 w-4" />} value="+11%" label="cobertura" />
            <Imp color="oklch(0.75 0.17 60)" icon={<Activity className="h-4 w-4" />} value="+9%" label="productividad" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Impact({ icon, dir, value, label }: { icon: React.ReactNode; dir: "up" | "down"; value: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="h-7 w-7 rounded-full bg-card flex items-center justify-center text-primary">{icon}</div>
      {dir === "down" ? <ArrowDown className="h-4 w-4 text-success" /> : <ArrowUp className="h-4 w-4 text-success" />}
      <span className="font-bold">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
function Imp({ color, icon, value, label }: { color: string; icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="rounded-xl p-3 flex items-center gap-3" style={{ backgroundColor: `color-mix(in oklab, ${color} 12%, transparent)` }}>
      <div className="h-9 w-9 rounded-full flex items-center justify-center" style={{ backgroundColor: `color-mix(in oklab, ${color} 25%, transparent)`, color }}>{icon}</div>
      <div>
        <p className="font-black text-lg leading-none" style={{ color }}>{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

// ============ BOTTOM NAV ============

function SBottomNav({ tab, setTab }: { tab: STab; setTab: (t: STab) => void }) {
  const items: { k: STab; label: string; icon: React.ReactNode }[] = [
    { k: "dashboard", label: "Dashboard", icon: <Home className="h-5 w-5" /> },
    { k: "equipo", label: "Equipo", icon: <Users className="h-5 w-5" /> },
    { k: "reportes", label: "Reportes", icon: <BarChart3 className="h-5 w-5" /> },
    { k: "ia", label: "IA Soluciones", icon: <Sparkles className="h-5 w-5" /> },
  ];
  return (
    <div className="fixed bottom-0 inset-x-0 bg-card border-t border-border z-20">
      <div className="grid grid-cols-4 px-2 py-2 pb-3">
        {items.map(i => {
          const active = tab === i.k;
          return (
            <button key={i.k} onClick={() => setTab(i.k)} className={`flex flex-col items-center gap-1 py-1 ${active ? "text-primary" : "text-muted-foreground"}`}>
              {i.icon}
              <span className="text-[10px] font-medium">{i.label}</span>
              {active && <div className="h-0.5 w-6 bg-primary rounded-full" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
