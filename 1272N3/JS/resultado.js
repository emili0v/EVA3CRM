var g_id_resultado = "";

// obtener el ID para la eliminación
function obtenerIdEliminacionResultado() {
    const queryString = window.location.search;
    const parametros = new URLSearchParams(queryString);
    const p_id_resultado = parametros.get('id');
    g_id_resultado = p_id_resultado;

    obtenerDatosEliminacionResultado(p_id_resultado);
}

function obtenerDatosEliminacionResultado(id_resultado) {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/resultado/" + id_resultado, requestOptions)
        .then((response) => response.json())
        .then((json) => completarEtiquetaEliminarResultado(json))
        .catch((error) => console.error(error));
}

function completarEtiquetaEliminarResultado(element) {
    var nombreResultado = element.nombre_resultado;
    document.getElementById('lbl_eliminar').innerHTML = "¿Desea eliminar este resultado? <b>" + nombreResultado + "</b>";
}

function eliminarResultado() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/resultado/" + g_id_resultado, requestOptions)
        .then((response) => {
            if (response.status == 200) {
                location.href = "listar.html";
            } else {
                alert("No es posible eliminar. Registro está siendo utilizado.");
            }
        })
        .catch((error) => console.error("Error al eliminar resultado:", error));
}

// Función para obtener el ID para la actualización
function obtenerIdActualizacionResultado() {
    const queryString = window.location.search;
    const parametros = new URLSearchParams(queryString);
    const p_id_resultado = parametros.get('id');
    g_id_resultado = p_id_resultado;

    obtenerDatosActualizacionResultado(p_id_resultado);
}

function obtenerDatosActualizacionResultado(id_resultado) {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/resultado/" + id_resultado, requestOptions)
        .then((response) => response.json())
        .then((json) => {
            console.log("Datos obtenidos para actualización:", json); //para depuración
            if (json.length > 0) {
                completarFormularioActualizarResultado(json[0]);
            } else {
                console.error("No se encontraron datos para el ID proporcionado.");
            }
        })
        .catch((error) => console.error(error));
}

function completarFormularioActualizarResultado(element) {
    console.log("Completando formulario de actualización con:", element); //para depuración
    if (element && element.nombre_resultado) {
        document.getElementById('txt_nombre_resultado').value = element.nombre_resultado;
    } else {
        console.error("No se ha encontrado el nombre del resultado para actualizar.");
    }
}

function actualizarResultado() {
    var nombre_resultado = document.getElementById("txt_nombre_resultado").value;
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "nombre_resultado": nombre_resultado
    });

    const requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/resultado/" + g_id_resultado, requestOptions)
        .then((response) => {
            if (response.status == 200) {
                location.href = "listar.html";
            } else {
                alert("Error al actualizar el resultado.");
            }
        })
        .catch((error) => console.error("Error al actualizar resultado:", error));
}

// listar los resultados
function listarResultado() {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/resultado?_size=200", requestOptions)
        .then((response) => response.json())
        .then((json) => {
            json.forEach(completarFila);
            $('#tbl_resultado').DataTable();
        })
        .catch((error) => console.error(error));
}

function completarFila(element, index, arr) {
    arr[index] = document.querySelector("#tbl_resultado tbody").innerHTML += `
        <tr>
            <td>${element.id_resultado}</td>
            <td>${element.nombre_resultado}</td>
            <td>${element.fecha_registro}</td>
            <td>
                <a href='actualizar.html?id=${element.id_resultado}' class='btn btn-warning btn-sm'>Actualizar</a>
                <a href='eliminar.html?id=${element.id_resultado}' class='btn btn-danger btn-sm'>Eliminar</a>
            </td>
        </tr>`;
}

function agregarResultado() {
    var nombre_resultado = document.getElementById("txt_nombre_resultado").value;
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var fechaActual = obtenerFechaHora();

    const raw = JSON.stringify({
        "nombre_resultado": nombre_resultado,
        "fecha_registro": fechaActual
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/resultado", requestOptions)
        .then((response) => {
            if (response.status == 200) {
                location.href = "listar.html";
            } else {
                alert("Error al agregar resultado.");
            }
        })
        .catch((error) => console.error("Error al agregar resultado:", error));
}

//  obtener la fecha y hora actual
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
