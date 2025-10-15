document.querySelector("#formViatura").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const dados = new FormData(form);

  const url = "https://script.google.com/macros/s/AKfycbyG-vTPIWgWIYNEX1IKMsK5ikUxz_4ekibphO8U4_vISgDLn-yjtfAmvTw3oywMr6Me/exec";

  try {
    const resposta = await fetch(url, {
      method: "POST",
      body: dados,
      mode: "no-cors" // impede o bloqueio CORS
    });

    // Como "no-cors" não retorna resposta legível, apenas mostramos sucesso direto
    document.querySelector("#mensagem").textContent = "Registro enviado com sucesso!";
    form.reset();

  } catch (erro) {
    document.querySelector("#mensagem").textContent = "Falha na conexão.";
    console.error(erro);
  }
});
