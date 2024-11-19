document.addEventListener("DOMContentLoaded", () => {
    const projects = [];
    let activeProjectIndex = null;

    // Elementos del DOM
    const projectList = document.getElementById("project-list");
    const addProjectBtn = document.getElementById("add-project-btn");
    const timeline = document.getElementById("timeline");
    const calendar = document.getElementById("calendar");
    const taskList = document.getElementById("task-list");
    const addTaskFormBtn = document.getElementById("add-task-form-btn");
    const taskNameInput = document.getElementById("task-name");
    const taskDateInput = document.getElementById("task-date");
    const taskStatusInput = document.getElementById("task-status");
    const taskForm = document.getElementById("task-form");

    // Crear nuevo proyecto
    addProjectBtn.addEventListener("click", () => {
        const projectName = prompt("Nombre del Proyecto:");
        if (projectName) {
            projects.push({ name: projectName, tasks: [] });
            renderProjects();
        }
    });

    // Seleccionar un proyecto
    function selectProject(index) {
        activeProjectIndex = index;

        // Mostrar elementos relacionados con el proyecto
        timeline.style.display = "block";
        taskForm.style.display = "block";

        // Actualizar vistas
        renderCalendar();
        renderTimeline();
        renderTasks();
    }

    // Renderizar proyectos
    function renderProjects() {
        projectList.innerHTML = "";
        projects.forEach((project, index) => {
            const li = document.createElement("li");
            li.textContent = project.name;
            li.addEventListener("click", () => selectProject(index));
            projectList.appendChild(li);
        });
    }

    // Renderizar calendario
    function renderCalendar() {
        calendar.innerHTML = "";
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const div = document.createElement("div");
            div.textContent = day;
            if (day === now.getDate()) div.classList.add("today");
            div.addEventListener("click", () => filterTasksByDay(day));
            calendar.appendChild(div);
        }
    }

    // Filtrar tareas por día
    function filterTasksByDay(day) {
        if (activeProjectIndex === null) return;

        const project = projects[activeProjectIndex];
        const filteredTasks = project.tasks.filter((task) => {
            const taskDate = new Date(task.date);
            return taskDate.getDate() === day && taskDate.getMonth() === new Date().getMonth();
        });
        renderTasks(filteredTasks);
    }

    // Renderizar tareas
    function renderTasks(filteredTasks = null) {
        taskList.innerHTML = "";
        if (activeProjectIndex === null) return;

        const project = projects[activeProjectIndex];
        const tasks = filteredTasks || project.tasks;

        if (tasks.length === 0) {
            taskList.innerHTML = "<p>No hay tareas en este proyecto.</p>";
            return;
        }

        tasks.forEach((task, index) => {
            const li = document.createElement("li");
            li.textContent = `${task.name} (${task.status})`;

            // Botón completar tarea
            const completeBtn = document.createElement("button");
            completeBtn.textContent = "✓";
            completeBtn.addEventListener("click", () => markTaskComplete(index));

            // Botón eliminar tarea
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "🗑";
            deleteBtn.addEventListener("click", () => deleteTask(index));

            li.appendChild(completeBtn);
            li.appendChild(deleteBtn);
            taskList.appendChild(li);
        });
    }

    // Marcar tarea como completada
    function markTaskComplete(taskIndex) {
        const project = projects[activeProjectIndex];
        project.tasks[taskIndex].status = "completada";
        renderTasks();
    }

    // Eliminar tarea
    function deleteTask(taskIndex) {
        const project = projects[activeProjectIndex];
        project.tasks.splice(taskIndex, 1);
        renderTasks();
    }

    // Agregar nueva tarea desde el formulario
    addTaskFormBtn.addEventListener("click", () => {
        if (activeProjectIndex === null) {
            alert("Por favor, selecciona un proyecto primero.");
            return;
        }

        const taskName = taskNameInput.value.trim();
        const taskDate = taskDateInput.value;
        const taskStatus = taskStatusInput.value;

        if (!taskName || !taskDate) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        const project = projects[activeProjectIndex];
        project.tasks.push({ name: taskName, date: taskDate, status: taskStatus });

        // Limpiar formulario
        taskNameInput.value = "";
        taskDateInput.value = "";
        renderTasks();
    });

    // Renderizar línea de tiempo o esconder si no hay proyecto activo
    function renderTimeline() {
        if (activeProjectIndex === null) {
            timeline.style.display = "none";
            taskForm.style.display = "none";
        }
    }

    // Inicializar
    renderProjects();
    renderTimeline();
});