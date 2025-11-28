import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Form from "../components/Form.jsx";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.successMessage;
  const { dispatch } = useGlobalReducer();

  const handleLogin = async ({ email, password, setErrorMsn }) => {
    setErrorMsn(null);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    try {
      const response = await fetch(`${backendUrl}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsn(data.msg || "Error en el inicio de sesión");
        console.error(data.msg || "Error en el inicio de sesión");
        return;
      }

      const user = data.user;

      dispatch({ type: "SET_TOKEN", payload: { token: data.token } });
      dispatch({
        type: "LOAD_DATA_FROM_BACKEND",
        payload: {
          user,
          profile: {
            id: user.id,
            name: user.name || "",
            email: user.email || "",
            photo: user.photo || "",
            bio: user.bio || "",
            city: user.city || "",
            age: user.age || 0,
            phone: user.phone || "",
            gender: user.gender || "",
            instagram: user.instagram || "",
            twitter: user.twitter || "",
            facebook: user.facebook || ""
          },
          userTasks: data.userTasks || [],
          clans: data.clans || [],
          clanTasks: data.clanTasks || []
        },
      });

      navigate("/dashboard", {
        state: { successMessage: "Inicio de sesión exitoso" },
      });
    } catch (error) {
      setErrorMsn("Error al conectar con el servidor");
      console.error("Error al conectar con el servidor", error);
    }
  };

  return <Form mode="login" onSubmit={handleLogin} successMessage={successMessage} />;
};

export default Login;