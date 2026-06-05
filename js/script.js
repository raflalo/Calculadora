/* ========================================
   DETECÇÃO DE DISPOSITIVO MÓVEL
   ======================================== */
const detectarDispositivoMovel = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) || 
                     (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    if (isMobile) {
        document.body.classList.add('dispositivo-movel');
    }
};

/* ========================================
   VARIÁVEIS GLOBAIS DA CALCULADORA
   ======================================== */

// Armazena o número que está sendo digitado atualmente
let numeroAtual = '0';

// Armazena a expressão completa (com símbolos visuais)
let expressao = '';

// Armazena o último operador clicado
let ultimoOperador = '';

// Flag para controlar se um novo número deve começar
let novoNumero = true;

// Referências aos elementos do DOM
const displayResultado = document.getElementById('resultado');
const displayHistorico = document.getElementById('historico');

/* ========================================
   FUNÇÃO: Ajustar Tamanho da Fonte Dinamicamente
   Descrição: Reduz o tamanho da fonte progressivamente para manter
   o texto em uma única linha antes de permitir quebra de linhas
   ======================================== */
function ajustarTamanhoFonte() {
    // Tamanho de fonte padrão e mínimo (80% = redução máxima de 20%)
    const fontSizePadrao = 50;
    const fontSizeMinimo = fontSizePadrao * 0.65; // Redução máxima de 35% para garantir legibilidade
    
    // Obtém a largura disponível do display
    const larguraMaxima = displayResultado.parentElement.clientWidth - 10;
    
    // Inicia com o tamanho padrão
    let fontSizeAtual = fontSizePadrao;
    
    // Cria um elemento auxiliar para medir sem afetar o display
    const teste = document.createElement('div');
    teste.style.position = 'absolute';
    teste.style.left = '-9999px';
    teste.style.top = '-9999px';
    teste.style.fontFamily = window.getComputedStyle(displayResultado).fontFamily;
    teste.style.fontWeight = window.getComputedStyle(displayResultado).fontWeight;
    teste.style.lineHeight = '1.2';
    teste.style.whiteSpace = 'nowrap';
    teste.style.visibility = 'hidden';
    teste.textContent = displayResultado.textContent;
    document.body.appendChild(teste);
    
    // Reduz progressivamente até caber em uma linha ou atingir o mínimo
    while (fontSizeAtual > fontSizeMinimo) {
        teste.style.fontSize = fontSizeAtual + 'px';
        if (teste.offsetWidth <= larguraMaxima) {
            break;
        }
        fontSizeAtual--;
    }
    
    const precisaFade = teste.offsetWidth > larguraMaxima;

    // Medição extra para o histórico, garantindo que o fade funcione com o novo layout
    teste.style.fontSize = window.getComputedStyle(displayHistorico).fontSize;
    teste.style.fontWeight = window.getComputedStyle(displayHistorico).fontWeight;
    teste.textContent = displayHistorico.textContent;
    
    const historicoOverflow = teste.offsetWidth > larguraMaxima;

    // Remove o elemento auxiliar
    document.body.removeChild(teste);
    
    // Aplica o tamanho calculado e a classe de fade se necessário
    displayResultado.style.fontSize = fontSizeAtual + 'px';
    displayResultado.parentElement.classList.toggle('fade-out', precisaFade || historicoOverflow);
}

/* ========================================
   FUNÇÃO: Atualizar Display
   Descrição: Atualiza os displays do resultado e histórico
   ======================================== */
function atualizarDisplay() {
    // Formata apenas o número atual para exibição, mantendo o valor interno sem pontos
    const numeroExibicao = formatarNumeroString(numeroAtual);

    if (expressao !== '') {
        displayResultado.textContent = formatarExpressaoString(expressao) + numeroExibicao;
    } else {
        displayResultado.textContent = numeroExibicao;
    }
    
    // Ajusta o tamanho da fonte dinamicamente
    ajustarTamanhoFonte();
}

function apagarHistorico() {
    displayHistorico.textContent = '';
}

/* ========================================
   FUNÇÃO: Adicionar Número
   Descrição: Adiciona um dígito ao número atual
   Parâmetro: numero - o dígito clicado (0-9)
   ======================================== */
