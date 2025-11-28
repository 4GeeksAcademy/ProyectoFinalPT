import { useState } from "react";
import "../styles/ModalPassword.css";

export default function ForgotPasswordModal({ open, onClose }) {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.msg);
      setMsg("Correo enviado. Revisa tu bandeja.");
      setEmail("");
    } catch (error) {
      setMsg(error.message);
    }
  };

  if (!open) return null;

  return (
    <div className="forgot-modal-overlay">
      <div className="forgot-modal">
        <button className="close" onClick={onClose}>✖</button>
        <h2>Recuperar contraseña</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Tu correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Enviar enlace</button>
        </form>
        {msg && <p>{msg}</p>}
      </div>
    </div>
  );
}