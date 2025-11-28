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



    // Estados
    const [titulo, setTitulo] = useState("");
    const [fecha, setFecha] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [direccion, setDireccion] = useState("");
    const [date, setDate] = useState("");
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");

    const [msg, setMsg] = useState("");

    useEffect(() => {
        if (taskToEdit) {
            setTitulo(taskToEdit.title || "");
            setFecha(taskToEdit.date || "");
            setDescripcion(taskToEdit.description || "");
            setDireccion(taskToEdit.address || "");
            setLat(taskToEdit.lat || "");
            setLng(taskToEdit.lng || "");
        } else {
            setTitulo("");
            setFecha("");
            setDescripcion("");
            setDireccion("");
        }
    }, [taskToEdit]);

    // Solo un input de dirección, sincronizado con el mapa

    useEffect(() => {
        if (taskToEdit) {
            setTitulo(taskToEdit.title || "");
            setDescripcion(taskToEdit.description || "");
            setDireccion(taskToEdit.address || "");
            setLat(taskToEdit.lat || "");
            setLng(taskToEdit.lng || "");
        } else {
            setTitulo("");
            setDescripcion("");
            setDireccion("");
        }
    }, [taskToEdit]);

    // Sincronización: si el mapa cambia la dirección, actualiza el input
    const handleMapAddressChange = (address) => {
        setDireccion(address);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg("");

        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        const payloadData = {
            title: titulo,
            description: descripcion,
            address: direccion,
            lat: lat,
            lng: lng,
            estado_id: null,
            evento_id: null,
            prioridad_id: null
        };

        try {
            if (taskType === "user") {

                // CREAR
                if (!isEditing) {
                    const response = await fetch(
                        `${backendUrl}/api/users/${store.user.id}/tareas`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${store.token}`
                            },
                            body: JSON.stringify(payloadData)
                        }
                    );

                    // --- DEBUG ---
                    console.log("STATUS:", response.status);
                    console.log("HEADERS:", response.headers);

                    // usamos text() en lugar de json() para ver TODO lo que responde Flask
                    const text = await response.text();
                    console.log("RAW BACKEND RESPONSE:", text);

                    let data;
                    try {
                        data = JSON.parse(text);
                    } catch (err) {
                        console.error("La respuesta NO es JSON válido:", text);
                    }
                    // --- FIN DEBUG ---

                    if (!response.ok) {
                        setMsg(data.msg || "Error creando tarea");
                        return;
                    }

                    dispatch({
                        type: "ADD_USER_TASK",
                        payload: data.tarea
                    });

                }
                // EDITAR
                else {
                    const response = await fetch(
                        `${backendUrl}/api/users/${store.user.id}/tareas/${taskToEdit.id}/editar`,
                        {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${store.token}`
                            },
                            body: JSON.stringify(payloadData)
                        }
                    );

                    const data = await response.json();

                    if (!response.ok) {
                        setMsg(data.msg || "Error editando tarea");
                        return;
                    }

                    dispatch({
                        type: "UPDATE_USER_TASK",
                        payload: data.Tarea
                    });
                }
            }

            setShowTaskModal(false);

        } catch (error) {
            console.error("Error conectando con backend:", error);
            setMsg("No se pudo conectar con el servidor");
        }
    };

    return (
        <div className="modal" tabIndex="-1" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)", padding: "3rem" }}>
            <div className="modal-dialog modal-dialog-centered">
                <form className="modal-content modal-content-dark" style={{ padding: "1.5rem" }} onSubmit={handleSubmit}>
                    <div className="modal-header">
                        <h5 className="modal-title">
                            {modalTitle}
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={() => setShowTaskModal(false)}></button>
                    </div>
                    <input
                        placeholder="Título"
                        value={titulo}
                        onChange={e => setTitulo(e.target.value)}
                        style={{ width: "100%", marginBottom: 12, border: "1px solid #1e91ed", borderRadius: 8, padding: 10 }}
                    />

                    <textarea placeholder="Descripción" value={descripcion} onChange={e => setDescripcion(e.target.value)} style={{ width: "100%", marginBottom: 12, border: "1px solid #1e91ed", borderRadius: 8, padding: 10, minHeight: 60 }} />
                    {/* Input de dirección eliminado, solo queda el campo sincronizado con el mapa */}
                    <GoogleMaps
                        lat={lat}
                        lng={lng}
                        setLat={setLat}
                        setLng={setLng}
                        address={direccion}
                        setAddress={handleMapAddressChange}
                    />
                    <div className="modal-footer" style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
                        <button type="submit" className="btn btn-custom-blue" style={{ fontWeight: 600, fontSize: 18 }}>Guardar</button>
                    </div>
                    <div style={{ color: "#7f00b2", marginTop: 16, textAlign: "center" }}>{msg}</div>
                </form>
            </div>
        </div>

    );
}

export default ModalCreateTask;