import { useState, useRef, useEffect } from "react";

// ── Constants ────────────────────────────────────────────────────────────────
const OPERATORS = ["Halima", "Ilyas", "Abdel illah", "Sara", "Karim"];
const FILE_TYPES = ["PDF", "PPT", "Excel", "Word", "Image", "Autre"];
const STATUS_CFG = {
    "En attente": { bg: "#FFF3E0", color: "#E65100", border: "#FFB74D" },
    "En cours": { bg: "#E3F2FD", color: "#0277BD", border: "#64B5F6" },
    "Livré": { bg: "#E8F5E9", color: "#2E7D32", border: "#81C784" },
    "Annulé": { bg: "#FCE4EC", color: "#C62828", border: "#EF9A9A" },
};
const NAV_ITEMS = [
    {
        label: "Tableau de bord", icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
        )
    },
    {
        label: "Dossiers", icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
        )
    },
    {
        label: "Affaires", icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
        )
    },
    {
        label: "Finances", icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
        )
    },
];

const AFFAIRES = [
    { name: "Lhaj Said Alaoui", type: "Plan de Bornage", location: "Douar Ibaarir foukaniyin, Sidi taher", date: "21/04/2026", time: "13:30", confirmed: true },
    { name: "Lhaj Said Alaoui", type: "Plan de Bornage", location: "Douar Ibaarir foukaniyin, Sidi taher", date: "21/04/2026", time: "13:30", confirmed: true },
    { name: "Lhaj Said Alaoui", type: "Plan de Bornage", location: "Douar Ibaarir foukaniyin, Sidi taher", date: "21/04/2026", time: "13:30", confirmed: true },
    { name: "Lhaj Said Alaoui", type: "Plan de Bornage", location: "Douar Ibaarir foukaniyin, Sidi taher", date: "21/04/2026", time: "13:30", confirmed: true },
    { name: "Lhaj Said Alaoui", type: "Plan de Bornage", location: "Douar Ibaarir foukaniyin, Sidi taher", date: "21/04/2026", time: "13:30", confirmed: true },
];

const EMPTY_FORM = {
    dossierName: "Plan de Bornage", fileType: "PDF", clientName: "", operator: "",
    dateEmission: new Date().toISOString().split("T")[0],
    dateLivraison: "", montant: "", status: "En attente", note: "",
};

