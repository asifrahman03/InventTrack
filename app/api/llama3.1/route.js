import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY, dangerouslyAllowBrowser: true });

export async function POST(request) {
  const { items } = request.json(); // Parse the JSON body

  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `Generate a summarized recipe using the following items and make the ingredients appear as a list: ${items.join(', ')}`
        },
      ],
      model: 'llama3-8b-8192',
    });

    return new Response(JSON.stringify(response), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch data from AI' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}


// import Groq from 'groq-sdk';

// const groq = new Groq({ apiKey:  process.env.NEXT_PUBLIC_GROQ_API_KEY, dangerouslyAllowBrowser: true});

// export async function POST(request) {
//   const { items } = request.body;

//   try {
//     const response = await groq.chat.completions.create({
//       messages: [
//         {
//           role: 'user',
//           content: `Generate a summarized recipe using the following items and make the ingredients appear as a list: ${items.join(', ')}`
//         },
//       ],
//       model: 'llama3-8b-8192',
//     });

//     return new Response(JSON.stringify(response), { status: 200 });
//   } catch (error) {
//     return new Response(JSON.stringify({ error: 'Failed to fetch data from AI' }), { status: 500 });
//   }
// }
// import Groq from "groq-sdk";

// const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY;
// const groq = new Groq({apiKey: GROQ_API_KEY, dangerouslyAllowBrowser: true});

// export async function main() {
//   const chatCompletion = await getGroqChatCompletion();
//   // Print the completion returned by the LLM.
//   console.log(chatCompletion.choices[0]?.message?.content || "");
// }

// export async function getGroqChatCompletion() {
//   return groq.chat.completions.create({
//     messages: [
//       {
//         role: "user",
//         content: "Explain the importance of fast language models",
//       },
//     ],
//     model: "llama3-8b-8192",
//   });
// }