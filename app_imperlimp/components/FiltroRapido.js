// components/FiltroRapido.js
import { useState } from "react";

export default function FiltroRapido({ aoFiltrar }) {
  const [mesSelecionado, setMesSelecionado] = useState("");
  const [anoSelecionado, setAnoSelecionado] = useState("");

  const aplicar = (tipo) => {
    if (tipo === "personalizado") {
      aoFiltrar({ tipo, mes: mesSelecionado, ano: anoSelecionado });
    } else {
      aoFiltrar({ tipo });
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-2 flex-wrap mb-4">
      <button
        className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
        onClick={() => aplicar("todos")}
      >
        Todos
      </button>

      <button
        className="bg-blue-200 px-3 py-1 rounded hover:bg-blue-300"
        onClick={() => aplicar("mesAtual")}
      >
        Mês Atual
      </button>

      <button
        className="bg-green-200 px-3 py-1 rounded hover:bg-green-300"
        onClick={() => aplicar("ultimos15")}
      >
        Últimos 15 dias
      </button>

      <select
        value={mesSelecionado}
        onChange={(e) => setMesSelecionado(e.target.value)}
        className="border p-1 rounded"
      >
        <option value="">Mês</option>
        {[
          "Janeiro", "Fevereiro", "Março", "Abril",
          "Maio", "Junho", "Julho", "Agosto",
          "Setembro", "Outubro", "Novembro", "Dezembro"
        ].map((nome, idx) => (
          <option key={idx} value={idx}>{nome}</option>
        ))}
      </select>

      <select
        value={anoSelecionado}
        onChange={(e) => setAnoSelecionado(e.target.value)}
        className="border p-1 rounded"
      >
        <option value="">Ano</option>
        {[2023, 2024, 2025, 2026].map((ano) => (
          <option key={ano} value={ano}>{ano}</option>
        ))}
      </select>

      <button
        className="bg-purple-300 px-3 py-1 rounded hover:bg-purple-400"
        onClick={() => aplicar("personalizado")}
      >
        Filtrar
      </button>
    </div>
  );
}
