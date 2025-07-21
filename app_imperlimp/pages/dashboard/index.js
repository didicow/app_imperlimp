// pages/dashboard/index.js
import { useEffect, useState } from "react";
import FiltroRapido from "@/components/FiltroRapido";
import Link from "next/link";

export default function Dashboard() {
  const [dados, setDados] = useState([]);
  const [dadosFiltrados, setDadosFiltrados] = useState([]);
  const [total, setTotal] = useState(0);

  const buscarDados = async () => {
    try {
      const res = await fetch("/api/listar");
      const json = await res.json();
      const validos = json.filter((item) => item.fields && item.fields.Data);
      setDados(validos);
      setDadosFiltrados(validos);
      calcularTotal(validos);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
    }
  };

  useEffect(() => {
    buscarDados();
  }, []);

  const calcularTotal = (lista) => {
    const soma = lista.reduce((acc, item) => acc + (Number(item.fields.Valor) || 0), 0);
    setTotal(soma);
  };

  const aplicarFiltro = ({ tipo, ano, mes }) => {
    const hoje = new Date();
    let filtrado = [];

    if (tipo === "ultimos15") {
      const quinzeDiasAtras = new Date();
      quinzeDiasAtras.setDate(hoje.getDate() - 15);
      filtrado = dados.filter((item) => new Date(item.fields.Data) >= quinzeDiasAtras);
    } else if (tipo === "mesAtual") {
      filtrado = dados.filter((item) => {
        const data = new Date(item.fields.Data);
        return data.getMonth() === hoje.getMonth() && data.getFullYear() === hoje.getFullYear();
      });
    } else if (tipo === "personalizado") {
      filtrado = dados.filter((item) => {
        const data = new Date(item.fields.Data);
        const condAno = ano ? data.getFullYear() === Number(ano) : true;
        const condMes = mes ? data.getMonth() === Number(mes) : true;
        return condAno && condMes;
      });
    } else {
      filtrado = dados;
    }

    setDadosFiltrados(filtrado);
    calcularTotal(filtrado);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#dceef7] min-h-screen text-[#303030]">
      <h1 className="text-3xl font-extrabold mb-4 text-center text-[#005a77] flex items-center justify-center gap-2">
        📊 Dashboard - Registros
      </h1>
      <div className="flex justify-between mb-4">
        <FiltroRapido aoFiltrar={aplicarFiltro} />
        <Link href="/">
          <button className="ml-4 bg-[#005a77] text-white px-4 py-2 rounded-xl shadow hover:bg-[#007399] transition">
            Voltar ao Sistema
          </button>
        </Link>
      </div>

      <div className="mt-4 text-right font-bold text-xl">Total: € {total}</div>

      <div className="mt-6 space-y-4">
        {dadosFiltrados.map((item) => (
          <div key={item.id} className="border border-[#c9e6f2] bg-white p-4 rounded-xl shadow-md">
            <p><strong>🗓 Data:</strong> {item.fields.Data}</p>
            <p><strong>🧼 Serviço:</strong> {item.fields["Serviço"]}</p>
            <p><strong>💰 Valor:</strong> €{item.fields.Valor}</p>
            <p><strong>💳 Pagamento:</strong> {item.fields["Forma de Pagamento"]}</p>
            <p><strong>👤 Cliente:</strong> {item.fields.Cliente}</p>
            <p><strong>📄 Recibo:</strong> {item.fields["Recibo Emitido"]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
