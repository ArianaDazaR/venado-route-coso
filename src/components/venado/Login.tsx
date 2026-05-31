import { useState } from "react";
import { Lock, User, Eye, EyeOff, ArrowRight, Shield, Wifi, Circle as HelpCircle } from "lucide-react";
import { useVenado } from "@/lib/venado-store";
import { VenadoLogo } from "./VenadoLogo";
import { InstructionModal } from "./InstructionModal";

export function Login() {
  const { login } = useVenado();
  const [id, setId] = useState("");
  const [pwd, setPwd] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [showHelp, setShowHelp] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!login(id.trim(), pwd)) setErr("Credenciales inválidas. Prueba SV-1234/4321 o RV-1234/1234");
  };

  return (
    <>
      <div className="relative min-h-screen w-full overflow-hidden bg-background flex flex-col">
        {/* Help button */}
        <button
          onClick={() => setShowHelp(true)}
          className="absolute top-4 right-4 z-10 h-9 w-9 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
          title="Ayuda"
        >
          <HelpCircle className="h-5 w-5" />
        </button>

        <div className="flex-1 px-6 pt-10 pb-6 flex flex-col">
          <div className="flex flex-col items-center">
            <VenadoLogo className="h-20 w-auto" />
            <div className="flex items-center gap-3 mt-3">
              <div className="h-px w-8 bg-primary/40" />
              <p className="text-sm text-primary/80 font-medium tracking-wide">Optimización inteligente de cobertura</p>
              <div className="h-px w-8 bg-primary/40" />
            </div>
          </div>

          <div className="mt-8 text-center">
            <h1 className="text-3xl font-bold text-primary">¡Bienvenido!</h1>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">Ingresa tus credenciales para acceder<br />a la plataforma.</p>
          </div>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <div>
              <label className="text-xs font-bold tracking-wider text-primary">ID DE COLABORADOR</label>
              <div className="mt-2 relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/60" />
                <input value={id} onChange={e => setId(e.target.value)} placeholder="Ej: RV-1234"
                  className="w-full h-14 pl-12 pr-4 rounded-xl border-2 border-primary/20 bg-card text-foreground placeholder:text-muted-foreground focus:border-primary outline-none transition" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold tracking-wider text-primary">CONTRASEÑA</label>
              <div className="mt-2 relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/60" />
                <input value={pwd} onChange={e => setPwd(e.target.value)} type={show ? "text" : "password"} placeholder="Ingresa tu contraseña"
                  className="w-full h-14 pl-12 pr-12 rounded-xl border-2 border-primary/20 bg-card text-foreground placeholder:text-muted-foreground focus:border-primary outline-none transition" />
                <button type="button" onClick={() => setShow(s => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/60">
                  {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-foreground">
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-primary" />
                Recordar mi ID
              </label>
              <a className="text-primary font-medium">¿Olvidaste tu contraseña?</a>
            </div>

            {err && <p className="text-sm text-destructive">{err}</p>}

            <button type="submit" className="w-full h-14 rounded-xl bg-primary text-primary-foreground font-bold tracking-wider flex items-center justify-center gap-3 shadow-lg shadow-primary/20 active:scale-[0.99] transition">
              INGRESAR <ArrowRight className="h-5 w-5" />
            </button>
          </form>

          <div className="mt-6 rounded-2xl bg-accent/60 p-4 flex items-start gap-3">
            <div className="h-12 w-12 rounded-full bg-card flex items-center justify-center shrink-0">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-primary">Acceso seguro</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mt-1">Cada usuario visualizará únicamente las herramientas correspondientes a su rol.</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border flex items-start gap-3">
            <Wifi className="h-5 w-5 text-primary mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">Funciona en línea y sincroniza automáticamente cuando existe conexión.</p>
          </div>
        </div>

        <div className="relative h-24 -mb-px">
          <div className="absolute inset-x-0 bottom-0 h-20 bg-primary rounded-t-[60%]" />
          <div className="absolute inset-x-0 bottom-2 flex items-center justify-center gap-2 text-primary-foreground">
            <VenadoLogo className="h-6 w-auto" mono />
            <div className="text-xs">
              <div className="font-bold">Grupo Venado</div>
              <div className="opacity-80">Juntos llegamos más lejos</div>
            </div>
          </div>
        </div>
      </div>

      <InstructionModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </>
  );
}
