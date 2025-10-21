document.addEventListener("DOMContentLoaded", () => {

    const scriptURL = 'https://script.google.com/macros/s/AKfycbyG-vTPIWgWIYNEX1IKMsK5ikUxz_4ekibphO8U4_vISgDLn-yjtfAmvTw3oywMr6Me/exec';
    const form = document.getElementById('formViatura');
    const msg = document.getElementById('mensagem');
    let enviando = false;

    const selectViatura = document.getElementById("viatura"); // usado na página de Saída
    const selectChegada = document.getElementById("viaturaChegada"); // usado na página de Chegada
    const kmSaidaDiv = document.getElementById("buscarKmSaida");
    const kmSaidaInput = document.getElementById("kmSaidaInput");

    const tipoRegistro = document.title.includes('Saída') ? 'saida' : document.title.includes('Chegada') ? 'chegada' : '';

    const viaturas = [
        { nome: "L200", status: "disponibilidadeL200", motorista: "motoristaL200", missao: "missaoL200", infoClass: "infoL200", kmsaida: "kmSaidaL200", celulas: ["Q2", "Q3", "Q4", "Q5"] },
        { nome: "Frontier", status: "disponibilidadeFrontier", motorista: "motoristaFrontier", missao: "missaoFrontier", infoClass: "infoFrontier", kmsaida: "kmSaidaFrontier", celulas: ["R2", "R3", "R4", "R5"] },
        { nome: "Ranger", status: "disponibilidadeRanger", motorista: "motoristaRanger", missao: "missaoRanger", infoClass: "infoRanger", kmsaida: "kmSaidaRanger", celulas: ["S2", "S3", "S4", "S5"] },
        { nome: "Doblo", status: "disponibilidadeDoblo", motorista: "motoristaDoblo", missao: "missaoDoblo", infoClass: "infoDoblo", kmsaida: "kmSaidaDoblo", celulas: ["T2", "T3", "T4", "T5"] }
    ];

    const sheetId = "1yQTzn5uz3F3EWNLraWoZw3aznu1mcoYA_YgQK5KlRCg";
    const aba = "informações";

    // === ENVIO DO FORMULÁRIO ===
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();

            if (enviando) return; // se já estiver enviando, ignora
            enviando = true; // marca como enviando

            const botao = form.querySelector('button[type="submit"]');
            if (botao) botao.disabled = true; // desabilita botão

            // Aqui você coloca seu fetch normalmente
            const dados = new FormData(form);
            // dados.append('tipo', tipoRegistro); // se tiver

            fetch('SEU_SCRIPT_URL', { method: 'POST', body: dados })
                .then(res => res.json())
                .then(data => {
                    window.location.href = "registrado.html"; // redireciona
                })
                .catch(err => {
                    window.location.href = "registrado.html"; // mesmo em erro
                });
        });
    }


    // === BUSCAR CÉLULA NA PLANILHA ===
    function buscarCelula(celula, elementoId) {
        const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${aba}&range=${celula}`;
        fetch(url)
            .then(res => res.text())
            .then(text => {
                const json = JSON.parse(text.substr(47).slice(0, -2));
                const valor = json.table.rows[0]?.c[0]?.v || "—";
                const elemento = document.getElementById(elementoId);
                if (elemento) elemento.textContent = valor;
                atualizarDisponibilidade();
            })
            .catch(err => console.error(`Erro ao buscar ${elementoId}:`, err));
    }

    // === ATUALIZA TODAS AS INFORMAÇÕES ===
    function atualizarTodos() {
        viaturas.forEach(v => {
            buscarCelula(v.celulas[0], v.status);
            buscarCelula(v.celulas[1], v.motorista);
            buscarCelula(v.celulas[2], v.missao);
            buscarCelula(v.celulas[3], v.kmsaida);
        });
    }

    // === MOSTRAR/ESCONDER CARDS E BLOQUEAR SELECTS ===
    function atualizarDisponibilidade() {
        viaturas.forEach(v => {
            const statusElem = document.getElementById(v.status);
            if (!statusElem) return;

            // Normaliza o texto do status (remove acentos e espaços)
            let status = statusElem.textContent.trim().toLowerCase();
            status = status.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            // === Select Saída ===
            if (selectViatura) {
                const optionSaida = selectViatura.querySelector(`option[value="${v.nome}"]`);
                if (optionSaida) {
                    optionSaida.disabled = status !== "disponivel";
                    optionSaida.hidden = status !== "disponivel";
                }
            }

            // === Select Chegada ===
            if (selectChegada) {
                const optionChegada = selectChegada.querySelector(`option[value="${v.nome}"]`);
                if (optionChegada) {
                    optionChegada.disabled = status === "disponivel"; // só habilita se não estiver disponível
                    optionChegada.hidden = status === "disponivel";
                }
            }

            // Mostrar/esconder cards
            document.querySelectorAll(`.${v.infoClass}`).forEach(el => {
                if (status === "disponivel") el.classList.add("esconder");
                else el.classList.remove("esconder");
            });
        });
    }

    // === PREENCHER KM SAÍDA AO SELECIONAR VIATURA (só na página de Saída) ===
    if (selectViatura) {
        selectViatura.addEventListener("change", () => {
            const viaturaSelecionada = selectViatura.value;
            const v = viaturas.find(viat => viat.nome === viaturaSelecionada);
            if (!v) {
                if (kmSaidaDiv) kmSaidaDiv.textContent = "—";
                if (kmSaidaInput) kmSaidaInput.value = "";
                return;
            }

            const celulaKm = v.celulas[3]; // última célula é a KM
            const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${aba}&range=${celulaKm}`;

            fetch(url)
                .then(res => res.text())
                .then(text => {
                    const json = JSON.parse(text.substr(47).slice(0, -2));
                    const valor = json.table.rows[0]?.c[0]?.v || "—";
                    if (kmSaidaDiv) kmSaidaDiv.textContent = valor;
                    if (kmSaidaInput) kmSaidaInput.value = valor;
                })
                .catch(err => console.error(`Erro ao buscar KM da viatura ${v.nome}:`, err));
        });
    }

    // === ATUALIZA AUTOMATICAMENTE A CADA 5 SEGUNDOS ===
    atualizarTodos();
    setInterval(atualizarTodos, 5000);

});
