// Elementos da calculadora
const cidadeSelect = document.getElementById('cidade');
const faculdadeSelect = document.getElementById('faculdade');
const bairroSelect = document.getElementById('bairro');
const aluguelInput = document.getElementById('aluguel');
const transporteInput = document.getElementById('transporte');
const alimentacaoInput = document.getElementById('alimentacao');
const materiaisInput = document.getElementById('materiais');
const usaRuCheckbox = document.getElementById('usaRu');
const ruOptionsDiv = document.getElementById('ru-options');
const ruLabel = document.getElementById('ru-label');

const totalValue = document.getElementById('totalValue');
const statusText = document.getElementById('statusText');
const alertMessage = document.getElementById('alertMessage');

// Custos fixos do Requisito
const CUSTOS = {
    TRANSPORTE_ITABUNA: 150, // R$150/mês
    TRANSPORTE_ILHEUS_OUTROS: 176, // R$160-176/mês -> usando o máximo
    ALIMENTACAO_PADRAO: 300, // Padrão R$300/mês (UFSB, UESC sem R.U., Salobrinho sem R.U.)
    ALIMENTACAO_UNEX: 350, // UNEX R$350/mês
    CUSTO_RU: 44, // R.U. R$44/mês se almoçar todos os dias
    TRANSPORTE_SALOBRINHO: 0, // Salobrinho R$0
};

// Dados de Bairros por Cidade (RF01, RF03)
const BAIRROS_POR_CIDADE = {
    Itabuna: ['Centro', 'Santo Antônio', 'São Caetano', 'Nova Itabuna', 'Ferradas'],
    Ilhéus: ['Salobrinho', 'Centro', 'Pontal', 'Barra', 'Teotônio Vilela', 'Nelson Costa'],
};

function formatBRL(n) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n || 0);
}

// NOVO: Lógica de habilitação dos campos de Cidade e Bairro
function handleFaculdadeChange() {
    const faculdade = faculdadeSelect.value;

    // Garante que Cidade e Bairro comecem desabilitados
    cidadeSelect.disabled = true;
    bairroSelect.disabled = true;

    if (faculdade) {
        // Habilita o campo Cidade
        cidadeSelect.disabled = false;

        if (faculdade === 'UNEX') {
            // Regra UNEX: Força Itabuna e desabilita a mudança de cidade
            cidadeSelect.value = 'Itabuna';
            cidadeSelect.disabled = true;

            // Força o evento 'input' para popular os bairros e recalcular
            cidadeSelect.dispatchEvent(new Event('input'));

        } else if (cidadeSelect.value === 'Itabuna' && faculdade !== 'UNEX') {
            // Se a cidade foi forçada antes para Itabuna (UNEX), e agora mudou para UESC/UFSB,
            // limpamos o campo para forçar o usuário a escolher a cidade correta.
            cidadeSelect.value = '';
            cidadeSelect.disabled = false;
        }

    } else {
        // Nenhuma faculdade selecionada, limpa a cidade e recalcula
        cidadeSelect.value = '';
    }

    // Chama o cálculo para atualizar os custos
    calcular();
}

// 1. Lógica de População de Bairros (RF01, RF03)
function popularBairros() {
    const cidade = cidadeSelect.value;
    bairroSelect.innerHTML = '<option value="">Selecione o bairro</option>';
    bairroSelect.disabled = true; // Começa desabilitado

    if (cidade) {
        // Popula os bairros
        const bairros = BAIRROS_POR_CIDADE[cidade];
        bairros.forEach(b => {
            const option = document.createElement('option');
            option.value = b;
            option.textContent = b;
            bairroSelect.appendChild(option);
        });

        // Habilita o bairro APÓS a população
        bairroSelect.disabled = false;
    }
}

