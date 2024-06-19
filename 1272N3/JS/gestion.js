var g_id_gestion = "";

// cargar la lista desplegable de resultados
function cargarSelectResultado() {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };
    fetch("http://144.126.210.74:8080/api/resultado?_size=200", requestOptions)
        .then((response) => response.json())
        .then((json) => {
            json.forEach(completarOptionResultado);
        })
        .catch((error) => console.error(error));
}

function completarOptionResultado(element, index, arr) {
    document.querySelector("#sel_id_resultado").innerHTML += `<option value='${element.id_resultado}'> ${element.nombre_resultado} </option>`;
}

//cargar la lista desplegable de clientes
function cargarSelectCliente() {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };
    fetch("http://144.126.210.74:8080/api/cliente?_size=200", requestOptions)
        .then((response) => response.json())
        .then((json) => {
            json.forEach(completarOptionCliente);
        })
        .catch((error) => console.error(error));
}

function completarOptionCliente(element, index, arr) {
    document.querySelector("#sel_id_cliente").innerHTML += `<option value='${element.id_cliente}'> ${element.nombres} ${element.apellidos} </option>`;
}

// cargar la lista desplegable de usuarios
function cargarSelectUsuario() {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };
    fetch("http://144.126.210.74:8080/api/usuario?_size=200", requestOptions)
        .then((response) => response.json())
        .then((json) => {
            json.forEach(completarOptionUsuario);
        })
        .catch((error) => console.error(error));
}

function completarOptionUsuario(element, index, arr) {
    document.querySelector("#sel_id_usuario").innerHTML += `<option value='${element.id_usuario}'> ${element.nombres} ${element.apellidos} </option>`;
}

//cargar la lista desplegable de tipos de gestión
function cargarSelectTipoGestion() {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };
    fetch("http://144.126.210.74:8080/api/tipo_gestion?_size=200", requestOptions)
        .then((response) => response.json())
        .then((json) => {
            json.forEach(completarOptionTipoGestion);
        })
        .catch((error) => console.error(error));
}

function completarOptionTipoGestion(element, index, arr) {
    document.querySelector("#sel_id_tipo_gestion").innerHTML += `<option value='${element.id_tipo_gestion}'> ${element.nombre_tipo_gestion} </option>`;
}

function cargarSelects() {
    cargarSelectResultado();
    cargarSelectCliente();
    cargarSelectUsuario();
    cargarSelectTipoGestion();
}

// Función para agregar una gestión
function agregarGestion() {
    var id_usuario = document.getElementById("sel_id_usuario").value;
    var id_cliente = document.getElementById("sel_id_cliente").value;
    var id_tipo_gestion = document.getElementById("sel_id_tipo_gestion").value;
    var id_resultado = document.getElementById("sel_id_resultado").value;
    var comentarios = document.getElementById("txt_comentarios").value;

    if (!id_usuario || !id_cliente || !id_tipo_gestion || !id_resultado || !comentarios) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    console.log("Datos enviados:", {
        id_usuario: id_usuario,
        id_cliente: id_cliente,
        id_tipo_gestion: id_tipo_gestion,
        id_resultado: id_resultado,
        comentarios: comentarios
    });

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "id_usuario": id_usuario,
        "id_cliente": id_cliente,
        "id_tipo_gestion": id_tipo_gestion,
        "id_resultado": id_resultado,
        "comentarios": comentarios,
        "fecha_registro": obtenerFechaHora()
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/gestion", requestOptions)
        .then((response) => {
            if (response.status == 200) {
                location.href = "listar.html";
            } else {
                response.text().then(text => {
                    console.error("Error al agregar gestión. Estado:", response.status);
                    console.error("Respuesta del servidor:", text);
                });
            }
        })
        .catch((error) => console.error("Error al agregar gestión:", error));
}

// Función para listar las gestiones
function listarGestion() {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "query": "select ges.id_gestion as id_gestion, cli.id_cliente, ges.comentarios as comentarios, CONCAT(cli.nombres, ' ',cli.apellidos) as nombre_cliente, CONCAT(usu.nombres,' ' ,usu.apellidos) as nombre_usuario, tge.nombre_tipo_gestion as nombre_tipo_gestion, res.nombre_resultado as nombre_resultado, ges.fecha_registro as fecha_registro from gestion ges, usuario usu, cliente cli, tipo_gestion tge, resultado res where ges.id_usuario = usu.id_usuario and ges.id_cliente = cli.id_cliente and ges.id_tipo_gestion = tge.id_tipo_gestion and ges.id_resultado = res.id_resultado"
        }),
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/dynamic", requestOptions)
        .then(response => response.json())
        .then(json => {
            json.forEach(completarFila);
            $('#tbl_gestion').DataTable();
        })
        .catch(error => console.log('error', error));
}

