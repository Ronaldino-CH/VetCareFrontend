import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import vetcoreLogo from "../assets/vetcore.png";
import { moduleServices } from "../services";
import { formatDateTime12, resolveFieldValue } from "../utils/format";

function fullName(entity) {
  if (!entity) return "-";
  const names = [resolveFieldValue(entity, "Nombres"), resolveFieldValue(entity, "Apellidos")]
    .filter(Boolean)
    .join(" ")
    .trim();
  return names || resolveFieldValue(entity, "UserName") || "-";
}

function read(value) {
  return value === undefined || value === null || value === "" ? "-" : value;
}

async function toDataUrl(src) {
  const response = await fetch(src);
  const blob = await response.blob();

  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function drawSection(doc, { title, rows, x, y, w }) {
  const valueX = x + 34;
  const valueWidth = w - 37;
  const lineHeight = 4.6;
  const minRowHeight = 5.8;

  const parsedRows = rows.map((row) => {
    const valueLines = doc.splitTextToSize(String(row.value || "-"), valueWidth);
    const lines = Array.isArray(valueLines) && valueLines.length ? valueLines : ["-"];
    const rowHeight = Math.max(minRowHeight, lines.length * lineHeight + 1);
    return { label: row.label, lines, rowHeight };
  });

  const bodyHeight = parsedRows.reduce((sum, row) => sum + row.rowHeight, 0);
  const sectionHeight = Math.max(30, 13 + bodyHeight + 3);

  doc.setDrawColor(220, 230, 243);
  doc.setFillColor(248, 251, 255);
  doc.roundedRect(x, y, w, sectionHeight, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(30, 58, 138);
  doc.text(title.toUpperCase(), x + 3, y + 6);

  let rowY = y + 12.5;
  parsedRows.forEach((row) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text(`${row.label}:`, x + 3, rowY);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    doc.text(row.lines, valueX, rowY);
    rowY += row.rowHeight;
  });

  return sectionHeight;
}

function drawObservations(doc, text, y) {
  doc.setDrawColor(220, 230, 243);
  doc.setFillColor(248, 251, 255);
  doc.roundedRect(15, y, 180, 42, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(30, 58, 138);
  doc.text("5) OBSERVACIONES", 18, y + 7);

  doc.setDrawColor(220, 230, 243);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(18, y + 10, 174, 28, 2, 2, "FD");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  const wrapped = doc.splitTextToSize(String(text || "-"), 168);
  doc.text(wrapped, 21, y + 16);
}

async function downloadVetPdf(report) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const logoData = await toDataUrl(vetcoreLogo);

  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 210, 297, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(19);
  doc.setTextColor(15, 47, 95);
  doc.text("VetCare", 15, 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105);
  doc.text("Clinica Veterinaria", 15, 24);

  doc.addImage(logoData, "PNG", 168, 10, 28, 28);

  doc.setDrawColor(219, 229, 242);
  doc.setLineWidth(0.7);
  doc.line(15, 40, 195, 40);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.setTextColor(15, 47, 95);
  doc.text(report.documentTitle, 105, 50, { align: "center" });

  const topY = 56;
  const gap = 6;

  const sec1Height = drawSection(doc, { title: "1) Datos de la Mascota", rows: report.petRows, x: 15, y: topY, w: 87 });
  const sec2Height = drawSection(doc, { title: "2) Propietario", rows: report.ownerRows, x: 108, y: topY, w: 87 });
  const row1Height = Math.max(sec1Height, sec2Height);

  const secondRowY = topY + row1Height + gap;
  const sec3Height = drawSection(doc, { title: "3) Veterinario", rows: report.vetRows, x: 15, y: secondRowY, w: 87 });
  const sec4Height = drawSection(doc, { title: report.infoTitle, rows: report.infoRows, x: 108, y: secondRowY, w: 87 });
  const row2Height = Math.max(sec3Height, sec4Height);

  const observationsY = secondRowY + row2Height + gap;
  drawObservations(doc, report.observations, observationsY);

  doc.setDrawColor(220, 230, 243);
  doc.line(15, 270, 195, 270);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text("VetCare", 15, 276);
  doc.text(`Fecha de generacion: ${report.generatedAt}`, 195, 276, { align: "right" });

  doc.save(report.fileName);
}

function FloatingDetailModal({ moduleKey, id, onClose }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [detail, setDetail] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        if (moduleKey === "citas") {
          const cita = await moduleServices.citas.findById(id);
          const idMascota = resolveFieldValue(cita, "IdMascota");
          const idVeterinario = resolveFieldValue(cita, "IdVeterinario");
          const idEstadoCita = resolveFieldValue(cita, "IdEstadoCita");

          const [mascotas, usuariosActivos, estados] = await Promise.all([
            moduleServices.mascotas.getActivos(),
            moduleServices.usuarios.getActivos(),
            moduleServices.estadoCitas.findAll()
          ]);

          const mascota = (mascotas || []).find((m) => String(resolveFieldValue(m, "IdMascota")) === String(idMascota));
          const veterinario = (usuariosActivos || []).find(
            (u) => String(resolveFieldValue(u, "IdUsuario")) === String(idVeterinario)
          );
          const estado = (estados || []).find(
            (e) => String(resolveFieldValue(e, "IdEstadoCita")) === String(idEstadoCita)
          );

          let duenio = null;
          if (mascota) {
            const idCliente = resolveFieldValue(mascota, "IdCliente");
            duenio = await moduleServices.clientes.findById(idCliente);
          }

          setDetail({ cita, mascota, veterinario, estado, duenio });
        }

        if (moduleKey === "historialClinico") {
          const historial = await moduleServices.historialClinico.findById(id);
          const idMascota = resolveFieldValue(historial, "IdMascota");
          const idVeterinario = resolveFieldValue(historial, "IdVeterinario");

          const [mascotas, usuariosActivos] = await Promise.all([
            moduleServices.mascotas.getActivos(),
            moduleServices.usuarios.getActivos()
          ]);

          const mascota = (mascotas || []).find((m) => String(resolveFieldValue(m, "IdMascota")) === String(idMascota));
          const veterinario = (usuariosActivos || []).find(
            (u) => String(resolveFieldValue(u, "IdUsuario")) === String(idVeterinario)
          );

          let duenio = null;
          if (mascota) {
            const idCliente = resolveFieldValue(mascota, "IdCliente");
            duenio = await moduleServices.clientes.findById(idCliente);
          }

          setDetail({ historial, mascota, veterinario, duenio });
        }
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.response?.data?.Message ||
          err?.message ||
          "No se pudo cargar el detalle";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, moduleKey]);

  const handleDownloadPdf = async () => {
    if (!detail) return;
    try {
      setDownloading(true);

      if (moduleKey === "citas") {
        await downloadVetPdf({
          fileName: `detalle-cita-${id}.pdf`,
          documentTitle: "DETALLE DE CITA",
          petRows: [
            { label: "Nombre", value: read(resolveFieldValue(detail.mascota, "Nombre")) },
            { label: "Especie", value: read(resolveFieldValue(detail.mascota, "Especie")) },
            { label: "Raza", value: read(resolveFieldValue(detail.mascota, "Raza")) }
          ],
          ownerRows: [{ label: "Nombre completo", value: fullName(detail.duenio) }],
          vetRows: [{ label: "Nombre completo", value: fullName(detail.veterinario) }],
          infoTitle: "4) Informacion de Cita",
          infoRows: [
            { label: "Fecha y hora", value: formatDateTime12(resolveFieldValue(detail.cita, "FechaHora")) },
            { label: "Estado", value: read(resolveFieldValue(detail.estado, "NombreEstado")) }
          ],
          observations: read(resolveFieldValue(detail.cita, "Observaciones")),
          generatedAt: formatDateTime12(new Date())
        });
        return;
      }

      if (moduleKey === "historialClinico") {
        await downloadVetPdf({
          fileName: `detalle-historial-${id}.pdf`,
          documentTitle: "DETALLE DE HISTORIAL CLINICO",
          petRows: [
            { label: "Nombre", value: read(resolveFieldValue(detail.mascota, "Nombre")) },
            { label: "Especie", value: read(resolveFieldValue(detail.mascota, "Especie")) },
            { label: "Raza", value: read(resolveFieldValue(detail.mascota, "Raza")) }
          ],
          ownerRows: [{ label: "Nombre completo", value: fullName(detail.duenio) }],
          vetRows: [{ label: "Nombre completo", value: fullName(detail.veterinario) }],
          infoTitle: "4) Informacion Clinica",
          infoRows: [
            { label: "Diagnostico", value: read(resolveFieldValue(detail.historial, "Diagnostico")) },
            { label: "Tratamiento", value: read(resolveFieldValue(detail.historial, "Tratamiento")) }
          ],
          observations: read(resolveFieldValue(detail.historial, "Observaciones")),
          generatedAt: formatDateTime12(new Date())
        });
      }
    } finally {
      setDownloading(false);
    }
  };

  if (!id) return null;

  return (
    <div className="floating-detail-overlay" onClick={onClose}>
      <article className="floating-detail-card inline" onClick={(event) => event.stopPropagation()}>
        {moduleKey === "citas" ? (
          <header className="floating-detail-head">
            <h2>Cita</h2>
            <h3>{read(resolveFieldValue(detail?.mascota, "Nombre"))}</h3>
          </header>
        ) : (
          <header className="floating-detail-head">
            <h2>Historial Clinico</h2>
            <h3>{read(resolveFieldValue(detail?.mascota, "Nombre"))}</h3>
          </header>
        )}

        {loading ? <p>Cargando...</p> : null}
        {error ? <p className="error">{error}</p> : null}

        {!loading && !error && detail && moduleKey === "citas" ? (
          <div className="floating-detail-body">
            <div><span>Dueno:</span><strong>{fullName(detail.duenio)}</strong></div>
            <div><span>Veterinario:</span><strong>{fullName(detail.veterinario)}</strong></div>
            <div><span>Fecha y Hora:</span><strong>{formatDateTime12(resolveFieldValue(detail.cita, "FechaHora"))}</strong></div>
            <div><span>Estado:</span><strong>{read(resolveFieldValue(detail.estado, "NombreEstado"))}</strong></div>
            <div><span>Observaciones:</span><strong>{read(resolveFieldValue(detail.cita, "Observaciones"))}</strong></div>
            <div><span>Fecha Creacion:</span><strong>{formatDateTime12(resolveFieldValue(detail.cita, "FechaCrea"))}</strong></div>
          </div>
        ) : null}

        {!loading && !error && detail && moduleKey === "historialClinico" ? (
          <div className="floating-detail-body">
            <div><span>Dueno:</span><strong>{fullName(detail.duenio)}</strong></div>
            <div><span>Veterinario:</span><strong>{fullName(detail.veterinario)}</strong></div>
            <div><span>Diagnostico:</span><strong>{read(resolveFieldValue(detail.historial, "Diagnostico"))}</strong></div>
            <div><span>Tratamiento:</span><strong>{read(resolveFieldValue(detail.historial, "Tratamiento"))}</strong></div>
            <div><span>Observaciones:</span><strong>{read(resolveFieldValue(detail.historial, "Observaciones"))}</strong></div>
            <div><span>Fecha Creacion:</span><strong>{formatDateTime12(resolveFieldValue(detail.historial, "FechaCrea"))}</strong></div>
          </div>
        ) : null}

        <footer className="floating-detail-actions">
          <button
            type="button"
            className="primary-btn"
            onClick={handleDownloadPdf}
            disabled={loading || Boolean(error) || downloading}
          >
            {downloading ? "Descargando..." : "Descargar PDF"}
          </button>
          <button type="button" className="secondary-btn" onClick={onClose}>
            Volver
          </button>
        </footer>
      </article>
    </div>
  );
}

export default FloatingDetailModal;