// 2. Lógica de Cálculo de Transporte (RF04)
function calcularTransporte() {
    const cidade = cidadeSelect.value;
    const bairro = bairroSelect.value;
    let custoTransporte = 0;

    if (cidade === 'Itabuna') {
        custoTransporte = CUSTOS.TRANSPORTE_ITABUNA; // R$150/mês
    } else if (cidade === 'Ilhéus') {
        if (bairro === 'Salobrinho') {
            custoTransporte = CUSTOS.TRANSPORTE_SALOBRINHO; // R$0
        } else {
            custoTransporte = CUSTOS.TRANSPORTE_ILHEUS_OUTROS; // R$176/mês
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
    let custoAlimentacao = CUSTOS.ALIMENTACAO_PADRAO;

    // Exibir/Esconder e configurar opções de R.U.
    ruOptionsDiv.style.display = 'none';

    if (faculdade === 'UNEX') {
        custoAlimentacao = CUSTOS.ALIMENTACAO_UNEX; // R$350 (sem R.U.)
    } else if (faculdade === 'UESC') {
        ruOptionsDiv.style.display = 'block';
        ruLabel.textContent = 'Sim, desejo usar o Restaurante Universitário (R.U.) - Custo de R$44/mês.';

        if (usaRu) {
            custoAlimentacao = CUSTOS.CUSTO_RU; // R$44
        } else {
            custoAlimentacao = CUSTOS.ALIMENTACAO_PADRAO; // R$300 (sem R.U.)
        }
    } else if (faculdade === 'UFSB') {
        // UFSB usa o padrão R$300
        custoAlimentacao = CUSTOS.ALIMENTACAO_PADRAO;
    }

    // Regra de exceção: Salobrinho
    if (bairro === 'Salobrinho' && faculdade !== 'UNEX') {
        // Salobrinho tem R.U. opcional independente da faculdade (exceto UNEX)
        ruOptionsDiv.style.display = 'block';
        ruLabel.textContent = 'Sim, desejo usar o R.U. de Salobrinho (opcional) - Custo de R$44/mês.';

        if (usaRu) {
            custoAlimentacao = CUSTOS.CUSTO_RU; // R$44
        } else if (faculdade !== 'UESC') {
            custoAlimentacao = CUSTOS.ALIMENTACAO_PADRAO; // R$300 (padrão Salobrinho sem R.U.)
        }
    }

    alimentacaoInput.value = formatBRL(custoAlimentacao);
    return custoAlimentacao;
}


// 4. Cálculo Total (RF06) e Alertas (RF07)
function calcular() {
    // popularBairros é chamado separadamente e através do evento 'input' da Cidade
    // O objetivo aqui é apenas recalcular custos

    const aluguel = Number(aluguelInput.value) || 0;
    const custoTransporte = calcularTransporte(); // RF04
    const custoAlimentacao = calcularAlimentacao(); // RF05
    const materiais = Number(materiaisInput.value) || 0;

    // RF06 - Soma
    const total = aluguel + custoTransporte + custoAlimentacao + materiais;
    totalValue.textContent = formatBRL(total);

    // RF07 - Mensagens de Alerta e Recomendações
    let status = '';
    let cor = '';
    let dica = '';

    if (total <= 1200) {
        status = 'Seus gastos estão baixos';
        cor = '#2b7a3a';
        dica = 'Excelente planejamento! Considere separar uma reserva de emergência.';
    } else if (total <= 2200) {
        status = 'Seus gastos estão moderados';
        cor = '#a67b00';
        dica = 'Se precisar economizar, reveja o valor do seu aluguel ou use o R.U.';
    } else {
        status = 'Seus gastos estão altos';
        cor = '#a02b2b';
        dica = 'ALERTA! Procure alternativas mais baratas de moradia. Morar em Salobrinho pode economizar R$176/mês no transporte.';
    }

    statusText.textContent = status;
    statusText.style.color = cor;
    alertMessage.textContent = dica;
}

// Event Listeners:
// 1. Faculdade muda -> Lógica de Habilitação da Cidade
faculdadeSelect.addEventListener('input', handleFaculdadeChange);

// 2. Cidade muda -> Popula Bairros e Recalcula
cidadeSelect.addEventListener('input', popularBairros);
cidadeSelect.addEventListener('input', calcular);

// 3. Bairro, Aluguel e R.U. mudam -> Recalcula custos
[bairroSelect, aluguelInput, usaRuCheckbox].forEach(el => el.addEventListener('input', calcular));

// Inicialização:
handleFaculdadeChange(); // Seta o estado inicial (tudo desabilitado, exceto faculdade)