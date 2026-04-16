// ==========================================
// 1. VARIÁVEIS DE ESTADO E REFERÊNCIAS DO DOM
// ==========================================

// Agora temos DUAS listas para gerenciar o estado da aplicação
let tarefas = [];
let tarefasDeletadas = [];

// Selecionando elementos do HTML
const inputTarefa = document.getElementById('input-tarefa');
const selectPrioridade = document.getElementById('select-prioridade');
const inputDataEntrega = document.getElementById('input-data-entrega');
const btnAdicionar = document.getElementById('btn-adicionar');
const selectOrdem = document.getElementById('select-ordem');
const listaTarefas = document.getElementById('lista-tarefas');

// Elementos do Tema
const btnTema = document.getElementById('btn-tema');

// Elementos da Lixeira
const btnAbrirLixeira = document.getElementById('btn-abrir-lixeira');
const modalLixeira = document.getElementById('modal-lixeira');
const btnFecharLixeira = document.getElementById('btn-fechar-lixeira');
const listaLixeira = document.getElementById('lista-lixeira');

// ==========================================
// 2. EVENTOS (Ouvintes)
// ==========================================

// Evento para adicionar tarefa
btnAdicionar.addEventListener('click', adicionarTarefa);

// Evento para reorganizar a lista quando o filtro mudar
selectOrdem.addEventListener('change', atualizarInterface);

// Evento do Modo Noturno (Requisito 11)
btnTema.addEventListener('click', alternarTema);

// Eventos para abrir e fechar a Lixeira (Requisito 12)
btnAbrirLixeira.addEventListener('click', () => {
    modalLixeira.classList.remove('escondido');
    atualizarLixeira(); // Garante que a lixeira mostre as tarefas atualizadas ao abrir
});

btnFecharLixeira.addEventListener('click', () => {
    modalLixeira.classList.add('escondido');
});

// ==========================================
// 3. FUNÇÕES PRINCIPAIS
// ==========================================

function alternarTema() {
    // Adiciona ou remove a classe 'dark-mode' do <body>
    document.body.classList.toggle('dark-mode');
    
    // Troca o ícone dependendo de qual modo está ativo
    if (document.body.classList.contains('dark-mode')) {
        btnTema.innerText = '🌙'; // Lua no modo noturno
    } else {
        btnTema.innerText = '☀️'; // Sol no modo claro
    }
}

function adicionarTarefa() {
    const texto = inputTarefa.value.trim();
    
    // Validação: Não permitir tarefa vazia
    if (texto === "") {
        alert("Por favor, digite a descrição da tarefa.");
        return;
    }

    // Criar data e hora atual (Requisito 9)
    const dataAtual = new Date();
    const dataFormatada = dataAtual.toLocaleDateString('pt-BR') + ' às ' + dataAtual.toLocaleTimeString('pt-BR');

    // Cria o objeto da tarefa
    const novaTarefa = {
        id: Date.now(), // ID único
        descricao: texto,
        prioridade: selectPrioridade.value,
        dataCriacao: dataFormatada,
        timestamp: dataAtual.getTime(), // Número usado para ordenar por criação
        dataEntrega: inputDataEntrega.value, // Pode ser vazio (Requisito 10)
        concluida: false
    };

    // Salva no Array e emite alerta (Requisito 7)
    tarefas.push(novaTarefa);
    alert("Tarefa adicionada com sucesso!");

    // Limpa os campos
    inputTarefa.value = "";
    inputDataEntrega.value = "";

    // Atualiza a tela
    atualizarInterface();
}

// Função para ordenar o array de tarefas
function organizarTarefas() {
    const ordem = selectOrdem.value;
    let tarefasOrganizadas = [...tarefas]; // Copia o array
    
    // Pesos para prioridade
    const peso = { "Alta": 3, "Média": 2, "Baixa": 1 };

    if (ordem === 'prio-alta-baixa') {
        tarefasOrganizadas.sort((a, b) => peso[b.prioridade] - peso[a.prioridade]);
    } else if (ordem === 'prio-baixa-alta') {
        tarefasOrganizadas.sort((a, b) => peso[a.prioridade] - peso[b.prioridade]);
    } else {
        // Ordena por criação (mais recentes primeiro, comparando o timestamp)
        tarefasOrganizadas.sort((a, b) => b.timestamp - a.timestamp);
    }

    return tarefasOrganizadas;
}

