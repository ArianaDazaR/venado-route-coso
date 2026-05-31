import { X, User, Shield, MapPin, ClipboardList, Camera, CircleCheck as CheckCircle, Smartphone, Wifi } from "lucide-react";

interface InstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InstructionModal({ isOpen, onClose }: InstructionModalProps) {
  if (!isOpen) return null;

  const sections = [
    {
      icon: <User className="h-5 w-5" />,
      title: "Roles de Usuario",
      content: [
        "RV-XXXX: Reponedor (contraseña: 1234)",
        "SV-XXXX: Supervisor (contraseña: 4321)",
      ],
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "Reponedor - Mi Ruta",
      content: [
        "Visualiza tu ruta optimizada del día",
        "Consulta el mapa con todas las paradas",
        "Los datos se sincronizan automáticamente",
      ],
    },
    {
      icon: <ClipboardList className="h-5 w-5" />,
      title: "Reponedor - Visitas",
      content: [
        "Inicia cada visita en orden secuencial",
        "Completa las 5 microtareas por visita",
        "Toma evidencias fotográficas cuando sea requerido",
      ],
    },
    {
      icon: <Camera className="h-5 w-5" />,
      title: "Evidencias y Tareas",
      content: [
        "Tareas 1 y 4 requieren foto obligatoria",
        "El tiempo se registra automáticamente",
        "Completa el inventario en la tarea 5",
      ],
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Supervisor - Dashboard",
      content: [
        "Monitorea el equipo en tiempo real",
        "Revisa alertas inteligentes del sistema",
        "Visualiza la densidad de PDV en el mapa",
      ],
    },
    {
      icon: <CheckCircle className="h-5 w-5" />,
      title: "Supervisor - Reportes",
      content: [
        "Accede a métricas de rendimiento",
        "Exporta informes en PDF",
        "Revisa gráficos de control de calidad",
      ],
    },
    {
      icon: <Smartphone className="h-5 w-5" />,
      title: "Funcionalidades",
      content: [
        "Funciona offline con sincronización automática",
        "Interfaz optimizada para dispositivos móviles",
        "Notificaciones en tiempo real",
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md max-h-[85vh] overflow-y-auto bg-card rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xl font-bold text-primary">?</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Guía de Uso</h2>
              <p className="text-xs text-muted-foreground">Venado Route Planner</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-accent flex items-center justify-center text-muted-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Introduction */}
          <div className="rounded-xl bg-accent/40 p-4">
            <div className="flex items-start gap-3">
              <Wifi className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-bold text-foreground">Aplicación Web Progresiva</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Sistema de gestión de rutas y cobertura para reponedores y supervisores.
                  Funciona en línea y sincroniza automáticamente.
                </p>
              </div>
            </div>
          </div>

          {/* Sections */}
          {sections.map((section, idx) => (
            <div key={idx} className="rounded-xl bg-background border border-border p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {section.icon}
                </div>
                <h3 className="font-bold text-foreground">{section.title}</h3>
              </div>
              <ul className="space-y-1.5 ml-10">
                {section.content.map((item, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Footer */}
          <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 text-center">
            <p className="text-xs text-muted-foreground">
              ¿Necesitas más ayuda? Contacta a tu supervisor o al equipo de soporte.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
