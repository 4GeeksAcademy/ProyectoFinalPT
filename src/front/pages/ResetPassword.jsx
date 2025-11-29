import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ResetPassword.css";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const resp = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, new_password: password }),
        }
      );

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.msg);

      setMsg("Contraseña cambiada correctamente");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setMsg(error.message);
    }
  };

  return (
    <div className="reset-container">
      <h2>Restablecer contraseña</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Cambiar contraseña</button>
      </form>

      {msg && <p>{msg}</p>}
    </div>
  );
}