const initialDossiers = [
    { id: 1, dossierName: "Plan de Bornage", fileType: "PDF", clientName: "Riad Shemsi", operator: "Halima", dateEmission: "2024-12-02", dateLivraison: "2024-12-22", montant: "700", status: "Livré", note: "" },
    { id: 2, dossierName: "Plan de Bornage", fileType: "PDF", clientName: "Riad Yasmine", operator: "Ilyas", dateEmission: "2024-12-03", dateLivraison: "2024-12-23", montant: "1200", status: "Annulé", note: "" },
    { id: 3, dossierName: "Plan de Bornage", fileType: "PDF", clientName: "Riad Enija", operator: "Abdel illah", dateEmission: "2024-12-04", dateLivraison: "2024-12-24", montant: "3400", status: "En attente", note: "" },
    { id: 4, dossierName: "Plan de Bornage", fileType: "PDF", clientName: "Riad Alida", operator: "Abdel illah", dateEmission: "2024-12-05", dateLivraison: "2024-12-25", montant: "15200", status: "En attente", note: "" },
    { id: 5, dossierName: "Plan de Bornage", fileType: "PDF", clientName: "Riad Selouane", operator: "Halima", dateEmission: "2024-12-06", dateLivraison: "2024-12-26", montant: "9250", status: "En attente", note: "" },
    { id: 6, dossierName: "Plan de Bornage", fileType: "PDF", clientName: "Riad Omar", operator: "Halima", dateEmission: "2024-12-07", dateLivraison: "2024-12-27", montant: "14000", status: "Annulé", note: "" },
    { id: 7, dossierName: "Plan de Bornage", fileType: "PDF", clientName: "Riad Farah", operator: "Halima", dateEmission: "2024-12-08", dateLivraison: "2024-12-28", montant: "11500", status: "En cours", note: "" },
    { id: 8, dossierName: "Plan de Bornage", fileType: "PDF", clientName: "Riad Farah", operator: "Halima", dateEmission: "2024-12-08", dateLivraison: "2024-12-28", montant: "11500", status: "Livré", note: "" },
    { id: 9, dossierName: "Plan de Bornage", fileType: "PDF", clientName: "Riad Farah", operator: "Halima", dateEmission: "2024-12-08", dateLivraison: "2024-12-28", montant: "11500", status: "Livré", note: "" },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function fmtDate(iso) {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[parseInt(m, 10) - 1]} ${parseInt(d, 10)}, ${y}`;
}
function fmtMontant(v) { return v ? `${parseInt(v).toLocaleString()} MAD` : "—"; }

// ── Calendar widget ──────────────────────────────────────────────────────────
function CalendarWidget() {
    const now = new Date();
    const [cur, setCur] = useState({ year: now.getFullYear(), month: now.getMonth() });
    const firstDay = new Date(cur.year, cur.month, 1).getDay();
    const daysInMonth = new Date(cur.year, cur.month + 1, 0).getDate();
    const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const today = now.getDate();
    const isThisMonth = cur.month === now.getMonth() && cur.year === now.getFullYear();
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return (
        <div style={{ background: "white", borderRadius: 14, padding: "18px 20px", boxShadow: "0 2px 12px #0000000d", border: "1px solid #F0F0F0" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <button onClick={() => setCur(c => { const d = new Date(c.year, c.month - 1); return { year: d.getFullYear(), month: d.getMonth() }; })}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#9E9E9E", fontSize: 16, padding: "2px 6px" }}>‹</button>
                <span style={{ fontWeight: 700, fontSize: 13, color: "#212121" }}>{MONTHS[cur.month]} {cur.year}</span>
                <button onClick={() => setCur(c => { const d = new Date(c.year, c.month + 1); return { year: d.getFullYear(), month: d.getMonth() }; })}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#9E9E9E", fontSize: 16, padding: "2px 6px" }}>›</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "2px 0", textAlign: "center" }}>
                {["SAN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(d => (
                    <div key={d} style={{ fontSize: 9, fontWeight: 700, color: "#9E9E9E", paddingBottom: 6 }}>{d}</div>
                ))}
                {cells.map((d, i) => (
                    <div key={i} style={{
                        fontSize: 11, padding: "5px 2px", borderRadius: 20, cursor: d ? "pointer" : "default",
                        background: isThisMonth && d === today ? "#5C35C9" : "transparent",
                        color: d === null ? "transparent" : isThisMonth && d === today ? "white" : "#424242",
                        fontWeight: isThisMonth && d === today ? 700 : 400,
                    }}>{d || ""}</div>
                ))}
            </div>
        </div>
    );
}

// ── Affaires widget ──────────────────────────────────────────────────────────
function AffairesWidget({ affaires }) {
    return (
        <div style={{ background: "white", borderRadius: 14, padding: "18px 20px", boxShadow: "0 2px 12px #0000000d", border: "1px solid #F0F0F0", marginTop: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: "#212121" }}>Affaire à venir</span>
                <div style={{ background: "#5C35C9", color: "white", borderRadius: 20, fontSize: 11, fontWeight: 700, padding: "2px 8px", minWidth: 20, textAlign: "center" }}>{affaires.length}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {affaires.map((a, i) => (
                    <div key={i} style={{ borderBottom: i < affaires.length - 1 ? "1px solid #F5F5F5" : "none", paddingBottom: i < affaires.length - 1 ? 14 : 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                            <span style={{ fontSize: 12, color: "#424242", fontWeight: 600 }}>{a.name}</span>
                            <span style={{ fontSize: 11, color: "#5C35C9", fontWeight: 600 }}>| {a.type}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9E9E9E" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /></svg>
                            <span style={{ fontSize: 11, color: "#9E9E9E" }}>{a.location}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 11, color: "#757575" }}>{a.date}</span>
                            <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9E9E9E" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                <span style={{ fontSize: 11, color: "#757575" }}>{a.time}</span>
                            </div>
                            {a.confirmed && <span style={{ fontSize: 10, background: "#E8F5E9", color: "#2E7D32", borderRadius: 20, padding: "1px 8px", fontWeight: 600 }}>Confirmé</span>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Row menu ─────────────────────────────────────────────────────────────────
function RowMenu({ onEdit, onDelete, onWhatsApp }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h);
    }, []);
    const btn = { width: "100%", background: "transparent", border: "none", padding: "8px 14px", borderRadius: 6, cursor: "pointer", textAlign: "left", fontSize: 13, display: "flex", alignItems: "center", gap: 10, fontFamily: "inherit", color: "#424242", transition: "background .1s" };
    return (
        <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
            <button onClick={() => setOpen(o => !o)} style={{ background: "none", border: "none", cursor: "pointer", color: "#BDBDBD", fontSize: 20, display: "flex", alignItems: "center", padding: "2px 4px", borderRadius: 4, transition: "color .15s" }}
                onMouseEnter={e => e.currentTarget.style.color = "#424242"} onMouseLeave={e => e.currentTarget.style.color = "#BDBDBD"}>⋮</button>
            {open && (
                <div style={{ position: "absolute", right: 0, top: 28, zIndex: 300, background: "white", border: "1px solid #EEEEEE", borderRadius: 10, padding: 6, boxShadow: "0 8px 30px #00000015", minWidth: 170, animation: "menuPop .15s ease" }}>
                    <button style={btn} onMouseEnter={e => e.currentTarget.style.background = "#F5F5F5"} onMouseLeave={e => e.currentTarget.style.background = "transparent"} onClick={() => { setOpen(false); onEdit(); }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#5C35C9" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                        Modifier
                    </button>
                    <button style={btn} onMouseEnter={e => e.currentTarget.style.background = "#F0FFF4"} onMouseLeave={e => e.currentTarget.style.background = "transparent"} onClick={() => { setOpen(false); onWhatsApp(); }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.122 1.524 5.855L.055 23.454a.75.75 0 0 0 .916.916l5.599-1.469A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.645-.52-5.148-1.42l-.369-.22-3.821 1.002 1.003-3.821-.22-.369A9.956 9.956 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" /></svg>
                        Envoyer WhatsApp
                    </button>
                    <div style={{ height: 1, background: "#F5F5F5", margin: "4px 0" }} />
                    <button style={{ ...btn, color: "#E53935" }} onMouseEnter={e => e.currentTarget.style.background = "#FFF5F5"} onMouseLeave={e => e.currentTarget.style.background = "transparent"} onClick={() => { setOpen(false); onDelete(); }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#E53935" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>
                        Supprimer
                    </button>
                </div>
            )}
        </div>
    );
}

// ── WhatsApp Modal ────────────────────────────────────────────────────────────
function WhatsAppModal({ dossier, onClose }) {
    const [phone, setPhone] = useState("");
    const [err, setErr] = useState("");
    const send = () => {
        const digits = phone.replace(/\D/g, "");
        if (digits.length < 8) { setErr("Numéro invalide"); return; }
        const text = encodeURIComponent(
            `📁 *Dossier :* ${dossier.dossierName} (${dossier.fileType})\n👤 *Client :* ${dossier.clientName}\n📅 *Émission :* ${fmtDate(dossier.dateEmission)}\n🚚 *Livraison :* ${fmtDate(dossier.dateLivraison)}\n💰 *Montant :* ${fmtMontant(dossier.montant)}\n📌 *Statut :* ${dossier.status}${dossier.note ? "\n📝 *Note :* " + dossier.note : ""}`
        );
        window.open(`https://wa.me/${digits}?text=${text}`, "_blank");
        onClose();
    };
    return (
        <div className="gt-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="gt-modal">
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                    <div style={{ width: 42, height: 42, background: "#E8F5E9", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.122 1.524 5.855L.055 23.454a.75.75 0 0 0 .916.916l5.599-1.469A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.645-.52-5.148-1.42l-.369-.22-3.821 1.002 1.003-3.821-.22-.369A9.956 9.956 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" /></svg>
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#212121" }}>Envoyer sur WhatsApp</h3>
                        <p style={{ margin: 0, fontSize: 12, color: "#9E9E9E" }}>{dossier.dossierName} — {dossier.clientName}</p>
                    </div>
                    <button onClick={onClose} style={{ marginLeft: "auto", background: "#F5F5F5", border: "none", width: 30, height: 30, borderRadius: 8, cursor: "pointer", fontSize: 16, color: "#9E9E9E" }}>×</button>
                </div>
                <div style={{ background: "#F8F9FA", borderRadius: 10, padding: "12px 14px", marginBottom: 16, fontSize: 12, color: "#616161", lineHeight: 1.9 }}>
                    <div><b style={{ color: "#424242" }}>📁 Dossier :</b> {dossier.dossierName} ({dossier.fileType})</div>
                    <div><b style={{ color: "#424242" }}>👤 Client :</b> {dossier.clientName}</div>
                    <div><b style={{ color: "#424242" }}>📅 Émission :</b> {fmtDate(dossier.dateEmission)}</div>
                    <div><b style={{ color: "#424242" }}>🚚 Livraison :</b> {fmtDate(dossier.dateLivraison)}</div>
                    <div><b style={{ color: "#424242" }}>💰 Montant :</b> {fmtMontant(dossier.montant)}</div>
                    {dossier.note && <div><b style={{ color: "#424242" }}>📝 Note :</b> {dossier.note}</div>}
                </div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#616161", display: "block", marginBottom: 6 }}>Numéro WhatsApp (avec code pays)</label>
                <input className="gt-input" placeholder="ex: 212600000000" value={phone} onChange={e => { setPhone(e.target.value); setErr(""); }} />
                {err && <span style={{ fontSize: 11, color: "#E53935" }}>{err}</span>}
                <p style={{ fontSize: 11, color: "#BDBDBD", margin: "6px 0 18px" }}>Inclure le code pays — ex: 212 pour Maroc</p>
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                    <button className="gt-btn-sec" onClick={onClose}>Annuler</button>
                    <button onClick={send} style={{ background: "#25D366", color: "white", border: "none", padding: "9px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontFamily: "inherit" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.122 1.524 5.855L.055 23.454a.75.75 0 0 0 .916.916l5.599-1.469A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.645-.52-5.148-1.42l-.369-.22-3.821 1.002 1.003-3.821-.22-.369A9.956 9.956 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" /></svg>
                        Envoyer
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Confirm Delete ────────────────────────────────────────────────────────────
function ConfirmDelete({ name, onConfirm, onCancel }) {
    return (
        <div className="gt-overlay" onClick={e => { if (e.target === e.currentTarget) onCancel(); }}>
            <div className="gt-modal" style={{ maxWidth: 380 }}>
                <div style={{ width: 48, height: 48, background: "#FFF5F5", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E53935" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                </div>
                <h3 style={{ margin: "0 0 8px", fontSize: 17, fontWeight: 700, color: "#212121" }}>Supprimer le dossier ?</h3>
                <p style={{ color: "#757575", fontSize: 13, margin: "0 0 22px", lineHeight: 1.6 }}>
                    Vous allez supprimer <strong style={{ color: "#212121" }}>« {name} »</strong>. Cette action est irréversible.
                </p>
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                    <button className="gt-btn-sec" onClick={onCancel}>Annuler</button>
                    <button onClick={onConfirm} style={{ background: "#E53935", color: "white", border: "none", padding: "9px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Supprimer</button>
                </div>
            </div>
        </div>
    );
}

// ── Dossier Form Modal ────────────────────────────────────────────────────────
function DossierForm({ editingId, form, errors, onChange, onSubmit, onClose }) {
    return (
        <div className="gt-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="gt-modal">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
                    <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#212121" }}>
                        {editingId !== null ? "Modifier le Dossier" : "Ajouter un Dossier"}
                    </h2>
                    <button onClick={onClose} style={{ background: "#F5F5F5", border: "none", width: 32, height: 32, borderRadius: 8, cursor: "pointer", fontSize: 18, color: "#9E9E9E" }}>×</button>
                </div>
                <div style={{ display: "grid", gap: 14 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: 12 }}>
                        <div className="gt-field">
                            <label className="gt-label">Nom du Dossier</label>
                            <input className={`gt-input${errors.dossierName ? " gt-err" : ""}`} placeholder="ex: Plan de Bornage" value={form.dossierName} onChange={e => onChange("dossierName", e.target.value)} />
                            {errors.dossierName && <span className="gt-errtxt">{errors.dossierName}</span>}
                        </div>
                        <div className="gt-field">
                            <label className="gt-label">Type</label>
                            <select className="gt-input" value={form.fileType} onChange={e => onChange("fileType", e.target.value)} style={{ cursor: "pointer" }}>
                                {FILE_TYPES.map(t => <option key={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="gt-field">
                        <label className="gt-label">Nom du Client</label>
                        <input className={`gt-input${errors.clientName ? " gt-err" : ""}`} placeholder="ex: Riad Shemsi" value={form.clientName} onChange={e => onChange("clientName", e.target.value)} />
                        {errors.clientName && <span className="gt-errtxt">{errors.clientName}</span>}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <div className="gt-field">
                            <label className="gt-label">Opérateur</label>
                            <select className={`gt-input${errors.operator ? " gt-err" : ""}`} value={form.operator} onChange={e => onChange("operator", e.target.value)} style={{ cursor: "pointer" }}>
                                <option value="">— Sélectionner —</option>
                                {OPERATORS.map(op => <option key={op}>{op}</option>)}
                            </select>
                            {errors.operator && <span className="gt-errtxt">{errors.operator}</span>}
                        </div>
                        <div className="gt-field">
                            <label className="gt-label">Montant (DH)</label>
                            <input className="gt-input" placeholder="ex: 5000" type="number" value={form.montant} onChange={e => onChange("montant", e.target.value)} />
                        </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <div className="gt-field">
                            <label className="gt-label">Date d'Émission</label>
                            <input className="gt-input" type="date" value={form.dateEmission} onChange={e => onChange("dateEmission", e.target.value)} />
                        </div>
                        <div className="gt-field">
                            <label className="gt-label">Date d'Échéance</label>
                            <input className={`gt-input${errors.dateLivraison ? " gt-err" : ""}`} type="date" value={form.dateLivraison} onChange={e => onChange("dateLivraison", e.target.value)} />
                            {errors.dateLivraison && <span className="gt-errtxt">{errors.dateLivraison}</span>}
                        </div>
                    </div>
                    <div className="gt-field">
                        <label className="gt-label">Notes</label>
                        <textarea className="gt-input" rows={3} placeholder="Remarques, instructions..." value={form.note} onChange={e => onChange("note", e.target.value)} style={{ resize: "vertical" }} />
                    </div>
                    {editingId !== null && (
                        <div className="gt-field">
                            <label className="gt-label">Statut</label>
                            <select className="gt-input" value={form.status} onChange={e => onChange("status", e.target.value)} style={{ cursor: "pointer" }}>
                                {Object.keys(STATUS_CFG).map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                    )}
                    {editingId === null && (
                        <div style={{ background: "#F3F0FF", border: "1px solid #D1C4E9", borderRadius: 8, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 12, color: "#7B1FA2" }}>Statut automatique :</span>
                            <span style={{ fontSize: 12, fontWeight: 700, color: "#E65100", background: "#FFF3E0", padding: "2px 10px", borderRadius: 20, border: "1px solid #FFB74D" }}>En attente</span>
                        </div>
                    )}
                    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
                        <button className="gt-btn-sec" onClick={onClose}>Annuler</button>
                        <button onClick={onSubmit} className="gt-btn-pri">
                            {editingId !== null ? "Enregistrer les modifications" : "Ajouter un Dossier"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function App() {
    const [activeNav, setActiveNav] = useState(0);
    const [dossiers, setDossiers] = useState(initialDossiers);
    const [selected, setSelected] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [waTarget, setWaTarget] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [animRow, setAnimRow] = useState(null);

    const openNew = () => { setEditingId(null); setForm(EMPTY_FORM); setErrors({}); setShowForm(true); };
    const openEdit = d => { setEditingId(d.id); setForm({ dossierName: d.dossierName, fileType: d.fileType, clientName: d.clientName, operator: d.operator, dateEmission: d.dateEmission, dateLivraison: d.dateLivraison, montant: d.montant || "", status: d.status, note: d.note || "" }); setErrors({}); setShowForm(true); };

    const validate = () => {
        const e = {};
        if (!form.dossierName.trim()) e.dossierName = "Requis";
        if (!form.clientName.trim()) e.clientName = "Requis";
        if (!form.operator) e.operator = "Requis";
        if (!form.dateLivraison) e.dateLivraison = "Requis";
        setErrors(e); return Object.keys(e).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;
        if (editingId !== null) {
            setDossiers(p => p.map(d => d.id === editingId ? { ...d, ...form } : d));
            setAnimRow(editingId);
        } else {
            const id = Date.now();
            setDossiers(p => [...p, { id, ...form, status: "En attente" }]);
            setAnimRow(id);
        }
        setShowForm(false);
        setTimeout(() => setAnimRow(null), 1000);
    };

    const handleDelete = id => { setDossiers(p => p.filter(d => d.id !== id)); setDeleteTarget(null); };
    const onChange = (f, v) => { setForm(p => ({ ...p, [f]: v })); if (errors[f]) setErrors(p => ({ ...p, [f]: null })); };

    const toggleSelect = id => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
    const allSelected = dossiers.length > 0 && selected.length === dossiers.length;
    const toggleAll = () => setSelected(allSelected ? [] : dossiers.map(d => d.id));

    // Stats
    const enAttente = dossiers.filter(d => d.status === "En attente").length;
    const enCours = dossiers.filter(d => d.status === "En cours").length;
    const livre = dossiers.filter(d => d.status === "Livré").length;
    const totalPaye = dossiers.filter(d => d.status === "Livré").reduce((s, d) => s + parseInt(d.montant || 0), 0);

    return (
        <div style={{ display: "flex", height: "100vh", background: "#F7F8FC", fontFamily: "'Nunito',sans-serif", overflow: "hidden" }}>
            <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
            <style>{`
        @keyframes menuPop { from{opacity:0;transform:scale(.95) translateY(-4px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes fadeIn  { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes rowIn   { from{opacity:0;background:#EDE7F6} to{opacity:1;background:transparent} }
        * { box-sizing:border-box; }
        .gt-overlay { position:fixed;inset:0;background:#00000040;z-index:100;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(3px);animation:fadeIn .2s ease; }
        .gt-modal   { background:white;border-radius:16px;padding:28px;width:520px;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px #00000020;animation:fadeIn .2s ease; }
        .gt-field   { display:flex;flex-direction:column;gap:5px; }
        .gt-label   { font-size:11px;font-weight:700;color:#9E9E9E;text-transform:uppercase;letter-spacing:.05em; }
        .gt-input   { background:#F8F9FA;border:1.5px solid #EEEEEE;color:#212121;padding:10px 13px;border-radius:9px;font-size:13px;outline:none;transition:all .15s;font-family:inherit;width:100%; }
        .gt-input:focus  { border-color:#5C35C9;background:white;box-shadow:0 0 0 3px #5C35C915; }
        .gt-input.gt-err { border-color:#E53935; }
        .gt-errtxt  { font-size:11px;color:#E53935; }
        .gt-btn-pri { background:#5C35C9;color:white;border:none;padding:9px 20px;border-radius:9px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .15s; }
        .gt-btn-pri:hover { background:#4A29A8; }
        .gt-btn-sec { background:#F5F5F5;color:#616161;border:none;padding:9px 20px;border-radius:9px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .15s; }
        .gt-btn-sec:hover { background:#EEEEEE; }
        .nav-item   { display:flex;align-items:center;gap:10px;padding:10px 16px;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600;color:#9E9E9E;transition:all .15s;border:none;background:transparent;width:100%;font-family:inherit; }
        .nav-item:hover { background:#F3F0FF;color:#5C35C9; }
        .nav-active { background:#5C35C9!important;color:white!important; }
        .tr-row     { transition:background .2s; }
        .tr-row:hover td { background:#FAFAFA; }
        .tr-new td  { animation:rowIn .9s ease; }
        th { font-size:11px;font-weight:700;color:#9E9E9E;text-transform:uppercase;letter-spacing:.05em;padding:10px 14px;text-align:left;border-bottom:2px solid #F0F0F0;white-space:nowrap; }
        td { padding:11px 14px;border-bottom:1px solid #F5F5F5;font-size:13px;color:#424242;vertical-align:middle; }
      `}</style>

            {/* ── Sidebar ── */}
            <aside style={{ width: 220, background: "white", borderRight: "1px solid #F0F0F0", display: "flex", flexDirection: "column", flexShrink: 0, padding: "20px 12px" }}>
                {/* Logo */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 10px", marginBottom: 28 }}>
                    <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#FF6B35,#E53935)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" /></svg>
                    </div>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: 13, color: "#212121", lineHeight: 1.2 }}>GeoTech Ingé</div>
                        <div style={{ fontSize: 10, color: "#9E9E9E" }}>Espace Admin</div>
                    </div>
                </div>
                {/* Nav */}
                <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {NAV_ITEMS.map((item, i) => (
                        <button key={i} className={`nav-item${activeNav === i ? " nav-active" : ""}`} onClick={() => setActiveNav(i)}>
                            {item.icon} {item.label}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* ── Main area ── */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

                {/* Top bar */}
                <header style={{ background: "white", borderBottom: "1px solid #F0F0F0", height: 60, display: "flex", alignItems: "center", padding: "0 24px", gap: 16, flexShrink: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F7F8FC", borderRadius: 10, padding: "8px 14px", flex: 1, maxWidth: 320 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#BDBDBD" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                        <input placeholder="Search" style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, color: "#424242", fontFamily: "inherit", width: "100%" }} />
                    </div>
                    <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ width: 34, height: 34, background: "linear-gradient(135deg,#FF6B35,#E53935)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" /></svg>
                        </div>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: 13, color: "#212121" }}>Khalid Sraissef</div>
                            <div style={{ fontSize: 11, color: "#9E9E9E" }}>CEO GeoTech Ingé</div>
                        </div>
                        <button style={{ background: "none", border: "none", cursor: "pointer", color: "#BDBDBD" }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                        </button>
                        <button style={{ background: "none", border: "none", cursor: "pointer", color: "#BDBDBD" }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
                        </button>
                    </div>
                </header>

                {/* Content */}
                <div style={{ flex: 1, overflow: "auto", padding: "24px" }}>
                    <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>

                        {/* Left: main content */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <h2 style={{ margin: "0 0 20px", fontSize: 20, fontWeight: 800, color: "#212121" }}>Dashboard</h2>

                            {/* Stat cards */}
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
                                {[
                                    { icon: "⏰", label: "dues", value: enAttente, sub: "En attente", bg: "#FFF3E0", ic: "#FF6B35" },
                                    { icon: "📄", label: "en cours", value: enCours, sub: "En cours", bg: "#E3F2FD", ic: "#2196F3" },
                                    { icon: "✅", label: "Livré", value: livre, sub: "Payée", bg: "#E8F5E9", ic: "#4CAF50" },
                                    { icon: "💲", label: "Total dossier payé", value: `${totalPaye.toLocaleString()}`, sub: "DH", bg: "#E8F5E9", ic: "#4CAF50", big: true },
                                ].map((c, i) => (
                                    <div key={i} style={{ background: c.bg, borderRadius: 14, padding: "18px 20px", boxShadow: "0 2px 8px #0000000a" }}>
                                        <div style={{ fontSize: 22, marginBottom: 8 }}>{c.icon}</div>
                                        <div style={{ fontSize: 11, color: "#9E9E9E", fontWeight: 600, marginBottom: 4 }}>{c.label}</div>
                                        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                                            <span style={{ fontSize: c.big ? 28 : 32, fontWeight: 800, color: "#212121", lineHeight: 1 }}>{c.value}</span>
                                            {c.big && <span style={{ fontSize: 14, fontWeight: 700, color: "#4CAF50" }}>{c.sub}</span>}
                                        </div>
                                        {!c.big && <div style={{ fontSize: 11, color: "#9E9E9E", marginTop: 2 }}>{c.sub}</div>}
                                    </div>
                                ))}
                            </div>

                            {/* Table header */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#212121" }}>List Des Dossiers</h3>
                                <button className="gt-btn-pri" onClick={openNew} style={{ fontSize: 13, padding: "9px 20px", borderRadius: 10 }}>
                                    + Ajouter un Dossier
                                </button>
                            </div>

                            {/* Table */}
                            <div style={{ background: "white", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 12px #0000000d", border: "1px solid #F0F0F0" }}>
                                <div style={{ overflowX: "auto" }}>
                                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                        <thead>
                                            <tr style={{ background: "white" }}>
                                                <th style={{ width: 36, paddingRight: 0 }}>
                                                    <input type="checkbox" checked={allSelected} onChange={toggleAll} style={{ cursor: "pointer", accentColor: "#5C35C9" }} />
                                                </th>
                                                <th>Nom du dossier</th>
                                                <th>Client</th>
                                                <th>Date d'emission</th>
                                                <th>Date d'échéance</th>
                                                <th>Operateur</th>
                                                <th>Montant</th>
                                                <th>Status</th>
                                                <th>Imprimer</th>
                                                <th style={{ width: 40 }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dossiers.length === 0 ? (
                                                <tr><td colSpan={10} style={{ textAlign: "center", color: "#BDBDBD", padding: "40px", fontSize: 13 }}>Aucun dossier. Cliquez sur « Ajouter un Dossier ».</td></tr>
                                            ) : dossiers.map(d => {
                                                const sc = STATUS_CFG[d.status] || STATUS_CFG["En attente"];
                                                const isSel = selected.includes(d.id);
                                                return (
                                                    <tr key={d.id} className={`tr-row${animRow === d.id ? " tr-new" : ""}`} style={{ background: isSel ? "#F3F0FF" : "white" }}>
                                                        <td style={{ paddingRight: 0 }}>
                                                            <input type="checkbox" checked={isSel} onChange={() => toggleSelect(d.id)} style={{ cursor: "pointer", accentColor: "#5C35C9" }} />
                                                        </td>
                                                        <td>
                                                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                                <div style={{ width: 32, height: 32, background: "#FFF3E0", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                                                                </div>
                                                                <div>
                                                                    <div style={{ fontWeight: 700, fontSize: 13, color: "#212121" }}>{d.dossierName}</div>
                                                                    <div style={{ fontSize: 11, color: "#BDBDBD" }}>200 KB</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td style={{ fontWeight: 600, color: "#424242" }}>{d.clientName}</td>
                                                        <td style={{ color: "#9E9E9E", fontSize: 12 }}>{fmtDate(d.dateEmission)}</td>
                                                        <td style={{ color: "#9E9E9E", fontSize: 12 }}>{fmtDate(d.dateLivraison)}</td>
                                                        <td style={{ fontWeight: 700, color: "#212121" }}>{d.operator}</td>
                                                        <td style={{ fontWeight: 700, color: "#212121" }}>{fmtMontant(d.montant)}</td>
                                                        <td>
                                                            <span style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, padding: "3px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>
                                                                {d.status === "Livré" ? "Livrée" : d.status === "Annulé" ? "Annuler" : d.status}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <button title="Imprimer" onClick={() => window.print()} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", transition: "background .15s" }}
                                                                onMouseEnter={e => e.currentTarget.style.background = "#F5F5F5"}
                                                                onMouseLeave={e => e.currentTarget.style.background = "none"}>
                                                                <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
                                                                    <rect x="6" y="10" width="20" height="14" rx="2" fill="#5C35C9" opacity=".8" />
                                                                    <rect x="9" y="6" width="14" height="8" rx="1" fill="#7C5CBF" />
                                                                    <rect x="9" y="18" width="14" height="8" rx="1" fill="white" stroke="#E0D6F5" />
                                                                    <circle cx="24" cy="15" r="1.5" fill="#4CAF50" />
                                                                </svg>
                                                            </button>
                                                        </td>
                                                        <td>
                                                            <RowMenu onEdit={() => openEdit(d)} onDelete={() => setDeleteTarget(d)} onWhatsApp={() => setWaTarget(d)} />
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Right: Calendar + Affaires */}
                        <div style={{ width: 260, flexShrink: 0 }}>
                            <CalendarWidget />
                            <AffairesWidget affaires={AFFAIRES} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showForm && <DossierForm editingId={editingId} form={form} errors={errors} onChange={onChange} onSubmit={handleSubmit} onClose={() => setShowForm(false)} />}
            {deleteTarget && <ConfirmDelete name={deleteTarget.dossierName} onConfirm={() => handleDelete(deleteTarget.id)} onCancel={() => setDeleteTarget(null)} />}
            {waTarget && <WhatsAppModal dossier={waTarget} onClose={() => setWaTarget(null)} />}
        </div>
    );
}