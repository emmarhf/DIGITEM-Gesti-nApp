// VARIABLES GLOBALES
let projects = {}; // Objeto para almacenar proyectos y sus tareas
let selectedProject = null; // Proyecto seleccionado

// ELEMENTOS DEL DOM
const projectList = document.getElementById("project-list");
const taskList = document.getElementById("task-list");
const taskForm = document.getElementById("task-form");
const taskNameInput = document.getElementById("task-name");
const taskDateInput = document.getElementById("task-date");
const taskStatusSelect = document.getElementById("task-status");
const addTaskButton = document.getElementById("add-task-form-btn");
const projectTitle = document.getElementById("project-title");

// GRÁFICOS
const statsChartCanvas = document.getElementById("stats-chart");
let statsChart = null;

// EVENTOS
document.getElementById("add-project-btn").addEventListener("click", addProject);
addTaskButton.addEventListener("click", addTask);

// FUNCIONES
function addProject() {
    const projectName = prompt("Ingrese el nombre del proyecto:");
    if (!projectName) return;

    if (!projects[projectName]) {
        projects[projectName] = []; // Inicializa el proyecto con una lista de tareas vacía
        renderProjects();
    } else {
        alert("El proyecto ya existe.");
    }
}

function renderProjects() {
    projectList.innerHTML = ""; // Limpia la lista de proyectos

    for (const projectName in projects) {
        const li = document.createElement("li");
        li.textContent = projectName;
        li.addEventListener("click", () => selectProject(projectName));
        projectList.appendChild(li);
    }
}

function selectProject(projectName) {
    selectedProject = projectName;
    projectTitle.textContent = `Tareas del Proyecto: ${projectName}`;
    renderTasks();
}

function addTask() {
    if (!selectedProject) {
        alert("Por favor, seleccione un proyecto antes de agregar una tarea.");
        return;
    }

    const taskName = taskNameInput.value;
    const taskDate = taskDateInput.value;
    const taskStatus = taskStatusSelect.value;

    if (!taskName || !taskDate) {
        alert("Complete todos los campos antes de agregar una tarea.");
        return;
    }

    const task = { name: taskName, date: taskDate, status: taskStatus };
    projects[selectedProject].push(task); // Agrega la tarea al proyecto seleccionado
    renderTasks();
    updateStats();

    // Limpia el formulario
    taskNameInput.value = "";
    taskDateInput.value = "";
    taskStatusSelect.value = "pendiente";
}

function renderTasks() {
    if (!selectedProject) return;

    const tasks = projects[selectedProject];
    taskList.innerHTML = ""; // Limpia la lista de tareas

    tasks.forEach((task, index) => {
        const li = document.createElement("li");

        // Contenido de la tarea con botones para cambiar el estado
        li.innerHTML = `
            <span>${task.name} (Fecha: ${task.date})</span>
            <span>Estado: ${task.status}</span>
            <button class="modify-task-btn pending" onclick="changeTaskStatus(${index}, 'pendiente')">Pendiente</button>
            <button class="modify-task-btn in-progress" onclick="changeTaskStatus(${index}, 'en progreso')">En Progreso</button>
            <button class="modify-task-btn completed" onclick="changeTaskStatus(${index}, 'completada')">Completada</button>
            <button onclick="deleteTask(${index})">Eliminar</button>
        `;
        taskList.appendChild(li);
    });
}

// Cambiar el estado de una tarea
function changeTaskStatus(index, newStatus) {
    if (!selectedProject) return;

    // Actualizar el estado de la tarea
    projects[selectedProject][index].status = newStatus;
    renderTasks(); // Volver a renderizar las tareas
    updateStats(); // Actualizar los gráficos
}

function deleteTask(index) {
    if (!selectedProject) return;

    projects[selectedProject].splice(index, 1); // Elimina la tarea del proyecto
    renderTasks();
    updateStats();
}

function updateStats() {
    if (!selectedProject) return;

    const tasks = projects[selectedProject];
    const taskCounts = {
        pendiente: 0,
        "en progreso": 0,
        completada: 0,
    };

    // Contar tareas por estado
    tasks.forEach(task => {
        taskCounts[task.status] = (taskCounts[task.status] || 0) + 1;
    });

    renderStatsChart(taskCounts);
}

function renderStatsChart(taskCounts) {
    if (statsChart) {
        statsChart.destroy(); // Destruye el gráfico previo si existe
    }

    statsChart = new Chart(statsChartCanvas, {
        type: "pie",
        data: {
            labels: ["Pendiente", "En Progreso", "Completada"],
            datasets: [
                {
                    data: [
                        taskCounts.pendiente,
                        taskCounts["en progreso"],
                        taskCounts.completada,
                    ],
                    backgroundColor: ["#ffcc00", "#11999E", "#4CAF50"],
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "bottom",
                },
            },
        },
    });
}

// INICIALIZACIÓN
renderProjects();

function renderCalendar(month, year) {
    const calendar = document.getElementById("calendar");
    const monthLabel = document.getElementById("month-label");

    // Mes actual
    const date = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = date.getDay();

    monthLabel.textContent = date.toLocaleString("default", { month: "long", year: "numeric" });

    calendar.innerHTML = ""; // Limpiar calendario anterior

    // Generar espacios para los días previos al inicio del mes
    for (let i = 0; i < firstDayIndex; i++) {
        const emptyCell = document.createElement("div");
        emptyCell.classList.add("calendar-day", "empty");
        calendar.appendChild(emptyCell);
    }

    // Generar días del mes
    for (let day = 1; day <= lastDay; day++) {
        const dayCell = document.createElement("div");
        dayCell.classList.add("calendar-day");
        dayCell.textContent = day;

        // Marcar día actual
        if (day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
            dayCell.classList.add("today");
        }

        calendar.appendChild(dayCell);
    }
}

// Inicializar calendario para el mes actual
renderCalendar(new Date().getMonth(), new Date().getFullYear());

// Elementos del DOM para el modal
const privacyPolicyLink = document.getElementById("privacy-policy-link");
const privacyModal = document.getElementById("privacy-modal");
const closePrivacyBtn = document.getElementById("close-privacy-btn");

// Abrir el modal al hacer clic en el enlace de Política de Privacidad
privacyPolicyLink.addEventListener("click", (e) => {
    e.preventDefault(); // Evitar redirección
    privacyModal.classList.remove("hidden"); // Mostrar modal
});

// Cerrar el modal al hacer clic en el botón
closePrivacyBtn.addEventListener("click", () => {
    privacyModal.classList.add("hidden"); // Ocultar modal
});

// Cerrar el modal si el usuario hace clic fuera del contenido
privacyModal.addEventListener("click", (e) => {
    if (e.target === privacyModal) {
        privacyModal.classList.add("hidden");
    }
});