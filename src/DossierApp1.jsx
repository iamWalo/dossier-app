import { useState, useRef, useEffect } from "react";

const OPERATORS = ["Youssef Alami", "Fatima Zahra", "Mehdi Benali", "Sara Idrissi", "Karim Tazi"];
const FILE_TYPES = ["PDF", "PPT", "Excel", "Word", "Image", "Autre"];
const STATUS_COLORS = {
  "En attente": { bg: "#FFF3CD", color: "#856404", dot: "#FFC107" },
  "En cours":   { bg: "#CCE5FF", color: "#004085", dot: "#007BFF" },
  "Livré":      { bg: "#D4EDDA", color: "#155724", dot: "#28A745" },
  "Annulé":     { bg: "#F8D7DA", color: "#721C24", dot: "#DC3545" },
};

const PrintLogo = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
    <rect x="6" y="10" width="20" height="14" rx="2" fill="#94A3B8" />
    <rect x="9" y="6" width="14" height="8" rx="1" fill="#CBD5E1" />
    <rect x="9" y="18" width="14" height="8" rx="1" fill="white" stroke="#CBD5E1" />
    <circle cx="24" cy="15" r="1.5" fill="#10B981" />
  </svg>
);

const initialDossiers = [
  { id: 1, dossierName: "Rapport Q1", fileType: "PDF", clientName: "Société Atlas", operator: "Youssef Alami", dateEmission: "2025-01-10", dateLivraison: "2025-01-20", status: "Livré" },
  { id: 2, dossierName: "Présentation Projet", fileType: "PPT", clientName: "TechMaroc SARL", operator: "Fatima Zahra", dateEmission: "2025-02-05", dateLivraison: "2025-02-15", status: "En cours" },
];

function RowMenu({ onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const menuBtn = {
    width: "100%", background: "transparent", border: "none",
    padding: "9px 14px", borderRadius: 8, cursor: "pointer",
    textAlign: "left", fontSize: 13, display: "flex", alignItems: "center", gap: 10,
    transition: "background .12s", fontFamily: "inherit",
  };

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: open ? "#334155" : "transparent",
          border: `1px solid ${open ? "#475569" : "transparent"}`,
          color: open ? "#F1F5F9" : "#64748B",
          width: 32, height: 32, borderRadius: 8,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all .15s", fontSize: 20, letterSpacing: 1, lineHeight: 1,
        }}
        onMouseEnter={e => { if (!open) { e.currentTarget.style.background="#1E293B"; e.currentTarget.style.borderColor="#334155"; e.currentTarget.style.color="#F1F5F9"; }}}
        onMouseLeave={e => { if (!open) { e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor="transparent"; e.currentTarget.style.color="#64748B"; }}}
      >⋮</button>

      {open && (
        <div style={{
          position: "absolute", right: 0, top: 36, zIndex: 200,
          background: "#1E293B", border: "1px solid #334155",
          borderRadius: 12, padding: 6,
          boxShadow: "0 16px 48px #0009",
          minWidth: 160,
          animation: "menuPop .15s ease",
        }}>
          <button
            style={{ ...menuBtn, color: "#CBD5E1" }}
            onMouseEnter={e => e.currentTarget.style.background="#334155"}
            onMouseLeave={e => e.currentTarget.style.background="transparent"}
            onClick={() => { setOpen(false); onEdit(); }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7DD3FC" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Modifier
          </button>
          <div style={{ height: 1, background: "#334155", margin: "4px 0" }} />
          <button
            style={{ ...menuBtn, color: "#FCA5A5" }}
            onMouseEnter={e => e.currentTarget.style.background="#7F1D1D33"}
            onMouseLeave={e => e.currentTarget.style.background="transparent"}
            onClick={() => { setOpen(false); onDelete(); }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            Supprimer
          </button>
        </div>
      )}
    </div>
  );
}

