// pages/api/openrouter.js

fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
    "HTTP-Referer": `${YOUR_SITE_URL}`, // Optional, for including your app on openrouter.ai rankings.
    "X-Title": `${YOUR_SITE_NAME}`, // Optional. Shows in rankings on openrouter.ai.
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    "model": "meta-llama/llama-3.1-8b-instruct:free",
    "messages": [
      {"role": "user", "content": "What is the meaning of life?"},
    ],
  })
});
// export async function getLlamaChatCompletion(req) {
//   try {
//     const { items } = req.body;

//     const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         model: "meta-llama/llama-3.1-8b-instruct:free",
//         messages: [
//           {
//             role: "user",
//             content: `Generate a summarized recipe using the following items and make the ingredients appear as a list: ${items.join(', ')}`
//           }
//         ]
//       })
//     });

//     const data = await response.json();
//     return new Response(JSON.stringify(data), { status: 200 });
//   } catch (error) {
//     return new Response(JSON.stringify({ error: 'Failed to fetch data from AI' }), { status: 500 });
//   }
// }

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     try {
//       const response = await getLlamaChatCompletion(req);
//       const data = await response.json();
//       res.status(200).json(data);
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to fetch data from AI' });
//     }
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }

// export const config = {
//   api: {
//     bodyParser: true,
//   },
// };
