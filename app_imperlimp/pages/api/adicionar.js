export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const {
    data,
    servico,
    valor,
    forma_pagamento,
    cliente,
    recibo_emitido,
  } = req.body;

  const recordData = {
    "Data": data,
    "Serviço": servico,
    "Valor": parseFloat(valor),
    "Forma de Pagamento": forma_pagamento,
    "Cliente": cliente,
    "Recibo Emitido": recibo_emitido,
  };

  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableId = "tbl8hCNoUkCjcO88k"; // 👈 ID da TABELA
  const apiUrl = `https://api.airtable.com/v0/${baseId}/${tableId}`;

  console.log("🛠️ Base ID:", baseId);
  console.log("📁 Table ID:", tableId);
  console.log("🌐 URL Final:", apiUrl);
  console.log("📦 Headers:", {
    Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
    "Content-Type": "application/json",
  });
  console.log("📤 Body:", {
    fields: recordData,
    typecast: true,
  });

  const airtableRes = await fetch(apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fields: recordData,
      typecast: true,
    }),
  });

  if (!airtableRes.ok) {
    const errorDetails = await airtableRes.json();
    console.error("❌ Erro do Airtable:", errorDetails);
    return res.status(500).json({
      message: "Erro ao salvar no Airtable",
      details: errorDetails,
    });
  }

  const result = await airtableRes.json();
  console.log("✅ Sucesso:", result);
  res.status(200).json({ message: "Salvo com sucesso", data: result });
}
