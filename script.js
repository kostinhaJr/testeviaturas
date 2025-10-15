document.querySelector("#formViatura").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const data = {
    motorista: form.motorista.value,
    viatura: form.viatura.value,
    kmSaida: form.kmSaida.value,
    kmChegada: form.kmChegada.value,
    observacoes: form.observacoes.value
  };

  const url = "https://script.google.com/macros/s/AKfycbyG-vTPIWgWIYNEX1IKMsK5ikUxz_4ekibphO8U4_vISgDLn-yjtfAmvTw3oywMr6Me/exec";

  try {
    const resposta = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    });

    const resultado = await resposta.json();

    document.querySelector("#mensagem").textContent =
      resultado.status === "sucesso" ? "Registro enviado com sucesso!" : "Erro ao enviar.";

    form.reset();
  } catch (erro) {
    document.querySelector("#mensagem").textContent = "Falha na conexão.";
    console.error(erro);
  }
});