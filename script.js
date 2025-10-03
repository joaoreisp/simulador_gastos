const cidade = document.getElementById('cidade');
const bairro = document.getElementById('bairro');
const faculdade = document.getElementById('faculdade');
const outro = document.getElementById('outro');
const transporte = document.getElementById('transporte');
const alimentacao = document.getElementById('alimentacao');
const materiais = document.getElementById('materiais');
const totalValue = document.getElementById('totalValue');
const statusText = document.getElementById('statusText');

// Função para formatar BRL
function formatBRL(n) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(n || 0);
}

// Popup dinâmica
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

// Lógica da calculadora
function calcular() {
    let b = 0;

    switch (bairro.value) {
        case '':
            totalValue.textContent = formatBRL(0);
            statusText.textContent = 'Por favor, selecione seu bairro';
            statusText.style.color = '#000';
            outro.style.display = 'none';
            outro.value = '';
            return;

        case 'centro':
            b = 600;
            outro.style.display = 'none';
            outro.value = '';
            break;

        case 'santoAntonio':
            b = 450;
            outro.style.display = 'none';
            outro.value = '';
            break;

        case 'california':
            b = 400;
            outro.style.display = 'none';
            outro.value = '';
            break;

        case 'outro':
            outro.style.display = 'flex';
            b = Number(outro.value) || 0;
            break;

        default:
            outro.style.display = 'none';
            outro.value = '';
            break;
    }

    const t = Number(transporte.value) || 0;
    const a = Number(alimentacao.value) || 0;
    const m = Number(materiais.value) || 0;

    const total = b + t + a + m;
    totalValue.textContent = formatBRL(total);

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

// Exibe campos dinamicamente
function mostrarCamposBairroFaculdade() {
    bairro.style.display = 'block';
    faculdade.style.display = 'block';
}

function mostrarCamposTransporte() {
    transporte.parentElement.style.display = 'block';
}

function mostrarCamposFinais() {
    alimentacao.parentElement.style.display = 'block';
    materiais.parentElement.style.display = 'block';
}

// Evento: quando muda cidade
cidade.addEventListener('change', () => {
    if (!cidade.value) return;

    showPopupPergunta((mesmaCidade) => {
        if (mesmaCidade) {
            mostrarCamposBairroFaculdade();
        }
    });
});

// Evento: quando muda bairro
bairro.addEventListener('change', () => {
    const bairrosComValor = ['centro', 'santoAntonio', 'california'];

    if (bairrosComValor.includes(bairro.value)) {
        transporte.parentElement.style.display = 'none';
        mostrarCamposFinais();
    } else if (bairro.value === 'outro') {
        mostrarCamposTransporte();
        mostrarCamposFinais();
    }

    calcular();
});

// Recalcular ao digitar em qualquer campo
[outro, transporte, alimentacao, materiais].forEach(el =>
    el.addEventListener('input', calcular)
);

// Também recalcula ao mudar seleções
[bairro, faculdade].forEach(el =>
    el.addEventListener('change', calcular)
);

// Executa ao carregar a página (estado inicial)
calcular();
