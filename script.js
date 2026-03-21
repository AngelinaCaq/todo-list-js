//Clase tareas 
class Tarea {
    constructor(id, descripcion, fechaLimite) {
        this.id = id
        this.descripcion = descripcion;
        this.fechaLimite = fechaLimite;
        this.estado = false;
        this.fechaCreacion = new Date();
    }
}

//Gestionar lista, estado, eliminar
class GestorTareas {
    constructor() {
        const datos = localStorage.getItem("misTareas");
        this.listaTareas = datos ? JSON.parse(datos) : [];
    }
    guardarEnLocal() {
        localStorage.setItem("misTareas", JSON.stringify(this.listaTareas));
    }

//API
    async cargarApi() {

        if (this.listaTareas.length > 0) return;
        const alertas = document.getElementById("alertas")

        alertas.innerHTML = `
            <div class="alert alert-info">
                Cargando tareas desde la API...
            </div>
            `

        try {
            const apiTodo = await fetch('https://jsonplaceholder.typicode.com/todos')
            const apiJson = await apiTodo.json()

            const tareasApi = apiJson.slice(0, 5).map(t => {
                const tarea = new Tarea(t.id, t.title, null)
                tarea.estado = t.completed
                return tarea
            })

            this.listaTareas = [...this.listaTareas, ...tareasApi]
            this.guardarEnLocal();
            mostrarTareas()
            alertas.innerHTML = `
            <div class="alert alert-success">
                Tareas cargadas correctamente desde la API
            </div>
            `
            setTimeout(() => {
                alertas.innerHTML = ""
            }, 2000)
        } catch (error) {
            alertas.innerHTML = `
                <div class="alert alert-danger">
                    Error al cargar tareas desde API
                </div>`
            setTimeout(() => {
                alertas.innerHTML = ""
            }, 3000)
        }
    }

    crearTarea(descripcion, fechaLimite) {
        let idMayor = 0
        this.listaTareas.forEach(tarea => {
            if (tarea.id > idMayor) {
                idMayor = tarea.id
            }
        })
        const id = idMayor + 1
        const nuevaTarea = new Tarea(id, descripcion, fechaLimite)
        this.listaTareas.push(nuevaTarea);
        this.guardarEnLocal()
        mostrarTareas();
    }
    obtenerTareas() {
        return this.listaTareas;
    }
    estadoTarea(id) {
        const tarea = this.listaTareas.find(t => t.id === id)
        if (tarea) {
            tarea.estado = !tarea.estado;
            this.guardarEnLocal()
            mostrarTareas()
        }
    }
    editarTarea(id) {
        mostrarTareas(id);
    }

    // Añade este nuevo método para salvar los cambios
    actualizarTarea(id) {
        const input = document.getElementById(`input-edit-${id}`);
        const nuevaDescripcion = input.value.trim();

        if (nuevaDescripcion) {
            const tarea = this.listaTareas.find(t => t.id === id);
            if (tarea) {
                tarea.descripcion = nuevaDescripcion;
                this.guardarEnLocal();
            }
        }
        mostrarTareas(); // Volver a la vista normal
    }
    eliminarTarea(id) {
        this.listaTareas = this.listaTareas.filter(t => t.id !== id)
        this.guardarEnLocal()
        mostrarTareas()
    }
}

//Obtener elementos del dom
const inputNuevaTarea = document.getElementById("crearTarea")
const inputFecha = document.getElementById("crearFecha")
document.getElementById("formTareas").addEventListener('submit', nuevaTarea)
document.getElementById("botonApi").addEventListener("click", () => {
    gestor.cargarApi()
})

//Crear instancia en la clase
const gestor = new GestorTareas()


function mostrarTareas(idEditar = null) {
    const ulTareas = document.getElementById("listaDeTareas")
    ulTareas.innerHTML = "";
    
    const tareasOrdenadas = [...gestor.listaTareas].sort((a, b) => a.estado - b.estado)

    tareasOrdenadas.forEach(tarea => {
        const fechaFormateada = new Date(tarea.fechaCreacion).toLocaleDateString();

        if (tarea.id === idEditar) {
            ulTareas.innerHTML += `
            <li class="li-edit">
                <input type="text" id="input-edit-${tarea.id}" class="form-control mb-1" value="${tarea.descripcion}">
                <button class="btn-chico save" onclick="gestor.actualizarTarea(${tarea.id})">Guardar</button>
                <button class="btn-chico" onclick="mostrarTareas()">Cancelar</button>
            </li>`;
        } else {
            const claseEstado = tarea.estado ? 'completada' : '';
            ulTareas.innerHTML += `
            <li>
                <div class="contenedor_li ${claseEstado}"> 
                    <div class="check-box">
                        <input type="checkbox" ${tarea.estado ? 'checked' : ''} onchange="gestor.estadoTarea(${tarea.id})">
                    </div>
                    <div class="info-tarea">
                        <strong class="${claseEstado}">${tarea.descripcion}</strong>
                        <p>${tarea.fechaLimite ? tarea.fechaLimite : ''} <small>(${fechaFormateada})</small></p>
                    </div>
                    <div class="acciones">
                        <button class="btn-accion" onclick="mostrarTareas(${tarea.id})">✎</button>
                        <button class="btn-accion" onclick="gestor.eliminarTarea(${tarea.id})">✕</button>
                    </div>
                </div>
            </li>`;
        }
    })
}

function nuevaTarea(e) {
    e.preventDefault()
    const tareaValor = inputNuevaTarea.value
    const fechaValor = inputFecha.value || null

    const alertas = document.getElementById("alertas")
    const mostrarCarga = () => {
        alertas.innerHTML = `
        <div class="alert alert-info d-flex align-items-center" role="alert">
            <div class="spinner-border spinner-border-sm me-2" role="status"></div>
            Procesando tarea...
        </div>
    `;
    }

    const mostrarExito = () => {
        alertas.innerHTML = `
        <div class="alert alert-success" role="alert">
            ¡Tarea agregada con éxito!
        </div>
    `;
        setTimeout(() => {
            alertas.innerHTML = ""
            $('#Modal').modal('hide');
        }, 1000)
    }


    if (!tareaValor) {
        alertas.innerHTML = `
            <div class="alert alert-danger">
                El campo no puede estar vacío
            </div>
        `;
        setTimeout(() => {
            alertas.innerHTML = ""
        }, 3000)
        return;
    }

    mostrarCarga()

    setTimeout(() => {
        gestor.crearTarea(tareaValor, fechaValor)
        inputNuevaTarea.value = ""
        mostrarExito()
    }, 2000)
}

mostrarTareas()

