// === CONTROLE DE VIATURAS ===
// Script para integrar Google Planilhas com site (GitHub Pages)

// Configurações da planilha
const PLANILHA_ID = "1yQTzn5uz3F3EWNLraWoZw3aznu1mcoYA_YgQK5KlRCg"; // <-- seu ID
const NOME_ABA = "registro"; // ajuste se o nome da aba for diferente

// === FUNÇÃO: RECEBER DADOS (via POST) ===
function doPost(e) {
  try {
    const ss = SpreadsheetApp.openById(PLANILHA_ID);
    const sheet = ss.getSheetByName(NOME_ABA);

    // Captura campos enviados pelo formulário
    const motorista = e.parameter.motorista || "";
    const viatura = e.parameter.viatura || "";
    const kmSaida = e.parameter.kmSaida || "";
    const kmChegada = e.parameter.kmChegada || "";
    const observacoes = e.parameter.observacoes || "";

    // Grava uma nova linha na planilha
    sheet.appendRow([
      new Date(),
      motorista,
      viatura,
      kmSaida,
      kmChegada,
      observacoes
    ]);

    // Retorno simples
    return ContentService
      .createTextOutput("OK")
      .setMimeType(ContentService.MimeType.TEXT);

  } catch (erro) {
    return ContentService
      .createTextOutput("ERRO: " + erro.message)
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

// === FUNÇÃO: LISTAR DADOS (via GET) ===
function doGet(e) {
  try {
    const ss = SpreadsheetApp.openById(PLANILHA_ID);
    const sheet = ss.getSheetByName(NOME_ABA);
    const data = sheet.getDataRange().getValues();

    // Remove o cabeçalho (primeira linha)
    const registros = data.slice(1).map(r => ({
      data: r[0],
      motorista: r[1],
      viatura: r[2],
      kmSaida: r[3],
      kmChegada: r[4],
      observacoes: r[5]
    }));

    return ContentService
      .createTextOutput(JSON.stringify(registros))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (erro) {
    return ContentService
      .createTextOutput(JSON.stringify({ erro: erro.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
