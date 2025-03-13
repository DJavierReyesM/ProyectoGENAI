// SCRIPT del Chatbot con API de OpenAI
const OPENAI_API_KEY = "";

// Mensajes de contexto inicial para el chatbot
let messages = [
  {
    role: "system",
    content: "Eres un asistente experto en los Coding Bootcamps de ESPOL. Responde de forma clara y concisa, ofreciendo información sobre los programas, temáticas y beneficios."
  }
];

function toggleChatbot() {
  const container = document.getElementById("chatbotContainer");
  container.classList.toggle("hidden");
}

const chatbotForm = document.getElementById("chatbotForm");
const chatbotInput = document.getElementById("chatbotInput");
const chatbotMessages = document.getElementById("chatbotMessages");

chatbotForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userMessage = chatbotInput.value.trim();
  if (!userMessage) return;
  appendMessage("user", userMessage);
  messages.push({ role: "user", content: userMessage });
  chatbotInput.value = "";
  const assistantResponse = await getOpenAIResponse(messages);
  appendMessage("assistant", assistantResponse);
  messages.push({ role: "assistant", content: assistantResponse });
});

async function getOpenAIResponse(conversation) {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: conversation,
        max_tokens: 200,
        temperature: 0.7
      })
    });
    const data = await response.json();
    if (data.error) {
      console.error("Error de OpenAI:", data.error);
      return "Lo siento, ha ocurrido un error al procesar tu consulta.";
    }
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error al llamar a la API:", error);
    return "Lo siento, no pude procesar tu consulta en este momento.";
  }
}

function appendMessage(role, text) {
  const messageEl = document.createElement("div");
  messageEl.classList.add("whitespace-pre-wrap", "py-1", "px-2", "rounded");
  if (role === "user") {
    messageEl.classList.add("bg-gray-200", "self-end", "text-right");
    messageEl.textContent = text;
  } else {
    messageEl.classList.add("bg-gray-100", "text-left");
    messageEl.textContent = text;
  }
  chatbotMessages.appendChild(messageEl);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}