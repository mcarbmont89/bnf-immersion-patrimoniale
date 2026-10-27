import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";

// Demo lessons: standalone WebXR pages served from /public/clases.
// Each one has a hands-on activity, positional audio and an adaptive quiz.
const CLASES = [
  { id: "historia", materia: "Historia", tipo: "Recorrido", titulo: "La Biblioteca de Alejandría", minutos: 8, desc: "Tres estaciones con sonido espacial: el puerto, los copistas y el debate." },
  { id: "fisica", materia: "Física", tipo: "Simulación", titulo: "Tiro parabólico", minutos: 6, desc: "Lanza una bola, acierta la diana y descubre la regla del alcance." },
  { id: "biologia", materia: "Biología", tipo: "Objeto a escala", titulo: "La célula por dentro", minutos: 5, desc: "Explora cuatro orgánulos y escucha cada uno desde su posición." },
  { id: "idiomas", materia: "Inglés", tipo: "Diálogo", titulo: "Un mercado en inglés", minutos: 6, desc: "Pide, paga y despídete con tres vendedores que hablan desde su puesto." },
  { id: "musica", materia: "Música y sonido", tipo: "Audio espacial", titulo: "Mezcla espacial", minutos: 6, desc: "Coloca cuatro instrumentos en la sala y comprueba cómo se aclara la mezcla." },
  { id: "ciberseguridad", materia: "Ciberseguridad", tipo: "Simulacro", titulo: "Correo fiable o sospechoso", minutos: 6, desc: "Clasifica tres correos ficticios y descubre las señales de fraude." }
];

export default function Clases() {
  return (
    <div className="min-h-screen bg-[#0A0D12] text-white p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-1 text-xs text-[#00C4AA]">
          <ArrowLeft size={14} /> Retour
        </Link>
        <h1 className="mt-4 text-2xl font-semibold">Clases demo</h1>
        <p className="mt-2 text-sm text-[#9CA3AF] max-w-2xl">
          Seis clases cortas, una por tipo de escena, con sonido espacial y un quiz que indica qué repasar.
          En un visor Quest, abre la clase en su navegador y pulsa «Enter VR». Con auriculares se nota mucho más.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CLASES.map((c) => (
            <a
              key={c.id}
              href={`/clases/${c.id}.html`}
              target="_blank"
              rel="noreferrer"
              className="group rounded-xl border border-white/10 bg-[#121A20] p-4 hover:border-[#00C4AA]/60 transition-colors"
            >
              <div className="text-[10px] uppercase tracking-widest text-[#00C4AA]">{c.materia} · {c.tipo}</div>
              <div className="mt-1 text-lg font-medium">{c.titulo}</div>
              <p className="mt-2 text-sm text-[#9CA3AF]">{c.desc}</p>
              <div className="mt-3 flex items-center justify-between text-xs text-[#9CA3AF]">
                <span>{c.minutos} min</span>
                <span className="inline-flex items-center gap-1 text-[#00C4AA]">Abrir <ExternalLink size={12} /></span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
