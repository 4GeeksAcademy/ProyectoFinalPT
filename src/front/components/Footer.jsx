import { useState } from "react";
import { FaInfoCircle, FaEnvelope, FaQuoteLeft } from "react-icons/fa";

export const Footer = () => {
  const [openSection, setOpenSection] = useState(null);
  const [frase, setFrase] = useState("");

  const frasesMotivacionales = [
    "Cada tarea que completas te acerca a tu mejor versión.",
    "La productividad no es hacer más, es hacer lo correcto.",
    "Pequeños pasos constantes crean grandes resultados.",
    "Organiza tu día y tu día te organizará a ti.",
    "Tu proyecto avanza cada vez que tú avanzas."
  ];

  const generarFrase = () => {
    const random = Math.floor(Math.random() * frasesMotivacionales.length);
    setFrase(frasesMotivacionales[random]);
  };

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="footer mt-auto py-5">
      <div className="container">
        <div className="row text-center">

          <div className="col-md-4 mb-4 d-flex flex-column align-items-center">
            <button 
              className="btn btn-link text-dark d-flex flex-column align-items-center gap-2"
              onClick={() => toggleSection("info")}
            >
              <FaInfoCircle size={24} />
              <span className="fw-bold">TaskFlow</span>
            </button>
            {openSection === "info" && (
              <p className="mt-2 text-dark text-center">
                TaskFlow es una herramienta diseñada para ayudarte a organizar tus tareas,
                mejorar tu enfoque y mantener un flujo constante hacia tus objetivos,
                sean personales, académicos o profesionales.
              </p>
            )}
          </div>

          <div className="col-md-4 mb-4 d-flex flex-column align-items-center">
            <button 
              className="btn btn-link text-dark d-flex flex-column align-items-center gap-2"
              onClick={() => toggleSection("contact")}
            >
              <FaEnvelope size={24} />
              <span className="fw-bold">Contacto</span>
            </button>
            {openSection === "contact" && (
              <div className="mt-2 text-dark text-center">
                <p className="mb-1">Correo de soporte:</p>
                <p className="fw-semibold">taskflowproyect@gmail.com</p>
                <p className="text-secondary small">
                  Estamos aquí para ayudarte con dudas, sugerencias o soporte técnico.
                </p>
              </div>
            )}
          </div>

          <div className="col-md-4 mb-4 d-flex flex-column align-items-center">
            <button 
              className="btn btn-link text-dark d-flex flex-column align-items-center gap-2"
              onClick={() => {
                generarFrase();
                toggleSection("frase");
              }}
            >
              <FaQuoteLeft size={24} />
              <span className="fw-bold">Frase del día</span>
            </button>
            {openSection === "frase" && frase && (
              <h5 className="mt-3 fst-italic text-dark text-center">{frase}</h5>
            )}
          </div>

        </div>

        <div className="border-top border-secondary text-dark pt-3 mt-4 text-center small opacity-75">
          © 2025 TaskFlow — Acompañando tu organización diaria.
        </div>
      </div>
    </footer>
  );
};