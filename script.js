// === CONFIGURAÇÃO ===
const scriptURL = 'https://script.google.com/macros/s/AKfycbyG-vTPIWgWIYNEX1IKMsK5ikUxz_4ekibphO8U4_vISgDLn-yjtfAmvTw3oywMr6Me/exec'; // <-- Seu link Apps Script

// === CAPTURA O FORMULÁRIO ===
const form = document.getElementById('formViatura');
const msg = document.getElementById('mensagem');

// === ENVIO DOS DADOS ===
form.addEventListener('submit', e => {
  e.preventDefault(); // impede o recarregamento da página

  const dados = new FormData(form);

fetch(scriptURL, {
  method: 'POST',
  body: dados
})
.then(response => response.text())
.then(data => {
  msg.textContent = "✅ Registro enviado com sucesso!";
  form.reset();
})
.catch(error => {
  msg.textContent = "❌ Erro de conexão: " + error.message;
});


