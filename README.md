# 📱 Calculadora Estilo iPhone

Uma calculadora web moderna e totalmente responsiva desenvolvida com HTML, CSS e JavaScript puro (Vanilla JS), projetada para replicar a experiência visual e funcional da calculadora do iOS.

## 🚀 Funcionalidades Principais

- **Interface Fiel ao iOS**: Design minimalista com suporte a temas escuros e adaptação total para dispositivos móveis.
- **Formatação Inteligente de Decimais**:
  - Preenchimento automático de zero (ex: `,` vira `0,` e `-,` vira `-0,`).
  - Limpeza automática de vírgulas pendentes ao calcular ou adicionar operadores.
- **Tamanho de Fonte Dinâmico**: O texto diminui automaticamente para evitar que números longos quebrem o layout do display.
- **Histórico de Expressão**: Exibe a conta completa na parte superior antes de mostrar o resultado final.
- **Formatação Regional**: Exibição de números com pontos de milhar e vírgula decimal, seguindo o padrão brasileiro.

## ⌨️ Atalhos de Teclado

A calculadora está totalmente mapeada para uso via teclado:

| Tecla | Ação |
|-------|------|
| `0-9` | Números |
| `,` ou `.` | Vírgula decimal |
| `+`, `-`, `*`, `/`, `%` | Operadores (+, −, ×, ÷, %) |
| `Enter` ou `=` | Calcular resultado |
| `Backspace` | Deletar último dígito |
| `Escape` | Limpar tudo (AC) |

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica.
- **CSS3**: 
  - CSS Grid para o layout dos botões.
  - Flexbox para o display.
  - Variáveis e Media Queries para responsividade.
  - Efeitos de `active` e `hover` para feedback tátil.
- **JavaScript (ES6+)**:
  - Lógica matemática e manipulação de DOM.
  - Regex para conversão de expressões complexas (porcentagens).
  - Pointer Events para melhor resposta ao toque em dispositivos móveis.

## 📱 Otimização Mobile

O projeto conta com ajustes específicos para smartphones:
- Bloqueio de gestos de zoom indesejados.
- Layout em tela cheia que respeita as "safe areas" (Notch) de dispositivos modernos.
- Detecção de dispositivo para ajuste automático de proporções.

## 📂 Estrutura de Arquivos

```text
.
├── index.html          # Estrutura principal
├── css/
│   └── style.css       # Estilização e responsividade
├── js/
│   └── script.js      # Lógica da calculadora
└── README.md           # Documentação do projeto
```

## 🔧 Como Executar

https://raflalo.github.io/Calculadora/

ou

1. Clone este repositório.
2. Abra o arquivo `index.html` em qualquer navegador moderno.
3. Não é necessário nenhum servidor ou instalação de dependências.

---
Desenvolvido como projeto de estudo de Engenharia de Software.