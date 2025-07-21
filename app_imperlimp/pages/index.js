import { useState, useEffect } from "react";

export default function Home() {
  const [form, setForm] = useState({
    data: "",
    servico: "",
    valor: "",
    forma_pagamento: "",
    cliente: "",
    recibo_emitido: "",
  });

  const [status, setStatus] = useState("");

  useEffect(() => {
    const hoje = new Date().toISOString().split("T")[0];
    setForm((prev) => ({ ...prev, data: hoje }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("⏳ Salvando...");

    try {
      const res = await fetch("/api/adicionar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("✅ Serviço salvo com sucesso!");
        const hoje = new Date().toISOString().split("T")[0];
        setForm({
          data: hoje,
          servico: "",
          valor: "",
          forma_pagamento: "",
          cliente: "",
          recibo_emitido: "",
        });
      } else {
        const errData = await res.json();
        setStatus(`❌ Erro: ${errData.message || "ao salvar."}`);
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Erro de conexão.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white text-black min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Registro de Serviços
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Data</label>
          <input
            type="date"
            name="data"
            value={form.data}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Serviço</label>
          <input
            type="text"
            name="servico"
            placeholder="Ex: Sofá, Tapete..."
            value={form.servico}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Valor (€)</label>
          <input
            type="number"
            name="valor"
            placeholder="Ex: 85"
            value={form.valor}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Forma de Pagamento</label>
          <select
            name="forma_pagamento"
            value={form.forma_pagamento}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Selecione</option>
            <option value="MBWay">MBWay</option>
            <option value="Dinheiro">Dinheiro</option>
            <option value="Transferência">Transferência</option>
            <option value="Cartão">Cartão</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Cliente</label>
          <input
            type="text"
            name="cliente"
            placeholder="Nome do cliente"
            value={form.cliente}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Recibo Emitido?</label>
          <select
            name="recibo_emitido"
            value={form.recibo_emitido}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Selecione</option>
            <option value="Sim">Sim</option>
            <option value="Não">Não</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          Salvar
        </button>

        <p className="text-sm mt-2 text-center">{status}</p>
      </form>

      <div className="text-center mt-6">
        <a
          href="/dashboard"
          className="inline-block bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300"
        >
          📊 Acessar Dashboard
        </a>
      </div>
    </div>
  );
}
