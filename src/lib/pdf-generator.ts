// PDF generation utility using browser's print functionality
// This creates a clean, printable report without external dependencies

export interface ReportData {
  date: string;
  supervisor: string;
  metrics: {
    label: string;
    value: string;
    delta?: string;
  }[];
  teamPerformance: {
    name: string;
    route: string;
    efficiency: number;
    visits: number;
    avgTime: string;
    distance: string;
    compliance: number;
  }[];
  alerts: {
    type: "critical" | "warning" | "info";
    title: string;
    description: string;
    time: string;
  }[];
}

export function generatePDFReport(data: ReportData) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Por favor, permite las ventanas emergentes para generar el reporte.");
    return;
  }

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reporte Diario - Venado Route</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #1a1a2e;
      background: #fff;
      padding: 40px;
    }

    @media print {
      body { padding: 20px; }
      .no-print { display: none; }
      @page { margin: 1cm; }
    }

    .header {
      border-bottom: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 3px solid #2d3a8c;
    }

    .logo-section h1 {
      font-size: 28px;
      font-weight: 900;
      color: #2d3a8c;
      letter-spacing: 1px;
    }

    .logo-section .subtitle {
      font-size: 14px;
      color: #666;
      font-weight: 600;
      letter-spacing: 3px;
      margin-top: 4px;
    }

    .report-info {
      text-align: right;
    }

    .report-info h2 {
      font-size: 18px;
      color: #2d3a8c;
      margin-bottom: 8px;
    }

    .report-info p {
      font-size: 12px;
      color: #666;
    }

    .section {
      margin-bottom: 30px;
    }

    .section-title {
      font-size: 16px;
      font-weight: 700;
      color: #2d3a8c;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e5e7eb;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
      margin-bottom: 25px;
    }

    .metric-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 15px;
      text-align: center;
    }

    .metric-label {
      font-size: 11px;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }

    .metric-value {
      font-size: 24px;
      font-weight: 800;
      color: #2d3a8c;
      margin-bottom: 4px;
    }

    .metric-delta {
      font-size: 10px;
      color: #10b981;
      font-weight: 600;
    }

    .metric-delta.negative {
      color: #ef4444;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }

    table th {
      background: #2d3a8c;
      color: white;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 12px 8px;
      text-align: left;
    }

    table td {
      padding: 12px 8px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 12px;
    }

    table tr:nth-child(even) {
      background: #f8fafc;
    }

    .efficiency-bar {
      height: 8px;
      background: #e2e8f0;
      border-radius: 4px;
      overflow: hidden;
      width: 100%;
      max-width: 100px;
    }

    .efficiency-fill {
      height: 100%;
      background: #10b981;
      border-radius: 4px;
    }

    .alert {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 10px;
    }

    .alert.critical {
      background: #fef2f2;
      border-left: 4px solid #ef4444;
    }

    .alert.warning {
      background: #fffbeb;
      border-left: 4px solid #f59e0b;
    }

    .alert.info {
      background: #eff6ff;
      border-left: 4px solid #3b82f6;
    }

    .alert-icon {
      font-size: 16px;
      font-weight: bold;
      min-width: 24px;
      text-align: center;
    }

    .alert.critical .alert-icon { color: #ef4444; }
    .alert.warning .alert-icon { color: #f59e0b; }
    .alert.info .alert-icon { color: #3b82f6; }

    .alert-content h4 {
      font-size: 13px;
      font-weight: 700;
      color: #1a1a2e;
      margin-bottom: 4px;
    }

    .alert-content p {
      font-size: 11px;
      color: #64748b;
    }

    .alert-time {
      font-size: 10px;
      color: #94a3b8;
      margin-left: auto;
      white-space: nowrap;
    }

    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      color: #64748b;
      font-size: 11px;
    }

    .footer p {
      margin-bottom: 5px;
    }

    .print-button {
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: #2d3a8c;
      color: white;
      border: none;
      padding: 15px 30px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(45, 58, 140, 0.3);
    }

    .print-button:hover {
      background: #1e2868;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo-section">
      <h1>VENADO</h1>
      <div class="subtitle">ROUTE PLANNER</div>
    </div>
    <div class="report-info">
      <h2>Reporte Diario de Desempeño</h2>
      <p><strong>Fecha:</strong> ${data.date}</p>
      <p><strong>Supervisor:</strong> ${data.supervisor}</p>
      <p><strong>Generado:</strong> ${new Date().toLocaleString("es-BO")}</p>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Métricas Principales</div>
    <div class="metrics-grid">
      ${data.metrics.map(m => `
        <div class="metric-card">
          <div class="metric-label">${m.label}</div>
          <div class="metric-value">${m.value}</div>
          ${m.delta ? `<div class="metric-delta">${m.delta}</div>` : ""}
        </div>
      `).join("")}
    </div>
  </div>

  <div class="section">
    <div class="section-title">Rendimiento del Equipo</div>
    <table>
      <thead>
        <tr>
          <th>Reponedor</th>
          <th>Ruta</th>
          <th>Eficiencia</th>
          <th>Visitas</th>
          <th>Tiempo Prom.</th>
          <th>Distancia</th>
          <th>Cumplimiento</th>
        </tr>
      </thead>
      <tbody>
        ${data.teamPerformance.map(p => `
          <tr>
            <td><strong>${p.name}</strong></td>
            <td>${p.route}</td>
            <td>
              <div style="display: flex; align-items: center; gap: 8px;">
                <div class="efficiency-bar">
                  <div class="efficiency-fill" style="width: ${p.efficiency}%;"></div>
                </div>
                <span>${p.efficiency}%</span>
              </div>
            </td>
            <td>${p.visits}</td>
            <td>${p.avgTime}</td>
            <td>${p.distance}</td>
            <td><strong>${p.compliance}%</strong></td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  </div>

  ${data.alerts.length > 0 ? `
  <div class="section">
    <div class="section-title">Alertas del Día</div>
    ${data.alerts.map(a => `
      <div class="alert ${a.type}">
        <div class="alert-icon">${a.type === "critical" ? "!" : a.type === "warning" ? "⚠" : "ℹ"}</div>
        <div class="alert-content">
          <h4>${a.title}</h4>
          <p>${a.description}</p>
        </div>
        <div class="alert-time">${a.time}</div>
      </div>
    `).join("")}
  </div>
  ` : ""}

  <div class="footer">
    <p><strong>Venado Route Planner</strong> — Optimización inteligente de cobertura</p>
    <p>Grupo Venado — Juntos llegamos más lejos</p>
    <p style="margin-top: 10px; color: #94a3b8;">Este reporte fue generado automáticamente por el sistema de gestión de rutas.</p>
  </div>

  <button class="print-button no-print" onclick="window.print()">🖨 Imprimir / Guardar PDF</button>

  <script>
    // Auto-trigger print dialog after a short delay
    setTimeout(() => {
      // Optional: uncomment to auto-print
      // window.print();
    }, 500);
  </script>
</body>
</html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
