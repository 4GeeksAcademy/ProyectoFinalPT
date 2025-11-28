import React from "react";

function TaskDetailModal({ show, onClose, taskList }) {
    if (!show) return null;
    return (
        <div className="modal" tabIndex="-1" style={{ display: "block", backgroundColor: "rgba(44,62,80,0.25)", position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 2147483647, overflowY: "auto" }}>
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 900 }}>
                <div className="modal-content" style={{ background: "#fff", borderRadius: 20 }}>
                    <div className="modal-header" style={{ background: "#1e91ed", color: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                        <h5 className="modal-title" style={{ fontWeight: 700, fontSize: 28 }}>Detalle de las Tareas</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body" style={{ padding: 32 }}>
                        <div className="row g-4">
                            {taskList.map((t) => (
                                <div key={t.id} className="col-md-6">
                                    <div style={{ background: "#fff", borderRadius: 16, padding: 20, marginBottom: 18, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                                        <h4 style={{ color: "#222", fontWeight: 700, marginBottom: 12 }}>{t.title || "Sin título"}</h4>
                                        <p style={{ color: "#222", marginBottom: 8 }}><strong>Fecha:</strong> {t.date || "Sin fecha"}</p>
                                        <p style={{ color: "#222", marginBottom: 8 }}><strong>Descripción:</strong> {t.description || "Sin descripción"}</p>
                                        <p style={{ color: "#222", marginBottom: 8 }}><strong>Dirección:</strong> {t.address || "Sin dirección"}</p>
                                        <p style={{ color: "#222", marginBottom: 8 }}><strong>Latitud:</strong> {t.latitude || "-"}</p>
                                        <p style={{ color: "#222", marginBottom: 8 }}><strong>Longitud:</strong> {t.longitude || "-"}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="modal-footer" style={{ borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
                        <button type="button" className="btn btn-custom-blue" onClick={onClose} style={{ fontWeight: 600, fontSize: 18 }}>Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TaskDetailModal;
