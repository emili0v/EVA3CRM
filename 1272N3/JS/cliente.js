var g_id_cliente = "";

//agregar un nuevo cliente
function agregarCliente() {
    var nombres = document.getElementById("txt_nombres").value;
    var apellidos = document.getElementById("txt_apellidos").value;
    var dv = document.getElementById("txt_dv").value;
    var email = document.getElementById("txt_email").value;
    var celular = document.getElementById("txt_celular").value;

    console.log("Nombres:", nombres);
    console.log("Apellidos:", apellidos);
    console.log("DV:", dv);
    console.log("Email:", email);
    console.log("Celular:", celular);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var fechaActual = obtenerFechaHora();

    // Generar un ID único 
    var id_cliente = Math.floor(Math.random() * 1000000);

    const raw = JSON.stringify({
        "id_cliente": id_cliente,
        "nombres": nombres,
        "apellidos": apellidos,
        "dv": dv,
        "email": email,
        "celular": celular,
        "fecha_registro": fechaActual
    });

    console.log("JSON enviado:", raw);

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/cliente", requestOptions)
        .then((response) => {
            if (response.status == 200) {
                location.href = "listar.html";
            } else {
                response.text().then(text => {
                    console.error("Error al agregar cliente:", response.status);
                    console.error("Respuesta del servidor:", text);
                });
            }
        })
        .catch((error) => console.error("Error al agregar cliente:", error));
}

// Función para listar clientes
function listarCliente() {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/cliente?_size=200", requestOptions)
        .then((response) => response.json())
        .then((json) => {
            json.forEach(completarFila);
            $('#tbl_cliente').DataTable();
        })
        .catch((error) => console.error("Error al listar clientes:", error));
}

function completarFila(element, index, arr) {
    arr[index] = document.querySelector("#tbl_cliente tbody").innerHTML +=
        `<tr>
            <td>${element.id_cliente}</td>
            <td>${element.nombres}</td>
            <td>${element.apellidos}</td>
            <td>${element.dv}</td>
            <td>${element.email}</td>
            <td>${element.celular}</td>
            <td>${element.fecha_registro}</td>
            <td>
                <a href='actualizar.html?id=${element.id_cliente}' class='btn btn-warning btn-sm'>Actualizar</a>
                <a href='eliminar.html?id=${element.id_cliente}' class='btn btn-danger btn-sm'>Eliminar</a> 
            </td>
        </tr>`;
}

//ID para la actualización
function obtenerIdActualizacionCliente() {
    const queryString = window.location.search;
    const parametros = new URLSearchParams(queryString);
    const p_id_cliente = parametros.get('id');
    g_id_cliente = p_id_cliente;

    if (g_id_cliente) {
        obtenerDatosActualizacionCliente(g_id_cliente);
    } else {
        console.error("No se ha encontrado el ID del cliente en la URL.");
        alert("Por favor, asegúrese de que la URL incluye el parámetro '.html?id='.");
    }
}

function obtenerDatosActualizacionCliente(id_cliente) {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/cliente/" + id_cliente, requestOptions)
        .then((response) => response.json())
        .then((json) => completarFormularioActualizarCliente(json))
        .catch((error) => console.error(error));
}

function completarFormularioActualizarCliente(element) {
    if (element && element.length > 0) {
        element = element[0];
        document.getElementById('txt_nombres').value = element.nombres || '';
        document.getElementById('txt_apellidos').value = element.apellidos || '';
        document.getElementById('txt_dv').value = element.dv || '';
        document.getElementById('txt_email').value = element.email || '';
        document.getElementById('txt_celular').value = element.celular || '';
    } else {
        console.error("No se ha encontrado el cliente.");
        alert("Cliente no encontrado.");
    }
}

// Función para actualizar un cliente
function actualizarCliente() {
    var nombres = document.getElementById("txt_nombres").value;
    var apellidos = document.getElementById("txt_apellidos").value;
    var dv = document.getElementById("txt_dv").value;
    var email = document.getElementById("txt_email").value;
    var celular = document.getElementById("txt_celular").value;

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "nombres": nombres,
        "apellidos": apellidos,
        "dv": dv,
        "email": email,
        "celular": celular
    });

    const requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/cliente/" + g_id_cliente, requestOptions)
        .then((response) => {
            if (response.status == 200) {
                location.href = "listar.html";
            } else {
                alert("Error al actualizar el cliente.");
            }
        })
        .catch((error) => console.error("Error al actualizar cliente:", error));
}

//  obtener el ID para la eliminación
function obtenerIdEliminacionCliente() {
    const queryString = window.location.search;
    const parametros = new URLSearchParams(queryString);
    const p_id_cliente = parametros.get('id');
    g_id_cliente = p_id_cliente;

    obtenerDatosEliminacionCliente(p_id_cliente);
}

function obtenerDatosEliminacionCliente(id_cliente) {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/cliente/" + id_cliente, requestOptions)
        .then((response) => response.json())
        .then((json) => completarEtiquetaEliminarCliente(json))
        .catch((error) => console.error(error));
}

function completarEtiquetaEliminarCliente(element) {
    var nombreCliente = element.nombres + " " + element.apellidos;
    document.getElementById('lbl_eliminar').innerHTML = "¿Desea eliminar este cliente? <b>" + nombreCliente + "</b>";
}

// Función para eliminar un cliente
function eliminarCliente() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/cliente/" + g_id_cliente, requestOptions)
        .then((response) => {
            if (response.status == 200) {
                location.href = "listar.html";
            } else {
                alert("No es posible eliminar. Registro está siendo utilizado.");
            }
        })
        .catch((error) => console.error("Error al eliminar cliente:", error));
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
