// Lógica simples da calculadora
const transporte = document.getElementById('transporte');
const alimentacao = document.getElementById('alimentacao');
const materiais = document.getElementById('materiais');
const totalValue = document.getElementById('totalValue');
const statusText = document.getElementById('statusText');

function formatBRL(n) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(n || 0);
}

function showPopupPergunta(callback) {
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.innerHTML = `
    <div class="popup">
      <p>Você pertence à mesma cidade da faculdade?</p>
      <button id="btnSim">Sim</button>
      <button id="btnNao">Não</button>
    </div>
  `;
    document.body.appendChild(overlay);

    document.getElementById('btnSim').onclick = () => {
        document.body.removeChild(overlay);
        callback(true);
    };

    document.getElementById('btnNao').onclick = () => {
        document.body.removeChild(overlay);
        callback(false);
    };
}

function showPopupDistancia(callback) {
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.innerHTML = `
    <div class="popup">
      <p>Sua faculdade é distante o suficiente para precisar de transporte?</p>
      <button id="btnSimDistancia">Sim</button>
      <button id="btnNaoDistancia">Não</button>
    </div>
  `;
    document.body.appendChild(overlay);

    document.getElementById('btnSimDistancia').onclick = () => {
        document.body.removeChild(overlay);
        callback(true);
    };

    document.getElementById('btnNaoDistancia').onclick = () => {
        document.body.removeChild(overlay);
        callback(false);
    };
}

function resetarCampos() {
    bairro.value = '';
    outro.value = '';
    transporte.value = '';
    alimentacao.value = '';
    valorMensalidade.value = '';
    qtdIdas.value = '';

    bairro.style.display = 'none';
    outro.style.display = 'none';
    transporteBox.style.display = 'none';
    alimentacao.parentElement.style.display = 'none';
    mensalidadeBox.style.display = 'none';
    qtdIdasBox.style.display = 'none';
}

function mostrarMensalidade() {
    mensalidadeBox.style.display = 'block';
}

function mostrarAlimentacaoEMensalidade() {
    alimentacao.parentElement.style.display = 'block';
    mostrarMensalidade();
}

// Função para obter o número puro (para cálculo) de um input formatado (texto)
const parseCurrency = (input) => {
    if (!input || input.disabled) return 0;

    // Remove R$, pontos (milhares) e substitui vírgula por ponto (decimal) para conversão
    const value = input.value.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
    return parseFloat(value) || 0;
};


// Função para formatar inputs de valor (Aluguel, Materiais) em tempo real
function formatCurrencyInput(event) {
    let input = event.target;
    let value = input.value.replace(/\D/g, ''); // 1. Remove todos os não-dígitos

    if (!value) {
        input.value = '';
        calcular();
        return;
    }

    // 2. Converte para float (centavos)
    let floatValue = parseFloat(value) / 100;

    // 3. Formata para o padrão BRL (R$ X.XXX,XX)
    const formattedValue = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(floatValue);

    // 4. CORREÇÃO: Mantém o símbolo "R$" para o campo de input
    input.value = formattedValue.trim();

    calcular();
}

// Lógica de habilitação dos campos de Cidade, Aluguel e Materiais
function handleFaculdadeChange() {
    const faculdade = faculdadeSelect.value;

    // Garante que Cidade, Bairro, Aluguel e Materiais comecem desabilitados
    cidadeSelect.disabled = true;
    bairroSelect.disabled = true;
    aluguelInput.disabled = true;
    materiaisInput.disabled = true;

    if (faculdade) {
        // Habilita Cidade, Aluguel e Materiais
        cidadeSelect.disabled = false;
        aluguelInput.disabled = false;
        materiaisInput.disabled = false;

        if (faculdade === 'UNEX') {
            // Regra UNEX: Força Itabuna e desabilita a mudança de cidade
            cidadeSelect.value = 'Itabuna';
            cidadeSelect.disabled = true;

            // Força o evento 'input' para popular os bairros e recalcular
            cidadeSelect.dispatchEvent(new Event('input'));

        } else if (cidadeSelect.value === 'Itabuna' && faculdade !== 'UNEX') {
            // Limpa o campo se a cidade foi forçada antes (UNEX)
            cidadeSelect.value = '';
            cidadeSelect.disabled = false;
        }

    } else {
        // Nenhuma faculdade selecionada, limpa a cidade e recalcula
        cidadeSelect.value = '';
    }

    calcular();
}

