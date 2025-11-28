import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const RecoveryPassword = () => {
    const [email, setEmail] = useState("");
    const [msg, setMsg] = useState("");
    const [error, setError] = useState("");
    const [step, setStep] = useState(1);
    const [token, setToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const location = useLocation();

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const urlToken = params.get("token");
        const urlEmail = params.get("email");
        if (urlToken) {
            setToken(urlToken);
            setEmail(urlEmail || "");
            setStep(2);
        }
    }, [location.search]);

    const handleSendEmail = async (e) => {
        e.preventDefault();
        setError("");
        setMsg("");
        try {
            const res = await fetch(`${backendUrl}/api/users/recover-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.msg || "Error al enviar email");
                return;
            }
            setMsg("Te hemos enviado un correo con instrucciones para recuperar tu contraseña.");
            setStep(2);
        } catch (err) {
            setError("Error de conexión");
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError("");
        setMsg("");
        if (newPassword !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }
        try {
            const res = await fetch(`${backendUrl}/api/users/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, email, newPassword, confirmPassword })
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.msg || "Error al cambiar la contraseña");
                return;
            }
            setMsg("Contraseña cambiada correctamente. Ya puedes iniciar sesión.");
            setStep(3);
        } catch (err) {
            setError("Error de conexión");
        }
    };

    return (
        <div className="container" style={{ maxWidth: 400, margin: "60px auto" }}>
            <h2 className="mb-4 text-center">Recuperar contraseña</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {msg && <div className="alert alert-success">{msg}</div>}
            {step === 1 && (
                <form onSubmit={handleSendEmail}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email de registro</label>
                        <input type="email" className="form-control" id="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Enviar</button>
                </form>
            )}
            {step === 2 && (
                <form onSubmit={handleChangePassword}>
                    {/* Token oculto, solo se mantiene en estado */}
                    <div className="mb-3">
                        <label htmlFor="newPassword" className="form-label">Nueva contraseña</label>
                        <input
                            type={showNewPassword ? "text" : "password"}
                            className="form-control"
                            id="newPassword"
                            value={newPassword}
                            onChange={e => {
                                setNewPassword(e.target.value);
                                setShowNewPassword(true);
                                setTimeout(() => setShowNewPassword(false), 1000);
                            }}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">Confirmar nueva contraseña</label>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            className="form-control"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={e => {
                                setConfirmPassword(e.target.value);
                                setShowConfirmPassword(true);
                                setTimeout(() => setShowConfirmPassword(false), 1000);
                            }}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-success w-100">Cambiar contraseña</button>
                </form>
            )}
            {step === 3 && (
                <div className="text-center">
                    <p>Contraseña cambiada correctamente.</p>
                    <a href="/login" className="btn btn-primary">Ir a iniciar sesión</a>
                </div>
            )}
        </div>
    );
};

export default RecoveryPassword;
