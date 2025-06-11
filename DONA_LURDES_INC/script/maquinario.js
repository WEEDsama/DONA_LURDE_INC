// 1. Função para mostrar mensagens no HTML
function mostrarMensagem(autor, texto) {
  const chat = document.getElementById('mensagens');
  chat.innerHTML += `<p><strong>${autor}:</strong> ${texto}</p>`;
  chat.scrollTop = chat.scrollHeight; // Rolagem automática
}
async function enviarMensagem() {
  const input = document.getElementById('input-usuario');
  const pergunta = input.value.trim();
  if (!pergunta) return;

  mostrarMensagem("Você", pergunta);
  input.value = "";
  mostrarMensagem("IA", "Pensando...");

  try {
      const resposta = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer sk-7c80411a17dd4418b3422a5e6f10f280'  
          },
          body: JSON.stringify({
              messages: [{ role: 'user', content: pergunta }]
          })
      });

      if (resposta.status === 401) {
          throw new Error("Chave API inválida. Obtenha uma nova em: https://platform.deepseek.com");
      }

      const data = await resposta.json();
      const respostaIA = data.choices[0].message.content;
      document.getElementById('mensagens').lastElementChild.innerHTML = 
          `<strong>IA:</strong> ${respostaIA}`;

  } catch (erro) {
      mostrarMensagem("IA", `Erro: ${erro.message}`);
  }
  
}