function ConfirmDelete({ dossierName, onConfirm, onCancel }) {
  return (
    <div className="overlay" onClick={e => { if (e.target === e.currentTarget) onCancel(); }}>
      <div style={{ background:"#1E293B", border:"1px solid #334155", borderRadius:20, padding:32, width:400, boxShadow:"0 30px 80px #000A", animation:"slideDown .2s ease" }}>
        <div style={{ width:52, height:52, background:"#7F1D1D33", borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h3 style={{ color:"#F1F5F9", margin:"0 0 8px", fontFamily:"'Space Grotesk',sans-serif", fontSize:18 }}>Supprimer le dossier ?</h3>
        <p style={{ color:"#94A3B8", fontSize:14, margin:"0 0 24px", lineHeight:1.6 }}>
          Vous allez supprimer <strong style={{ color:"#F1F5F9" }}>« {dossierName} »</strong>. Cette action est irréversible.
        </p>
        <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
          <button className="btn-secondary" onClick={onCancel}>Annuler</button>
          <button onClick={onConfirm} style={{
            background:"linear-gradient(135deg,#EF4444,#DC2626)", color:"white",
            border:"none", padding:"10px 22px", borderRadius:10, fontSize:14,
            fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:8,
            boxShadow:"0 4px 15px #EF444440", transition:"all .2s", fontFamily:"inherit",
          }}
            onMouseEnter={e => e.currentTarget.style.transform="translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform="translateY(0)"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [dossiers, setDossiers]       = useState(initialDossiers);
  const [showForm, setShowForm]       = useState(false);
  const [editingId, setEditingId]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ dossierName:"", fileType:"PDF", clientName:"", operator:"", dateEmission: new Date().toISOString().split("T")[0], dateLivraison:"", status:"En attente" });
  const [errors, setErrors]           = useState({});
  const [animateRow, setAnimateRow]   = useState(null);

  const openNew = () => {
    setEditingId(null);
    setForm({ dossierName:"", fileType:"PDF", clientName:"", operator:"", dateEmission: new Date().toISOString().split("T")[0], dateLivraison:"", status:"En attente" });
    setErrors({});
    setShowForm(true);
  };

  const openEdit = (d) => {
    setEditingId(d.id);
    setForm({ dossierName:d.dossierName, fileType:d.fileType, clientName:d.clientName, operator:d.operator, dateEmission:d.dateEmission, dateLivraison:d.dateLivraison, status:d.status });
    setErrors({});
    setShowForm(true);
  };

  const validate = () => {
    const e = {};
    if (!form.dossierName.trim()) e.dossierName = "Champ requis";
    if (!form.clientName.trim())  e.clientName  = "Champ requis";
    if (!form.operator)           e.operator    = "Sélectionnez un opérateur";
    if (!form.dateLivraison)      e.dateLivraison = "Date requise";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    if (editingId !== null) {
      setDossiers(prev => prev.map(d => d.id === editingId ? { ...d, ...form } : d));
      setAnimateRow(editingId);
    } else {
      const newId = Date.now();
      setDossiers(prev => [...prev, { id: newId, ...form, status:"En attente" }]);
      setAnimateRow(newId);
    }
    setShowForm(false);
    setTimeout(() => setAnimateRow(null), 900);
  };

  const handleDelete = (id) => { setDossiers(prev => prev.filter(d => d.id !== id)); setDeleteTarget(null); };
  const handleChange = (f, v) => { setForm(p => ({ ...p, [f]: v })); if (errors[f]) setErrors(p => ({ ...p, [f]: null })); };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#0F172A 0%,#1E293B 50%,#0F172A 100%)", fontFamily:"'DM Sans',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes slideDown { from{opacity:0;transform:translateY(-16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeInRow { from{opacity:0;background:#10B98133} to{opacity:1;background:transparent} }
        @keyframes menuPop   { from{opacity:0;transform:scale(.95) translateY(-4px)} to{opacity:1;transform:scale(1) translateY(0)} }
        .btn-primary  { background:linear-gradient(135deg,#10B981,#059669);color:white;border:none;padding:10px 22px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:8px;transition:all .2s;box-shadow:0 4px 15px #10B98140;font-family:inherit; }
        .btn-primary:hover  { transform:translateY(-2px);box-shadow:0 8px 25px #10B98155; }
        .btn-secondary { background:transparent;color:#94A3B8;border:1px solid #334155;padding:10px 22px;border-radius:10px;font-size:14px;cursor:pointer;transition:all .2s;font-family:inherit; }
        .btn-secondary:hover { border-color:#64748B;color:#CBD5E1; }
        .form-field { display:flex;flex-direction:column;gap:6px; }
        .form-label { font-size:12px;font-weight:600;color:#94A3B8;text-transform:uppercase;letter-spacing:.06em; }
        .form-input { background:#0F172A;border:1px solid #334155;color:#F1F5F9;padding:11px 14px;border-radius:10px;font-size:14px;outline:none;transition:all .2s;font-family:inherit; }
        .form-input:focus { border-color:#10B981;box-shadow:0 0 0 3px #10B98120; }
        .form-input.error { border-color:#F87171; }
        .form-error { font-size:11px;color:#F87171; }
        .table-row { transition:background .2s; }
        .table-row:hover { background:#ffffff07; }
        .new-row { animation:fadeInRow .9s ease; }
        .overlay { position:fixed;inset:0;background:#00000090;z-index:50;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(5px); }
        .modal { background:#1E293B;border:1px solid #334155;border-radius:20px;padding:32px;width:560px;max-height:90vh;overflow-y:auto;box-shadow:0 30px 80px #000A;animation:slideDown .2s ease; }
        .badge { display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:600; }
        .dot { width:7px;height:7px;border-radius:50%; }
        th { font-size:11px;font-weight:600;color:#64748B;text-transform:uppercase;letter-spacing:.07em;padding:14px 16px;text-align:left;border-bottom:1px solid #1E293B; }
        td { padding:13px 16px;border-bottom:1px solid #ffffff06;font-size:13.5px;color:#CBD5E1;vertical-align:middle; }
        .type-badge { background:#0F172A;color:#7DD3FC;border:1px solid #1E3A5F;padding:3px 9px;border-radius:6px;font-size:11px;font-weight:700;letter-spacing:.05em; }
      `}</style>

      {/* Header */}
      <div style={{ background:"#0F172A", borderBottom:"1px solid #1E293B", padding:"0 32px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:64 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:36,height:36,background:"linear-gradient(135deg,#10B981,#059669)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <span style={{ fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:18,color:"#F1F5F9",letterSpacing:"-.02em" }}>DossierPro</span>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            <div style={{ width:8,height:8,background:"#10B981",borderRadius:"50%",boxShadow:"0 0 8px #10B981" }} />
            <span style={{ fontSize:12,color:"#64748B" }}>{dossiers.length} dossier{dossiers.length!==1?"s":""} enregistrés</span>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ maxWidth:1200,margin:"0 auto",padding:"32px" }}>
        <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:28 }}>
          <div>
            <h1 style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:26,fontWeight:700,color:"#F1F5F9",margin:0,letterSpacing:"-.03em" }}>Gestion des Dossiers</h1>
            <p style={{ color:"#64748B",fontSize:14,margin:"4px 0 0 0" }}>Suivi et gestion de vos dossiers clients</p>
          </div>
          <button className="btn-primary" onClick={openNew}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nouveau Dossier
          </button>
        </div>

        {/* Stats */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:28 }}>
          {Object.entries(STATUS_COLORS).map(([status,s]) => {
            const count = dossiers.filter(d=>d.status===status).length;
            return (
              <div key={status} style={{ background:"#1E293B",border:"1px solid #334155",borderRadius:14,padding:"16px 20px",display:"flex",alignItems:"center",gap:12 }}>
                <div style={{ width:40,height:40,borderRadius:10,background:s.bg+"22",display:"flex",alignItems:"center",justifyContent:"center" }}>
                  <div style={{ width:12,height:12,borderRadius:"50%",background:s.dot }} />
                </div>
                <div>
                  <div style={{ fontSize:22,fontWeight:700,color:"#F1F5F9",lineHeight:1 }}>{count}</div>
                  <div style={{ fontSize:11,color:"#64748B",marginTop:2 }}>{status}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Table */}
        <div style={{ background:"#1E293B",border:"1px solid #334155",borderRadius:18,overflow:"hidden" }}>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%",borderCollapse:"collapse" }}>
              <thead style={{ background:"#0F172A" }}>
                <tr>
                  <th>Dossier</th><th>Client</th><th>Opérateur</th>
                  <th>Date Émission</th><th>Date Livraison</th><th>Statut</th>
                  <th>Impression</th><th style={{ width:52 }}></th>
                </tr>
              </thead>
              <tbody>
                {dossiers.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign:"center",color:"#475569",padding:"48px",fontSize:14 }}>Aucun dossier. Cliquez sur « Nouveau Dossier ».</td></tr>
                ) : dossiers.map(d => {
                  const sc = STATUS_COLORS[d.status] || STATUS_COLORS["En attente"];
                  return (
                    <tr key={d.id} className={`table-row${animateRow===d.id?" new-row":""}`}>
                      <td>
                        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                          <span style={{ fontWeight:600,color:"#F1F5F9" }}>{d.dossierName}</span>
                          <span className="type-badge">{d.fileType}</span>
                        </div>
                      </td>
                      <td>{d.clientName}</td>
                      <td>
                        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                          <div style={{ width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#10B981,#059669)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"white",flexShrink:0 }}>
                            {d.operator.split(" ").map(w=>w[0]).join("").slice(0,2)}
                          </div>
                          <span style={{ fontSize:13 }}>{d.operator}</span>
                        </div>
                      </td>
                      <td style={{ color:"#94A3B8",fontVariantNumeric:"tabular-nums" }}>{d.dateEmission}</td>
                      <td style={{ color:"#94A3B8",fontVariantNumeric:"tabular-nums" }}>{d.dateLivraison}</td>
                      <td>
                        <span className="badge" style={{ background:sc.bg+"22",color:sc.color,border:`1px solid ${sc.dot}44` }}>
                          <span className="dot" style={{ background:sc.dot }} />{d.status}
                        </span>
                      </td>
                      <td>
                        <button title="Imprimer" onClick={()=>window.print()} style={{ background:"none",border:"none",cursor:"pointer",opacity:.65,transition:"opacity .2s",padding:4 }}
                          onMouseEnter={e=>e.currentTarget.style.opacity=1}
                          onMouseLeave={e=>e.currentTarget.style.opacity=0.65}>
                          <PrintLogo />
                        </button>
                      </td>
                      <td style={{ textAlign:"right",paddingRight:12 }}>
                        <RowMenu onEdit={()=>openEdit(d)} onDelete={()=>setDeleteTarget(d)} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="overlay" onClick={e=>{ if(e.target===e.currentTarget) setShowForm(false); }}>
          <div className="modal">
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24 }}>
              <div>
                <h2 style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:20,fontWeight:700,color:"#F1F5F9",margin:0 }}>
                  {editingId!==null ? "Modifier le Dossier" : "Nouveau Dossier"}
                </h2>
                <p style={{ color:"#64748B",fontSize:13,margin:"4px 0 0 0" }}>
                  {editingId!==null ? "Modifiez les informations du dossier" : "Remplissez les informations du dossier"}
                </p>
              </div>
              <button onClick={()=>setShowForm(false)} style={{ background:"#0F172A",border:"1px solid #334155",color:"#94A3B8",width:34,height:34,borderRadius:8,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center" }}>×</button>
            </div>

            <div style={{ display:"grid",gap:18 }}>
              <div style={{ display:"grid",gridTemplateColumns:"1fr auto",gap:12,alignItems:"end" }}>
                <div className="form-field">
                  <label className="form-label">Nom du Dossier</label>
                  <input className={`form-input${errors.dossierName?" error":""}`} placeholder="ex: Rapport Annuel 2025" value={form.dossierName} onChange={e=>handleChange("dossierName",e.target.value)} />
                  {errors.dossierName && <span className="form-error">{errors.dossierName}</span>}
                </div>
                <div className="form-field">
                  <label className="form-label">Type</label>
                  <select className="form-input" value={form.fileType} onChange={e=>handleChange("fileType",e.target.value)} style={{ cursor:"pointer" }}>
                    {FILE_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label className="form-label">Nom du Client</label>
                <input className={`form-input${errors.clientName?" error":""}`} placeholder="ex: Société Atlas SARL" value={form.clientName} onChange={e=>handleChange("clientName",e.target.value)} />
                {errors.clientName && <span className="form-error">{errors.clientName}</span>}
              </div>

              <div className="form-field">
                <label className="form-label">Opérateur</label>
                <select className={`form-input${errors.operator?" error":""}`} value={form.operator} onChange={e=>handleChange("operator",e.target.value)} style={{ cursor:"pointer" }}>
                  <option value="">— Sélectionner un opérateur —</option>
                  {OPERATORS.map(op=><option key={op} value={op}>{op}</option>)}
                </select>
                {errors.operator && <span className="form-error">{errors.operator}</span>}
              </div>

              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
                <div className="form-field">
                  <label className="form-label">Date d'Émission</label>
                  <input className="form-input" type="date" value={form.dateEmission} onChange={e=>handleChange("dateEmission",e.target.value)} />
                </div>
                <div className="form-field">
                  <label className="form-label">Date de Livraison</label>
                  <input className={`form-input${errors.dateLivraison?" error":""}`} type="date" value={form.dateLivraison} onChange={e=>handleChange("dateLivraison",e.target.value)} />
                  {errors.dateLivraison && <span className="form-error">{errors.dateLivraison}</span>}
                </div>
              </div>

              {editingId !== null ? (
                <div className="form-field">
                  <label className="form-label">Statut</label>
                  <select className="form-input" value={form.status} onChange={e=>handleChange("status",e.target.value)} style={{ cursor:"pointer" }}>
                    {Object.keys(STATUS_COLORS).map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              ) : (
                <div style={{ background:"#0F172A",border:"1px solid #1E293B",borderRadius:10,padding:"12px 16px",display:"flex",alignItems:"center",gap:10 }}>
                  <span style={{ fontSize:12,color:"#64748B" }}>Statut automatique :</span>
                  <span className="badge" style={{ background:"#FFF3CD22",color:"#856404",border:"1px solid #FFC10744" }}>
                    <span className="dot" style={{ background:"#FFC107" }} />En attente
                  </span>
                </div>
              )}

              <div style={{ display:"flex",gap:10,justifyContent:"flex-end",marginTop:4 }}>
                <button className="btn-secondary" onClick={()=>setShowForm(false)}>Annuler</button>
                <button className="btn-primary" onClick={handleSubmit}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  {editingId!==null ? "Enregistrer les modifications" : "Enregistrer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {deleteTarget && (
        <ConfirmDelete
          dossierName={deleteTarget.dossierName}
          onConfirm={()=>handleDelete(deleteTarget.id)}
          onCancel={()=>setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
