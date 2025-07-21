// pages/api/listar.js
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const { filtro } = req.query;

  const hoje = new Date();
  const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const quinzeDiasAtras = new Date(hoje);
  quinzeDiasAtras.setDate(hoje.getDate() - 15);

  let filtroFormula = "";

  if (filtro === "mes") {
    filtroFormula = `IS_AFTER({Data}, "${inicioMes.toISOString()}")`;
  } else if (filtro === "15dias") {
    filtroFormula = `IS_AFTER({Data}, "${quinzeDiasAtras.toISOString()}")`;
  }

  const url = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/tbl8hCNoUkCjcO88k?${filtroFormula ? `filterByFormula=${encodeURIComponent(filtroFormula)}` : ""}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Erro ao buscar do Airtable:", data);
    return res.status(500).json({ message: "Erro ao buscar dados" });
  }

  res.status(200).json(data.records);
}
