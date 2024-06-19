var g_id_tipo_gestion = "";

// Función para cargar la lista desplegable de tipos de gestión (si es necesario)
function cargarSelects() {
    // Aquí puedes cargar los selects si es necesario para otros formularios
}

// Función para agregar un tipo de gestión
function agregarTipoGestion() {
    var nombre_tipo_gestion = document.getElementById("txt_nombre_tipo_gestion").value;

    if (!nombre_tipo_gestion) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    console.log("Datos enviados:", {
        nombre_tipo_gestion: nombre_tipo_gestion
    });

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "nombre_tipo_gestion": nombre_tipo_gestion,
        "fecha_registro": obtenerFechaHora()
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/tipo_gestion", requestOptions)
        .then((response) => {
            if (response.status == 200) {
                location.href = "listar.html";
            } else {
                response.text().then(text => {
                    console.error("Error al agregar tipo de gestión. Estado:", response.status);
                    console.error("Respuesta del servidor:", text);
                });
            }
        })
        .catch((error) => console.error("Error al agregar tipo de gestión:", error));
}

// Función para listar los tipos de gestión
function listarTipoGestion() {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/tipo_gestion?_size=200", requestOptions)
        .then(response => response.json())
        .then(json => {
            json.forEach(completarFila);
            $('#tbl_tipo_gestion').DataTable();
        })
        .catch(error => console.log('error', error));
}

function completarFila(element, index, arr) {
    document.querySelector("#tbl_tipo_gestion tbody").innerHTML += `
        <tr>
            <td>${element.id_tipo_gestion}</td>
            <td>${element.nombre_tipo_gestion}</td>
            <td>${element.fecha_registro}</td>
            <td>
                <a href='actualizar.html?id=${element.id_tipo_gestion}' class='btn btn-warning btn-sm'>Actualizar</a>
                <a href='eliminar.html?id=${element.id_tipo_gestion}' class='btn btn-danger btn-sm'>Eliminar</a> 
            </td>
        </tr>`;
}

// Función para obtener el ID para la actualización
function obtenerIdActualizacion() {
    const queryString = window.location.search;
    const parametros = new URLSearchParams(queryString);
    const p_id_tipo_gestion = parametros.get('id');
    g_id_tipo_gestion = p_id_tipo_gestion;

    obtenerDatosActualizacion(p_id_tipo_gestion);
}

function obtenerDatosActualizacion(id_tipo_gestion) {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/tipo_gestion/" + id_tipo_gestion, requestOptions)
        .then(response => response.json())
        .then(json => completarFormularioActualizar(json))
        .catch(error => console.error(error));
}

function completarFormularioActualizar(element) {
    document.getElementById('txt_nombre_tipo_gestion').value = element.nombre_tipo_gestion;
}

// Función para actualizar un tipo de gestión
function actualizarTipoGestion() {
    var nombre_tipo_gestion = document.getElementById("txt_nombre_tipo_gestion").value;

    if (!nombre_tipo_gestion) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "nombre_tipo_gestion": nombre_tipo_gestion
    });

    const requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/tipo_gestion/" + g_id_tipo_gestion, requestOptions)
        .then(response => {
            if (response.status == 200) {
                location.href = "listar.html";
            } else {
                alert("Error al actualizar el tipo de gestión.");
            }
        })
        .catch(error => console.error("Error al actualizar tipo de gestión:", error));
}

// Función para obtener el ID para la eliminación
function obtenerIdEliminacion() {
    const queryString = window.location.search;
    const parametros = new URLSearchParams(queryString);
    const p_id_tipo_gestion = parametros.get('id');
    g_id_tipo_gestion = p_id_tipo_gestion;

    obtenerDatosEliminacion(p_id_tipo_gestion);
}

function obtenerDatosEliminacion(id_tipo_gestion) {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/tipo_gestion/" + id_tipo_gestion, requestOptions)
        .then(response => response.json())
        .then(json => completarEtiquetaEliminar(json))
        .catch(error => console.error(error));
}

function completarEtiquetaEliminar(element) {
    var nombreTipoGestion = element.nombre_tipo_gestion;
    document.getElementById('lbl_eliminar').innerHTML = "¿Desea eliminar este tipo de gestión? <b>" + nombreTipoGestion + "</b>";
}

// Función para eliminar un tipo de gestión
function eliminarTipoGestion() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/tipo_gestion/" + g_id_tipo_gestion, requestOptions)
        .then(response => {
            if (response.status == 200) {
                location.href = "listar.html";
            } else {
                alert("No es posible eliminar. Registro está siendo utilizado.");
            }
        })
        .catch(error => console.error("Error al eliminar tipo de gestión:", error));
}

// Función para obtener la fecha y hora actual
function obtenerFechaHora() {
    var fechaHoraActual = new Date();
    var fechaFormateada = fechaHoraActual.toLocaleString('es-ES', {
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).replace(/(\d+)\/(\d+)\/(\d+),\s*(\d+):(\d+):(\d+)/, '$3-$2-$1 $4:$5:$6');

    return fechaFormateada;
}