function completarFila(element, index, arr) {
    document.querySelector("#tbl_gestion tbody").innerHTML += `
        <tr>
            <td>${element.id_gestion}</td>
            <td>${element.nombre_cliente}</td>
            <td>${element.nombre_usuario}</td>
            <td>${element.nombre_tipo_gestion}</td>
            <td>${element.nombre_resultado}</td>
            <td>${element.comentarios}</td>
            <td>${element.fecha_registro}</td>
            <td>
                <a href='actualizar.html?id=${element.id_gestion}' class='btn btn-warning btn-sm'>Actualizar</a>
                <a href='eliminar.html?id=${element.id_gestion}' class='btn btn-danger btn-sm'>Eliminar</a> 
            </td>
        </tr>`;
}

// Función para obtener el ID para la actualización
function obtenerIdActualizacion() {
    const queryString = window.location.search;
    const parametros = new URLSearchParams(queryString);
    const p_id_gestion = parametros.get('id');
    g_id_gestion = p_id_gestion;

    obtenerDatosActualizacion(p_id_gestion);
}

function obtenerDatosActualizacion(id_gestion) {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/gestion/" + id_gestion, requestOptions)
        .then(response => response.json())
        .then(json => completarFormularioActualizar(json))
        .catch(error => console.error(error));
}

function completarFormularioActualizar(element) {
    document.getElementById('sel_id_usuario').value = element.id_usuario;
    document.getElementById('sel_id_cliente').value = element.id_cliente;
    document.getElementById('sel_id_tipo_gestion').value = element.id_tipo_gestion;
    document.getElementById('sel_id_resultado').value = element.id_resultado;
    document.getElementById('txt_comentarios').value = element.comentarios;
}

// Función para actualizar una gestión
function actualizarGestion() {
    var id_usuario = document.getElementById("sel_id_usuario").value;
    var id_cliente = document.getElementById("sel_id_cliente").value;
    var id_tipo_gestion = document.getElementById("sel_id_tipo_gestion").value;
    var id_resultado = document.getElementById("sel_id_resultado").value;
    var comentarios = document.getElementById("txt_comentarios").value;

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "id_usuario": id_usuario,
        "id_cliente": id_cliente,
        "id_tipo_gestion": id_tipo_gestion,
        "id_resultado": id_resultado,
        "comentarios": comentarios,
    });

    const requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/gestion/" + g_id_gestion, requestOptions)
        .then(response => {
            if (response.status == 200) {
                location.href = "listar.html";
            } else {
                alert("Error al actualizar la gestión.");
            }
        })
        .catch(error => console.error("Error al actualizar gestión:", error));
}

// ID para la eliminación
function obtenerIdEliminacion() {
    const queryString = window.location.search;
    const parametros = new URLSearchParams(queryString);
    const p_id_gestion = parametros.get('id');
    g_id_gestion = p_id_gestion;

    obtenerDatosEliminacion(p_id_gestion);
}

function obtenerDatosEliminacion(id_gestion) {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/gestion/" + id_gestion, requestOptions)
        .then(response => response.json())
        .then(json => completarEtiquetaEliminar(json))
        .catch(error => console.error(error));
}

function completarEtiquetaEliminar(element) {
    var nombreGestion = element.comentarios;
    document.getElementById('lbl_eliminar').innerHTML = "¿Desea eliminar esta gestión? <b>" + nombreGestion + "</b>";
}

//eliminar una gestión
function eliminarGestion() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/gestion/" + g_id_gestion, requestOptions)
        .then(response => {
            if (response.status == 200) {
                location.href = "listar.html";
            } else {
                alert("No es posible eliminar. Registro está siendo utilizado.");
            }
        })
        .catch(error => console.error("Error al eliminar gestión:", error));
}

//obtener la fecha y hora actual
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

function inicializarActualizarGestion() {
    cargarSelects();
    obtenerIdActualizacion();
}

function inicializarEliminarGestion() {
    obtenerIdEliminacion();
}
