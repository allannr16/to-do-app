// 1. MANIPULAÇÃO DO DOM: Selecionando os elementos que vamos usar
const taskInput = document.getElementById('taskInput');
const priorityInput = document.getElementById('priorityInput');
const addBtn = document.getElementById('addBtn');
const sortSelect = document.getElementById('sortSelect');
const taskList = document.getElementById('taskList');

// 2. ESTADO DA APLICAÇÃO: Onde guardamos os dados das tarefas
let tasks = [];

// 3. EVENTOS: Escutando ações do usuário
addBtn.addEventListener('click', addTask);
sortSelect.addEventListener('change', renderTasks);

// Adicionar tarefa ao pressionar "Enter"
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// 4. LÓGICA DE CRIAÇÃO DAS TAREFAS
function addTask() {
    const text = taskInput.value.trim();
    const priority = priorityInput.value;

    // Validação de entrada
    if (text === "") {
        alert("Por favor, digite uma descrição para a tarefa.");
        return;
    }

    // Criando o objeto da tarefa
    const newTask = {
        id: Date.now(), // Usamos o timestamp como ID único
        text: text,
        priority: priority,
        completed: false,
        createdAt: new Date()
    };

    // Adiciona ao array e limpa o campo
    tasks.push(newTask);
    taskInput.value = "";
    
    // Alerta de sucesso (Requisito 7)
    alert("Tarefa adicionada com sucesso!");

    renderTasks();
}

// 5. FUNÇÃO DE RENDERIZAÇÃO: Atualiza a interface baseada no array tasks
function renderTasks() {
    // Limpa a lista atual para não duplicar
    taskList.innerHTML = "";

    // Copiamos o array para ordenar sem perder a ordem original de criação se necessário
    let tasksToDisplay = [...tasks];

    // Lógica de Ordenação (Requisito 6)
    const sortType = sortSelect.value;
    const priorityValue = { "Alta": 3, "Média": 2, "Baixa": 1 };

    if (sortType === "alta-baixa") {
        tasksToDisplay.sort((a, b) => priorityValue[b.priority] - priorityValue[a.priority]);
    } else if (sortType === "baixa-alta") {
        tasksToDisplay.sort((a, b) => priorityValue[a.priority] - priorityValue[b.priority]);
    } else if (sortType === "aleatoria") {
        tasksToDisplay.sort(() => Math.random() - 0.5);
    }

    // Criando os elementos HTML para cada tarefa
    tasksToDisplay.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;

        li.innerHTML = `
            <div class="task-content">
                <span class="task-text">${task.text}</span>
                <span class="prio-${task.priority}">Prioridade: ${task.priority}</span>
            </div>
            <div class="task-actions">
                <button class="done-btn" onclick="toggleComplete(${task.id})">Concluído</button>
                <button class="edit-btn" onclick="editTask(${task.id})">Editar</button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">Excluir</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

// 6. FUNÇÕES DE AÇÃO
function toggleComplete(id) {
    tasks = tasks.map(task => {
        if (task.id === id) task.completed = !task.completed;
        return task;
    });
    renderTasks();
}

function deleteTask(id) {
    if (confirm("Deseja realmente excluir esta tarefa?")) {
        tasks = tasks.filter(task => task.id !== id);
        renderTasks();
    }
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    const newText = prompt("Editar tarefa:", task.text);
    
    if (newText !== null && newText.trim() !== "") {
        task.text = newText.trim();
        renderTasks();
    }
}
