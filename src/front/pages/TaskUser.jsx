import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useState } from "react";
import TaskDetailModal from "../components/TaskDetailModal";

export const TaskUser = () => {
    const { store } = useGlobalReducer();
    const tasks = store.userTasks;
    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => {
        setShowModal(true);
    };

    return (
        <div className="container mt-5 page-container">
            <TaskDetailModal show={showModal} onClose={() => setShowModal(false)} taskList={tasks} />
            <div className="row mb-4">
                <div className="col-12 text-center">
                    <h1 className="text-white display-4 fw-bold">Tareas</h1>
                    <p className="text-white-50">Tus tareas personales detalladas</p>
                </div>
            </div>
            <div className="row">
                {tasks && tasks.length > 0 ? (
                    tasks.map((task) => (
                        <div key={task.id} className="col-md-6 mb-4" onClick={handleShowModal} style={{ cursor: "pointer" }}>
                            <div
                                className="card h-100 shadow-sm border-0"
                                style={{
                                    borderRadius: "20px",
                                    backgroundColor: "#E3E8EF",
                                    padding: "20px"
                                }}
                            >
                                <div className="card-body">
                                    <h3 className="card-title fw-bold mb-4" style={{ color: "#2c3e50" }}>
                                        {task.title}
                                    </h3>
                                    <div className="card-text" style={{ fontSize: "1.1rem", color: "#4a5568" }}>
                                        <p className="mb-2">
                                            <strong>Fecha:</strong> {task.date || "No definida"}
                                            <span className="mx-3">|</span>
                                            <strong>Hora:</strong> {task.time || "--:--"}
                                        </p>
                                        <p className="mb-2">
                                            <strong>Dirección:</strong> {task.address || "Sin ubicación"}
                                        </p>
                                        <p className="mb-2">
                                            <strong>Invitados:</strong> {task.guests ? task.guests.join(", ") : "Ninguno"}
                                        </p>
                                        {task.description && (
                                            <div className="mt-3 p-3 bg-white rounded text-muted small">
                                                <em>"{task.description}"</em>
                                            </div>
                                        )}
                                        {task.latitude && (
                                            <div className="mt-2 text-success small">
                                                <i className="fas fa-map-marker-alt me-1"></i> Ubicación GPS adjunta
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center mt-5">
                        <div className="alert alert-info d-inline-block p-4 rounded-3">
                            <h4><i className="fas fa-info-circle me-2"></i> No tienes tareas pendientes</h4>
                            <p className="mb-0">Ve al <strong>Escritorio</strong> para añadir nuevas tareas personales.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};