// 1. Lógica de População de Bairros (RF01, RF03)
function popularBairros() {
    const cidade = cidadeSelect.value;
    bairroSelect.innerHTML = '<option value="">Selecione o bairro</option>';
    bairroSelect.disabled = true;

    if (cidade) {
        const bairros = BAIRROS_POR_CIDADE[cidade];
        bairros.forEach(b => {
            const option = document.createElement('option');
            option.value = b;
            option.textContent = b;
            bairroSelect.appendChild(option);
        });
        bairroSelect.disabled = false;
    }
}

// 2. Lógica de Cálculo de Transporte (RF04)
function calcularTransporte() {
    const cidade = cidadeSelect.value;
    const bairro = bairroSelect.value;
    let custoTransporte = 0;

    if (cidade === 'Itabuna') {
        custoTransporte = CUSTOS.TRANSPORTE_ITABUNA;
    } else if (cidade === 'Ilhéus') {
        if (bairro === 'Salobrinho') {
            custoTransporte = CUSTOS.TRANSPORTE_SALOBRINHO;
        } else {
            custoTransporte = CUSTOS.TRANSPORTE_ILHEUS_OUTROS;
        }
    }

    transporteInput.value = formatBRL(custoTransporte);
    return custoTransporte;
}

// 3. Lógica de Cálculo de Alimentação (RF05)
function calcularAlimentacao() {
    const faculdade = faculdadeSelect.value;
    const bairro = bairroSelect.value;
    const usaRu = usaRuCheckbox.checked;

    // Alimentação começa em 0 e só é calculada se a faculdade for selecionada
    let custoAlimentacao = 0;

    // Exibir/Esconder e configurar opções de R.U.
    ruOptionsDiv.style.display = 'none';

    if (faculdade) {
        // Define o padrão antes das regras do R.U.
        custoAlimentacao = CUSTOS.ALIMENTACAO_PADRAO;

        if (faculdade === 'UNEX') {
            custoAlimentacao = CUSTOS.ALIMENTACAO_UNEX;
        } else if (faculdade === 'UESC') {
            ruOptionsDiv.style.display = 'block';
            ruLabel.textContent = 'Sim, desejo usar o Restaurante Universitário (R.U.) - Custo de R$44/mês.';

            if (usaRu) {
                custoAlimentacao = CUSTOS.CUSTO_RU;
            } else {
                custoAlimentacao = CUSTOS.ALIMENTACAO_PADRAO;
            }
        }

        // Regra de exceção: Salobrinho (sobrescreve UESC/UFSB se R.U. for usado)
        if (bairro === 'Salobrinho' && faculdade !== 'UNEX') {
            ruOptionsDiv.style.display = 'block';
            ruLabel.textContent = 'Sim, desejo usar o R.U. de Salobrinho (opcional) - Custo de R$44/mês.';

            if (usaRu) {
                custoAlimentacao = CUSTOS.CUSTO_RU;
            } else {
                custoAlimentacao = CUSTOS.ALIMENTACAO_PADRAO;
            }
        }
    }

    alimentacaoInput.value = formatBRL(custoAlimentacao);
    return custoAlimentacao;
}


// 4. Cálculo Total (RF06) e Alertas (RF07)
function calcular() {
    const t = Number(transporte.value) || 0;
    const a = Number(alimentacao.value) || 0;
    const m = Number(materiais.value) || 0;
    const total = t + a + m;
    totalValue.textContent = formatBRL(total);

    // Regra heurística para classificação:
    // - Abaixo de R$ 800 => baixo
    // - R$ 800 a R$ 1800 => médio
    // - Acima de R$ 1800 => alto
    if (total <= 800) {
        statusText.textContent = 'Seus gastos estão baixos';
        statusText.style.color = '#2b7a3a';
    } else if (total <= 1800) {
        statusText.textContent = 'Seus gastos estão moderados';
        statusText.style.color = '#a67b00';
    } else {
        statusText.textContent = 'Seus gastos estão altos';
        statusText.style.color = '#a02b2b';
    }
}

// recalcula quando qualquer campo muda
[transporte, alimentacao, materiais].forEach(el => el.addEventListener('input', calcular));

// calcula ao carregar (mostra 0)
calcular();