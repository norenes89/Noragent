// pages/api/agent.ts

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Kun POST støttes" });
  }

  const { task } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "API-nøkkel mangler" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: task,
          },
        ],
        temperature: 0.7,
      }),
    });

    const json = await response.json();
    const result = json.choices?.[0]?.message?.content || "Ingen respons fra modellen.";

    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ error: "Feil ved henting av OpenAI-resultat." });
  }
}