// Função que desenha as tarefas principais na tela
function atualizarInterface() {
    listaTarefas.innerHTML = ""; // Limpa a tela
    const tarefasParaMostrar = organizarTarefas();

    tarefasParaMostrar.forEach(tarefa => {
        const li = document.createElement('li');
        // Define as classes: item base + prioridade + concluida (se for true)
        li.className = `tarefa-item prioridade-${tarefa.prioridade} ${tarefa.concluida ? 'concluida' : ''}`;

        // Formata a exibição da data de entrega se o usuário escolheu uma
        let textoEntrega = "";
        if (tarefa.dataEntrega) {
            // Converte o formato do input type date (YYYY-MM-DD) para BR (DD/MM/YYYY)
            const dataSplit = tarefa.dataEntrega.split('-');
            textoEntrega = `<br>📅 Entrega: ${dataSplit[2]}/${dataSplit[1]}/${dataSplit[0]}`;
        }

        // Criando a estrutura HTML da tarefa (Esquerda: Info, Direita: Botões)
        li.innerHTML = `
            <div class="tarefa-info">
                <h3>${tarefa.descricao}</h3>
                <span class="tarefa-detalhes">
                    <strong>Prioridade:</strong> ${tarefa.prioridade} | 
                    <strong>Criado em:</strong> ${tarefa.dataCriacao}
                    ${textoEntrega}
                </span>
            </div>
            <div class="acoes-tarefa">
                <button class="btn-concluir" title="Concluir/Desconcluir">✔</button>
                <button class="btn-editar" title="Editar">✎</button>
                <button class="btn-deletar" title="Excluir">✖</button>
            </div>
        `;

        // Adicionando os eventos (addEventListener) para os botões recém-criados
        li.querySelector('.btn-concluir').addEventListener('click', () => alternarConclusao(tarefa.id));
        li.querySelector('.btn-editar').addEventListener('click', () => editarTarefa(tarefa.id));
        li.querySelector('.btn-deletar').addEventListener('click', () => deletarTarefa(tarefa.id));

        listaTarefas.appendChild(li);
    });
}

// ==========================================
// 4. FUNÇÕES DE AÇÃO NAS TAREFAS
// ==========================================

function alternarConclusao(id) {
    const tarefa = tarefas.find(t => t.id === id);
    if (tarefa) {
        tarefa.concluida = !tarefa.concluida; // Inverte o valor booleano
        atualizarInterface();
    }
}

function editarTarefa(id) {
    const tarefa = tarefas.find(t => t.id === id);
    if (tarefa) {
        const novoTexto = prompt("Edite sua tarefa:", tarefa.descricao);
        if (novoTexto && novoTexto.trim() !== "") {
            tarefa.descricao = novoTexto.trim();
            atualizarInterface();
        }
    }
}

function deletarTarefa(id) {
    // 1. Encontra a tarefa a ser deletada
    const index = tarefas.findIndex(t => t.id === id);
    
    if (index !== -1) {
        // 2. Remove da lista principal e guarda na variável 'tarefaRemovida'
        const tarefaRemovida = tarefas.splice(index, 1)[0];
        
        // 3. Adiciona a tarefa na lista de deletadas (Lixeira)
        tarefasDeletadas.push(tarefaRemovida);
        
        // 4. Atualiza as duas telas
        atualizarInterface();
        atualizarLixeira();
    }
}

// ==========================================
// 5. FUNÇÕES DA LIXEIRA
// ==========================================

// Desenha a lista de tarefas dentro da lixeira
function atualizarLixeira() {
    listaLixeira.innerHTML = ""; // Limpa a lista da lixeira

    if (tarefasDeletadas.length === 0) {
        listaLixeira.innerHTML = "<p style='text-align:center; color:gray;'>A lixeira está vazia.</p>";
        return;
    }

    tarefasDeletadas.forEach(tarefa => {
        const li = document.createElement('li');
        li.className = `tarefa-item prioridade-${tarefa.prioridade}`;
        
        li.innerHTML = `
            <div class="tarefa-info">
                <h3>${tarefa.descricao}</h3>
            </div>
            <div class="acoes-tarefa">
                <button class="btn-restaurar" title="Restaurar Tarefa">♻️ Restaurar</button>
            </div>
        `;

        li.querySelector('.btn-restaurar').addEventListener('click', () => restaurarTarefa(tarefa.id));
        listaLixeira.appendChild(li);
    });
}

function restaurarTarefa(id) {
    // Encontra na lixeira
    const index = tarefasDeletadas.findIndex(t => t.id === id);
    
    if (index !== -1) {
        // Tira da lixeira
        const tarefaRestaurada = tarefasDeletadas.splice(index, 1)[0];
        // Coloca de volta na lista principal
        tarefas.push(tarefaRestaurada);
        
        atualizarInterface();
        atualizarLixeira();
    }
}
