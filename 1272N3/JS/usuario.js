var g_id_usuario = "";

//agregar un nuevo usuario
function agregarUsuario() {
    var id_usuario = parseInt(document.getElementById("txt_id_usuario").value);
    var nombres = document.getElementById("txt_nombres").value;
    var apellidos = document.getElementById("txt_apellidos").value;
    var dv = document.getElementById("txt_dv").value;
    var email = document.getElementById("txt_email").value;
    var celular = document.getElementById("txt_celular").value;
    var username = document.getElementById("txt_username").value;
    var password = document.getElementById("txt_password").value;


    console.log("ID Usuario (RUT):", id_usuario);
    console.log("Nombres:", nombres);
    console.log("Apellidos:", apellidos);
    console.log("DV:", dv);
    console.log("Email:", email);
    console.log("Celular:", celular);
    console.log("Username:", username);
    console.log("Password:", password);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var fechaActual = obtenerFechaHora();

    const raw = JSON.stringify({
        "id_usuario": id_usuario,
        "nombres": nombres,
        "apellidos": apellidos,
        "dv": dv,
        "email": email,
        "celular": celular,
        "username": username,
        "password": password,
        "fecha_registro": fechaActual
    });

    console.log("JSON enviado:", raw);

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/usuario", requestOptions)
        .then((response) => {
            if (response.status == 200) {
                location.href = "listar.html";
            } else {
                response.text().then(text => {
                    console.error("Error al agregar usuario. Estado:", response.status);
                    console.error("Respuesta del servidor:", text);
                });
            }
        })
        .catch((error) => console.error("Error al agregar usuario:", error));
}

// Función para listar usuarios
function listarUsuario() {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/usuario?_size=200", requestOptions)
        .then(response => response.json())
        .then((json) => {
            json.forEach(completarFilaUsuario);
            $('#tbl_usuario').DataTable();
        })
        .catch((error) => console.error("Error al listar usuarios:", error));
}

function completarFilaUsuario(element, index, arr) {
    arr[index] = document.querySelector("#tbl_usuario tbody").innerHTML +=
        `<tr>
            <td>${element.id_usuario}</td>
            <td>${element.nombres}</td>
            <td>${element.apellidos}</td>
            <td>${element.dv}</td>
            <td>${element.email}</td>
            <td>${element.celular}</td>
            <td>${element.username}</td>
            <td>${element.fecha_registro}</td>
            <td>
                <a href='actualizar.html?id=${element.id_usuario}' class='btn btn-warning btn-sm'>Actualizar</a>
                <a href='eliminar.html?id=${element.id_usuario}' class='btn btn-danger btn-sm'>Eliminar</a>
            </td>
        </tr>`;
}

//obtener ID de actualización
function obtenerIdActualizacionUsuario() {
    const queryString = window.location.search;
    const parametros = new URLSearchParams(queryString);
    const p_id_usuario = parametros.get('id');
    console.log("ID del usuario de la URL:", p_id_usuario);
    if (p_id_usuario) {
        g_id_usuario = p_id_usuario;
        obtenerDatosActualizacionUsuario(p_id_usuario);
    } else {
        console.error("No se ha encontrado el ID del usuario en la URL.");
        alert("Por favor, asegúrese de que la URL incluye el parámetro '.html?id='.");
    }
}

//obtener ID de eliminación
function obtenerIdEliminacionUsuario() {
    const queryString = window.location.search;
    const parametros = new URLSearchParams(queryString);
    const p_id_usuario = parametros.get('id');
    console.log("ID del usuario de la URL para eliminar:", p_id_usuario);
    if (p_id_usuario) {
        g_id_usuario = p_id_usuario;
        obtenerDatosEliminacionUsuario(p_id_usuario);
    } else {
        console.error("No se ha encontrado el ID del usuario en la URL.");
        alert("Por favor, asegúrese de que la URL incluye el parámetro '.html?id='.");
    }
}

