//Model tareas
class Tarea {
    constructor(id, descripcion) {
        this.id = id
        this.descripcion = descripcion
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
    /* async cargarApi() {

        try {
            const apiTodo = await fetch('https://jsonplaceholder.typicode.com/todos')
            const apiJson = await apiTodo.json()

            this.listaTareas = apiJson.map(tarea => {
                return new Tarea(tarea.id, tarea.title);
            })

            this.guardarEnLocal();
            mostrarTareas()
        } catch (error) {
            console.log("Error cargar API")
        }
    } */

    crearTarea(descripcion) {
        let idMayor = 0
        this.listaTareas.forEach(tarea => {
            if (tarea.id > idMayor) {
                idMayor = tarea.id
            }
        })
        const id = idMayor + 1
        const nuevaTarea = new Tarea(id, descripcion)
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
    eliminarTarea(id) {
        this.listaTareas = this.listaTareas.filter(t => t.id !== id)
        this.guardarEnLocal()
        mostrarTareas()
    }
}

const inputNuevaTarea = document.getElementById("crearTarea")
const btnNuevaTarea = document.getElementById("btnCrearTarea")

const gestor = new GestorTareas()
//gestor.cargarApi()

btnNuevaTarea.addEventListener('click', nuevaTarea)


function mostrarTareas() {
    const ulTareas = document.getElementById("listaDeTareas")

    ulTareas.innerHTML = "";

    gestor.listaTareas.forEach(tarea => {

        const fechaFormateada = new Date(tarea.fechaCreacion).toLocaleDateString();
        ulTareas.innerHTML += `
            <li>
                ${tarea.descripcion} - 
                <span>${tarea.estado ? 'Completada' : 'Pendiente'}</span>
                <p>${fechaFormateada}</p>
                <input type="checkbox" ${tarea.estado ? 'checked' : ''} onchange = "gestor.estadoTarea(${tarea.id})" >
                <p>${tarea.id}</p>
                <button onclick="gestor.eliminarTarea(${tarea.id})">Borrar tarea</button>
            </li>`;
    })
}
mostrarTareas()



function nuevaTarea(e) {
    e.preventDefault()
    const tareaValor = inputNuevaTarea.value

    const alertas = document.getElementById("alertas")
    const mostrarAlerta = (mensaje, tipo) => {
    const alerta = `
            <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
                ${mensaje}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
        alertas.innerHTML = alerta;
    };

    if (!tareaValor) {
    mostrarAlerta("<strong>Error:</strong> El campo no puede estar vacío", "danger");
        return;
    } else {
        gestor.crearTarea(tareaValor)
        inputNuevaTarea.value = ""
        mostrarAlerta("¡Tarea agregada con éxito!", "success");
        setTimeout(() => {
            $(".alert").alert('close')
        }, 2000)
    }

}



//AAAAAAAAAA