function adicionarNumero(numero) {
    // Se é um novo número, reseta o número atual
    if (novoNumero) {
        // Se o primeiro dígito for uma vírgula, inicia como "0,"
        numeroAtual = (numero === ',') ? '0,' : numero;
        novoNumero = false;
    } else {
        // Se o número atual é 0 e não tem vírgula, substitui por novo número
        if (numeroAtual === '0' && numero !== ',') {
            numeroAtual = numero;
        } else if (numero === ',' && numeroAtual.includes(',')) {
            // Evita adicionar múltiplas vírgulas
            return;
        } else if (numero === ',' && numeroAtual === '-') {
            // Se digitar vírgula após o sinal de menos, transforma em "-0,"
            numeroAtual = '-0,';
        } else {
            numeroAtual += numero;
        }
    }
    apagarHistorico(); // Limpa o histórico para evitar confusão
    atualizarDisplay();
}

/* ========================================
   FUNÇÃO: Adicionar Operador
   Descrição: Adiciona um operador à expressão e acumula tudo
   Parâmetro: operador - o operador clicado (+, -, ×, ÷, %)
   ======================================== */
function adicionarOperador(operador) {
    // Permite usar o sinal de menos para iniciar um número negativo
    if ((numeroAtual === '' || numeroAtual === '0') && operador === '−') {
        numeroAtual = '-';
        novoNumero = false;
        atualizarDisplay();
        return;
    }

    // Evita adicionar um operador se o usuário digitou apenas o sinal de menos "-"
    if (numeroAtual === '-') {
        return;
    }

    // Se o número atual está vazio e já temos uma expressão, 
    // permite trocar o operador anterior sem precisar apagar
    if (numeroAtual === '' && expressao !== '') {
        // Remove o operador antigo (os últimos 3 caracteres: " op ") e coloca o novo
        expressao = expressao.slice(0, -3) + ' ' + operador + ' ';
        ultimoOperador = operador;
        atualizarDisplay();
        return;
    }

    // Evita adicionar operador se o número atual é vazio
    if (numeroAtual === '') {
        return;
    }

    // Se o número terminar com vírgula (ex: "6,"), remove-a antes de adicionar o operador
    if (numeroAtual.endsWith(',')) {
        numeroAtual = numeroAtual.slice(0, -1);
    }

    // Adiciona o número atual e o operador à expressão
    apagarHistorico(); //apaga o histórico para evitar confusão
    expressao += numeroAtual + ' ' + operador + ' ';
    ultimoOperador = operador;

    // Prepara para o próximo número
    numeroAtual = '';
    novoNumero = true;

    atualizarDisplay();
}

/* ========================================
   FUNÇÃO: Converter Expressão para JavaScript
   Descrição: Converte a expressão visual para expressão que o JavaScript entende
   ======================================== */
function converterExpressao(expr) {
    // Substitui os símbolos visuais pelos operadores JavaScript
    let expressaoConvertida = expr
        .replace(/,/g, '.')  // Converte vírgula em ponto para decimais
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/−/g, '-');
    
    return expressaoConvertida;
}

/* ========================================
   FUNÇÃO: Formatar Número
   Descrição: Insere separadores de milhares e converte ponto para vírgula
   ======================================== */
function formatarNumero(numero) {
    // Limita a precisão para evitar erros de ponto flutuante
    numero = Math.round(numero * 1000000000) / 1000000000;
    
    // Converte para string e substitui ponto por vírgula
    let texto = numero.toString().replace('.', ',');
    return formatarNumeroString(texto);
}

/* ========================================
   FUNÇÃO: Formatar Número de String
   Descrição: Insere pontos de milhar em números com vírgula ou inteiros
   ======================================== */
function formatarNumeroString(texto) {
    if (typeof texto !== 'string' || texto === '') {
        return texto;
    }

    let sinal = '';
    if (texto.startsWith('-')) {
        sinal = '-';
        texto = texto.slice(1);
    }

    let [parteInteira, parteDecimal] = texto.split(',');
    parteInteira = parteInteira.replace(/\D/g, '');
    parteInteira = parteInteira.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return sinal + parteInteira + (parteDecimal !== undefined ? ',' + parteDecimal : '');
}

function formatarExpressaoString(expressao) {
    return expressao
        .split(' ')
        .map((token) => {
            return /^-?\d+(,\d+)?$/.test(token) ? formatarNumeroString(token) : token;
        })
        .join(' ');
}

/* ========================================
   FUNÇÃO: Calcular Resultado Final
   Descrição: Calcula o resultado final quando o usuário aperta =
   ======================================== */
