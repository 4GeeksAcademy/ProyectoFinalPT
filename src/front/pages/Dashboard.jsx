import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../styles/ProfileGroups.css";
import ModalCreateTask from "../components/ModalCreateTask";
import TaskDetailModal from "../components/TaskDetailModal";
import { Sidebar } from "../components/Sidebar";

const TaskListItem = ({ task, onToggle, onDelete, onEdit, onClick }) => (
    <li
        className="list-group-item d-flex justify-content-between align-items-center task-list-item"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
        onClick={onClick}
    >
        <span
            className={`task-text ${task.completed ? "completed" : ""}`}
            style={{ cursor: "pointer", color: task.completed ? "#888" : "#333" }}
        >
            {task.title}
        </span>
        <div>
            <i
                className="fas fa-pencil-alt text-primary ms-2"
                onClick={(e) => {
                    e.stopPropagation();
                    onEdit(task);
                }}
                style={{ cursor: "pointer", marginRight: "10px" }}
                title="Editar"
            ></i>
            <i
                className="fas fa-trash text-danger ms-2"
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(task.id);
                }}
                style={{ cursor: "pointer" }}
                title="Eliminar"
            ></i>
        </div>
    </li>
);

export const Dashboard = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;

                const response = await fetch(
                    `${backendUrl}/api/users/${store.user.id}/tareas`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${store.token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    console.error("Error al cargar tareas:", data.msg);
                    return;
                }

                dispatch({
                    type: "LOAD_DATA_FROM_BACKEND",
                    payload: {
                        user: store.user,
                        profile: store.profile,
                        userTasks: data["Lista de todas las Tareas del usario"],
                        clans: store.clans,
                        clanTasks: [],
                        token: store.token,
                    },
                });
            } catch (error) {
                console.error("Error conectando con backend:", error);
            }
        };

        cargarDatos();
    }, []);

    const [showTaskModal, setShowTaskModal] = useState(false);
    const [taskType, setTaskType] = useState("user");
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [taskToShow, setTaskToShow] = useState(null);

    const pendingUserTasks = store.userTasks;
    const activeClan = store.clans.find((c) => c.id === store.activeClanId);
    const activeClanTasks = store.clanTasks;

    const totalPersonalExpenses = store.personalExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalClanExpenses = store.expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalExpenses = totalPersonalExpenses + totalClanExpenses;

    const openCreateModal = (type) => {
        if (type === "clan" && !store.activeClanId) {
            alert("Debes seleccionar un grupo antes de crear una tarea del clan.");
            return;
        }

        setTaskType(type);
        setTaskToEdit(null);
        setShowTaskModal(true);
    };

    const openEditModal = (task, type) => {
        setTaskType(type);
        setTaskToEdit(task);
        setShowTaskModal(true);
    };

    const toggleUserTask = (taskId) =>
        dispatch({ type: "TOGGLE_USER_TASK", payload: { taskId } });

    const deleteUserTask = async (taskId) => {
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;

            const response = await fetch(
                `${backendUrl}/api/users/${store.user.id}/tareas/${taskId}/eliminar`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${store.token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                console.error(data.msg);
                return;
            }

            dispatch({ type: "DELETE_USER_TASK", payload: { taskId } });
        } catch (err) {
            console.error("Error eliminando tarea", err);
        }
    };

    const toggleClanTask = (taskId) =>
        dispatch({ type: "TOGGLE_CLAN_TASK", payload: { taskId } });

    const deleteClanTask = (taskId) =>
        dispatch({ type: "DELETE_CLAN_TASK", payload: { taskId } });

    const handleShowDetailModal = (task) => {
        setTaskToShow(task);
        setShowDetailModal(true);
    };

    return (
        <div className="dashboard-container">
            <TaskDetailModal
                show={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                task={taskToShow}
            />

            {showTaskModal && (
                <ModalCreateTask
                    setShowTaskModal={setShowTaskModal}
                    taskType={taskType}
                    taskToEdit={taskToEdit}
                />
            )}
            {showTaskModal && <div className="modal-backdrop fade show"></div>}

            {showDetailModal && (
                <div className="modal-backdrop fade show"></div>
            )}

            <Sidebar />

            <div className="dashboard-main-content">
                <div className="dashboard-content-area page-container">
                    <div className="welcome-section">
                        <h2>Bienvenido de nuevo, {store.profile.name}</h2>
                    </div>

                    <div className="row g-4 dashboard-cards">
                        <div className="col-lg-6">
                            <div className="dashboard-card">
                                <div className="card-header-actions">
                                    <h3>Tus Tareas Pendientes</h3>
                                    <button
                                        className="btn btn-sm btn-icon-only"
                                        onClick={() => openCreateModal("user")}
                                    >
                                        <i className="fas fa-plus"></i>
                                    </button>
                                </div>
                                <ul className="list-group list-group-flush task-list">
                                    {pendingUserTasks.length > 0 ? (
                                        pendingUserTasks.map((task) => (
                                            <TaskListItem
                                                key={task.id}
                                                task={task}
                                                onToggle={toggleUserTask}
                                                onDelete={deleteUserTask}
                                                onEdit={(t) => openEditModal(t, "user")}
                                                onClick={() => handleShowDetailModal(task)}
                                            />
                                        ))
                                    ) : (
                                        <p className="text-muted text-center mt-3">
                                            No hay tareas pendientes.
                                        </p>
                                    )}
                                </ul>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="dashboard-card">
                                <div className="card-header-actions">
                                    <h3>Tareas de Clanes</h3>
                                    <button
                                        className="btn btn-sm btn-icon-only"
                                        onClick={() => openCreateModal("clan")}
                                        disabled={!store.activeClanId}
                                    >
                                        <i className="fas fa-plus"></i>
                                    </button>
                                </div>

                                {activeClan && (
                                    <p className="text-muted" style={{ marginTop: "-10px" }}>
                                        Para: <strong>{activeClan.name}</strong>
                                    </p>
                                )}

                                <ul className="list-group list-group-flush task-list">
                                    {activeClanTasks.length > 0 ? (
                                        activeClanTasks.map((task) => (
                                            <TaskListItem
                                                key={task.id}
                                                task={task}
                                                onToggle={toggleClanTask}
                                                onDelete={deleteClanTask}
                                                onEdit={(t) => openEditModal(t, 'clan')}
                                                onClick={() => handleShowDetailModal(task)}
                                            />
                                        ))
                                    ) : (
                                        <p className="text-muted text-center mt-3">
                                            No hay tareas de clan.
                                        </p>
                                    )}
                                </ul>
                            </div>
                        </div>

                        <div className="col-lg-12">
                            <div className="dashboard-card">
                                <h3 className="mb-0">Resumen Financiero</h3>
                                <div className="row">
                                    <div className="col-md-6 text-center border-end">
                                        <h4 className="text-muted">Saldo del Bote</h4>
                                        <div className="my-3">
                                            <i
                                                className="fas fa-coins fa-3x mb-2"
                                                style={{ color: "#FFD700" }}
                                            ></i>
                                            <h2 className="display-4 fw-bold text-info">
                                                {store.personalBote.toFixed(2)}€
                                            </h2>
                                        </div>
                                    </div>
                                    <div className="col-md-6 text-center">
                                        <h4 className="text-muted">Gastos del Mes</h4>
                                        <div className="my-3">
                                            <i className="fas fa-chart-line fa-3x mb-2 text-danger"></i>
                                            <h2 className="display-4 fw-bold text-danger">
                                                {totalExpenses.toFixed(2)}€
                                            </h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-12">
                            <div className="dashboard-card text-center">
                                <h3>Mensajes Recientes</h3>
                                <h1 className="display-1 my-4 text-info">
                                    <i className="fas fa-comment-dots"></i>
                                </h1>
                                <p className="text-muted">
                                    Próximamente verás tus chats aquí.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};