//obtener datos para actualización
function obtenerDatosActualizacionUsuario(id_usuario) {
    if (!id_usuario) {
        console.error("ID de usuario no válido.");
        return;
    }
    console.log("Obteniendo datos de actualización para el usuario ID:", id_usuario);
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/usuario/" + id_usuario, requestOptions)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then((json) => {
            console.log("Datos del usuario para actualizar:", json);
            completarFormularioActualizarUsuario(json[0]);
        })
        .catch((error) => console.error("Fetch error:", error));
}

// Función para obtener datos para eliminación
function obtenerDatosEliminacionUsuario(id_usuario) {
    if (!id_usuario) {
        console.error("ID de usuario no válido.");
        return;
    }
    console.log("Obteniendo datos de eliminación para el usuario ID:", id_usuario);
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/usuario/" + id_usuario, requestOptions)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then((json) => {
            console.log("Datos del usuario para eliminar:", json);
            completarEtiquetaEliminarUsuario(json[0]);
        })
        .catch((error) => console.error("Fetch error:", error));
}

//completar el formulario de actualización
function completarFormularioActualizarUsuario(element) {
    console.log('Completando formulario con:', element);
    document.getElementById('txt_nombres').value = element.nombres || '';
    document.getElementById('txt_apellidos').value = element.apellidos || '';
    document.getElementById('txt_dv').value = element.dv || '';
    document.getElementById('txt_email').value = element.email || '';
    document.getElementById('txt_celular').value = element.celular || '';
    document.getElementById('txt_username').value = element.username || '';
    document.getElementById('txt_password').value = element.password || '';
}

//etiqueta de eliminación
function completarEtiquetaEliminarUsuario(element) {
    document.getElementById('lbl_eliminar').innerHTML = "¿Desea eliminar este usuario? <b>" + element.nombres + " " + element.apellidos + "</b>";
}

// actualizar usuario
function actualizarUsuario() {
    var nombres = document.getElementById("txt_nombres").value;
    var apellidos = document.getElementById("txt_apellidos").value;
    var dv = document.getElementById("txt_dv").value;
    var email = document.getElementById("txt_email").value;
    var celular = document.getElementById("txt_celular").value;
    var username = document.getElementById("txt_username").value;
    var password = document.getElementById("txt_password").value;

    //longitud de dv
    if (dv.length > 1) {
        alert("El campo DV debe tener como máximo 1 carácter.");
        return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var fechaActual = obtenerFechaHora();

    const raw = JSON.stringify({
        "nombres": nombres,
        "apellidos": apellidos,
        "dv": dv,
        "email": email,
        "celular": celular,
        "username": username,
        "password": password,
        "fecha_registro": fechaActual
    });

    const requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    if (g_id_usuario) {
        fetch("http://144.126.210.74:8080/api/usuario/" + g_id_usuario, requestOptions)
            .then((response) => {
                if (response.status == 200) {
                    location.href = "listar.html";
                } else {
                    console.error("Error al actualizar usuario. Estado:", response.status);
                }
            })
            .catch((error) => console.error("Error al actualizar usuario:", error));
    } else {
        console.error("g_id_usuario no está definido.");
    }
}

// Función para eliminar usuario
function eliminarUsuario() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow"
    };

    if (g_id_usuario) {
        fetch("http://144.126.210.74:8080/api/usuario/" + g_id_usuario, requestOptions)
            .then((response) => {
                if (response.status == 200) {
                    location.href = "listar.html";
                } else if (response.status == 400) {
                    alert("No es posible eliminar. Registro está siendo utilizado.");
                } else {
                    console.error("Error al eliminar usuario. Estado: " + response.status);
                }
            })
            .catch((error) => console.error("Error al eliminar usuario:", error));
    } else {
        console.error("g_id_usuario no está definido.");
    }
}

// obtener la fecha y hora actual
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