function calcularResultado() {
    // Se não há expressão ou número atual, não faz nada
    if (expressao === '' || numeroAtual === '') {
        return;
    }

    // Se o número terminar com vírgula (ex: "0,"), remove-a antes de calcular e mostrar no histórico
    if (numeroAtual.endsWith(',')) {
        numeroAtual = numeroAtual.slice(0, -1);
    }

    try {
        // Constrói a expressão completa
        let expressaoCompleta = expressao + numeroAtual;

        // Converte para expressão que o JavaScript entende
        let expressaoParaCalculo = converterExpressao(expressaoCompleta);

        // Calcula o resultado usando eval
        // NOTA: Em produção, usar um parser seguro em vez de eval
        let resultado = eval(expressaoParaCalculo);

        // Formata o resultado
        let resultadoFormatado = formatarNumero(resultado);

        // Exibe o histórico em cima (expressão visual) com separadores de milhares
        displayHistorico.textContent = formatarExpressaoString(expressaoCompleta);

        // Exibe o resultado embaixo
        displayResultado.textContent = resultadoFormatado;
        
        // Ajusta o tamanho da fonte dinamicamente para o resultado
        ajustarTamanhoFonte();

        // Reseta as variáveis para nova operação
        numeroAtual = resultadoFormatado;
        expressao = '';
        ultimoOperador = '';
        novoNumero = true;
    } catch (erro) {
        // Se houver erro na expressão, mostra mensagem de erro
        displayResultado.textContent = 'Erro';
        numeroAtual = '0';
        expressao = '';
        ultimoOperador = '';
        novoNumero = true;
    }
}

/* ========================================
   FUNÇÃO: Deletar Último Dígito
   Descrição: Remove o último dígito do número atual ou o último operador
   ======================================== */
function deletarUltimoDígito() {
    if (numeroAtual !== '' && numeroAtual !== '0') {
        // Remove o último dígito do número atual
        if (numeroAtual.length > 1) {
            numeroAtual = numeroAtual.slice(0, -1);
        } else {
            // Se não havia mais dígitos, mostra 0 se não há expressão, senão deixa vazio
            numeroAtual = expressao === '' ? '0' : '';
        }
    } else if (numeroAtual === '' && expressao !== '') {
        // Remove o último operador e restaura o número anterior
        let expressaoTrim = expressao.trimEnd();
        let partes = expressaoTrim.split(' ');

        if (partes.length >= 2) {
            partes.pop(); // remove operador
            let ultimoNumero = partes.pop();
            expressao = partes.length > 0 ? partes.join(' ') + ' ' : '';
            numeroAtual = ultimoNumero || '0';
            novoNumero = false;
        }
    } else if (numeroAtual === '0' && expressao !== '') {
        // Se o número atual está em 0 e há expressão, limpar o número atual para permitir a remoção do operador no próximo botão
        numeroAtual = '';
    } else {
        // Se não há mais nada para apagar, zera o display
        numeroAtual = '0';
    }

    apagarHistorico(); // Limpa o histórico para evitar confusão
    atualizarDisplay();
}

/* ========================================
   FUNÇÃO: Limpar Tudo
   Descrição: Reseta a calculadora para estado inicial
   ======================================== */
function limparTudo() {
    numeroAtual = '0';
    expressao = '';
    ultimoOperador = '';
    apagarHistorico(); // Limpa o histórico para evitar confusão
    novoNumero = true;
    atualizarDisplay();
}

/* ========================================
   FUNÇÃO: Calcular Porcentagem
   Descrição: Converte o número atual em porcentagem
   ======================================== */
function calcularPorcentagem() {
    if (numeroAtual === '' || numeroAtual === '-') {
        return;
    }

    let numero = parseFloat(numeroAtual.replace(',', '.'));

    if (expressao === '') {
        // Se não há expressão, transforma o número em porcentagem (divide por 100)
        numero = numero / 100;
    } else {
        // Se há expressão, calcula a porcentagem baseado no primeiro número da expressão
        // Extrai o primeiro número da expressão
        let primeiroNumero = parseFloat(expressao.split(' ')[0].replace(',', '.'));
        numero = (primeiroNumero * numero) / 100;
    }

    numeroAtual = formatarNumero(numero);
    atualizarDisplay();
}

