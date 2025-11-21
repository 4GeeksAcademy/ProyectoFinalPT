import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import GoogleMaps from "../components/GoogleMaps";

function ModalCreateTask({ setShowTaskModal, taskType, taskToEdit = null }) {
    const { store, dispatch } = useGlobalReducer();
    const activeClanId = store.activeClanId;

    const isEditing = !!taskToEdit;
    const modalTitle = isEditing 
        ? (taskType === 'user' ? "Editar Tarea Personal" : "Editar Tarea de Clan")
        : (taskType === 'user' ? "Nueva Tarea Personal" : "Nueva Tarea de Clan");

    const buttonColor = taskType === 'user' ? "btn-custom-blue" : "btn-custom-purple";
    const buttonText = isEditing ? "Guardar Cambios" : "Crear Tarea";

    // Estados
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [direccion, setDireccion] = useState("");
    const [date, setDate] = useState("");
    const [lat, setLat] = useState(20);
    const [lng, setLng] = useState(-99);

    const [msg, setMsg] = useState("");

    // EFECTO: Rellena el formulario si estamos editando
    useEffect(() => {
        if (taskToEdit) {
            setTitulo(taskToEdit.title || "");
            setDescripcion(taskToEdit.description || "");
            setDireccion(taskToEdit.address || "");
            setLat(taskToEdit.latitude || 20);
            setLng(taskToEdit.longitude || -99);
        } else {
            // Limpiar si es creación nueva
            setTitulo("");
            setDescripcion("");
            setDireccion("");
        }
    }, [taskToEdit]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setMsg("");


   if (!titulo.trim()) { 
            setMsg("El título es obligatorio.");
            return;
        }
  setTitulo("");
        setDescripcion("");
        setDireccion("");
        setDate("");
        setLat("");
        setLng("");
        setMsg("Tarea creada (mock)");

        const payloadData = {
            id: taskToEdit ? taskToEdit.id : undefined, // Importante para editar
            title: titulo,
            description: descripcion,
            address: direccion,
            latitude: lat,
            longitude: lng,
        };

        if (taskType === 'clan') {
            if (!isEditing && !activeClanId) {
                setMsg("Error: No hay clan activo.");
                return;
            }
            // Dispatch específico para CLAN (Crear o Editar)
            dispatch({ 
                type: isEditing ? 'UPDATE_CLAN_TASK' : 'ADD_TASK_TO_CLAN', 
                payload: { ...payloadData, clanId: activeClanId } 
            });
        } else {
            // Dispatch específico para USER (Crear o Editar)
            dispatch({ 
                type: isEditing ? 'UPDATE_USER_TASK' : 'ADD_USER_TASK', 
                payload: payloadData 
            });
        }

        setShowTaskModal(false); 
    };

    return (
        <div className="modal" tabIndex="-1" style={{ display: "block" }}>
            <form className="Form modal-dialog modal-dialog-centered" onSubmit={handleSubmit}>
                <div className="modal-header">
                    <h5 className="modal-title" style={{ color: "#1e91ed" }}>
                        Añadir Tarea de Clan
                    </h5>
                </div>
                <input placeholder="Título" value={titulo} onChange={e => setTitulo(e.target.value)} style={{ width: "100%", marginBottom: 12, border: "1px solid #1e91ed", borderRadius: 8, padding: 10 }} />
                <input 
                    type="text"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    placeholder="Fecha"
                    style={{ width: "100%", marginBottom: 12, border: "1px solid #1e91ed", borderRadius: 8, padding: 10, color: date ? '#1e91ed' : '#bdbdbd' }}
                    pattern="^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[012])/\d{4}$"
                    title="Formato: dd/mm/aaaa"
                    inputMode="numeric"
                />
                <textarea placeholder="Descripción" value={descripcion} onChange={e => setDescripcion(e.target.value)} style={{ width: "100%", marginBottom: 12, border: "1px solid #1e91ed", borderRadius: 8, padding: 10, minHeight: 60 }} />
                <input placeholder="Dirección" value={direccion} onChange={e => setDireccion(e.target.value)} style={{ width: "100%", marginBottom: 12, border: "1px solid #1e91ed", borderRadius: 8, padding: 10 }} />
                <GoogleMaps lat={lat} lng={lng} setLat={setLat} setLng={setLng} />
                <div className="modal-footer" style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowTaskModal(false)} style={{ fontWeight: 600, fontSize: 18 }}>Cancelar</button>
                    <button type="submit" className="btn btn-custom-blue" style={{ fontWeight: 600, fontSize: 18 }}>Crear tarea</button>
                </div>
                <div style={{ color: "#7f00b2", marginTop: 16, textAlign: "center" }}>{msg}</div>
            </form>
        </div>
    );
}

export default ModalCreateTask;