/* ========================================
   CONFIGURAÇÃO DOS LISTENERS DOS BOTÕES
   ======================================== */

const configurarBotoes = () => {
    const mapeamento = {
        'btn-0': () => adicionarNumero('0'),
        'btn-1': () => adicionarNumero('1'),
        'btn-2': () => adicionarNumero('2'),
        'btn-3': () => adicionarNumero('3'),
        'btn-4': () => adicionarNumero('4'),
        'btn-5': () => adicionarNumero('5'),
        'btn-6': () => adicionarNumero('6'),
        'btn-7': () => adicionarNumero('7'),
        'btn-8': () => adicionarNumero('8'),
        'btn-9': () => adicionarNumero('9'),
        'btn-virgula': () => adicionarNumero(','),
        'btn-adicionar': () => adicionarOperador('+'),
        'btn-subtrair': () => adicionarOperador('−'),
        'btn-multiplicar': () => adicionarOperador('×'),
        'btn-dividir': () => adicionarOperador('÷'),
        'btn-igual': calcularResultado,
        'btn-deletar': deletarUltimoDígito,
        'btn-limpar': limparTudo,
        'btn-porcentagem': calcularPorcentagem
    };

    Object.entries(mapeamento).forEach(([id, callback]) => {
        const botao = document.getElementById(id);
        if (!botao) return;

        // Usamos 'pointerdown' para disparar a ação imediatamente ao tocar/clicar.
        // Isso resolve o bug onde pequenos deslizes cancelavam o evento 'click'.
        botao.addEventListener('pointerdown', (e) => {
            e.preventDefault(); // Evita comportamento de scroll e o evento 'click' posterior
            botao.classList.add('ativo'); // Ativa o feedback visual
            callback();
        });

        // Remove o feedback visual ao soltar ou sair do botão
        const removerAtivo = () => botao.classList.remove('ativo');
        ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => 
            botao.addEventListener(ev, removerAtivo)
        );
    });
};

configurarBotoes();

/* ========================================
   SUPORTE A TECLADO
   Permite usar o teclado para operar a calculadora
   ======================================== */
document.addEventListener('keydown', (evento) => {
    // Números
    if (evento.key >= '0' && evento.key <= '9') {
        adicionarNumero(evento.key);
    }
    // Vírgula/Ponto decimal
    else if (evento.key === ',' || evento.key === '.') {
        adicionarNumero(',');
    }
    // Operadores
    else if (evento.key === '+') {
        adicionarOperador('+');
    } else if (evento.key === '-') {
        adicionarOperador('−');
    } else if (evento.key === '*') {
        adicionarOperador('×');
    } else if (evento.key === '/') {
        evento.preventDefault(); // Evita buscar no navegador
        adicionarOperador('÷');
    }
    // Igual
    else if (evento.key === 'Enter' || evento.key === '=') {
        evento.preventDefault();
        calcularResultado();
    }
    // Backspace para deletar
    else if (evento.key === 'Backspace') {
        evento.preventDefault();
        deletarUltimoDígito();
    }
    // Escape para limpar
    else if (evento.key === 'Escape') {
        limparTudo();
    }
});

/* ========================================
   INICIALIZAÇÃO
   ======================================== */
// Garante que o tamanho da fonte está correto ao carregar a página
// e quando a janela é redimensionada
document.addEventListener('DOMContentLoaded', () => {
    detectarDispositivoMovel();
    ajustarTamanhoFonte();
});
window.addEventListener('resize', ajustarTamanhoFonte);


// Bloqueia gestos de zoom e scroll para melhorar a experiência em dispositivos móveis
document.addEventListener('DOMContentLoaded', () => {
    // 1. Bloqueia o zoom por pinça e o scroll (arrastar a tela)
    document.addEventListener('touchmove', (event) => {
        if (event.touches.length > 1 || event.touches.length === 1) {
            event.preventDefault();
        }
    }, { passive: false });

    // 2. Bloqueia o zoom por toque duplo APENAS fora dos botões da calculadora
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
        const now = new Date().getTime();
        if (now - lastTouchEnd <= 300) {
            // Se o usuário tocou em um botão, NÃO bloqueia o clique rápido
            if (event.target.tagName === 'BUTTON' || event.target.closest('button')) {
                return; 
            }
            event.preventDefault(); // Bloqueia o zoom apenas se tocar no fundo da página
        }
        lastTouchEnd = now;
    }, false);
});
