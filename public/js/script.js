$(document).ready(function () {
  loadData();
  $("#lengthInput").inputmask("Regex", {
    regex: "^[0-9]{2}:[0-5][0-9]$",
  });
});

function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function loadData() {
  let ingredientes = sendRequest("GET", "ingrediente");
  let rows = "";
  ingredientes &&
    ingredientes.forEach((element, key) => {
      rows += `
            <tr>
                <th class="align-middle" scope="row"><span>${
                  key + 1
                }</span></th>
                <th class="align-middle" scope="row">
                    <button class="btn action-btn"><i class="fa-solid fa-play"></i></button>
                </th>
                <td class="align-middle" scope="row">${element.nombre}</td>
                <td class="align-middle" scope="row">${element.stock}</td>
               <td class="align-middle" scope="row">${element.unidadMedida}</td>
                <td class="align-middle" scope="row">
                    <img
                        style="width: 45px; height: 45px; border-radius: 5px; margin-right: 10px"
                        src=${element.imagen}
                    >
                </td>
                <td class="align-middle" scope="row">${element.precio}</td>
                <td class="align-middle" scope="row">
                    <button
                        onclick="ingredientAction(true, '${
                          element.ingredienteID
                        }')"
                        class="btn action-btn me-2"
                    >
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button
                        onclick="ingredientAction(false, '${
                          element.ingredienteID
                        }')"
                        class="btn action-btn"
                    >
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
  $("tbody").append(rows);
}

let ingredienteID;

function saveIngrediente() {
  let data = {
    ingredienteID: uuid(),
    nombre: $("#nombreInput").val(),
    imagen: `./Content/Ingrediente/${$("#imagenInput")
      .val()
      .replaceAll(" ", "")}.jpg`,
    unidadMedida: $("#medidaInput").val(),
    precio: parseInt($("#precioInput").val()),
    stock: parseInt($("#stockInput").val()),
  };
  let button = $("#save-btn").text();
  let method =
    button == "Guardar" ? "POST" : button == "Actualizar" ? "PUT" : "DELETE";
  let route =
    button == "Guardar" ? `ingrediente` : `ingrediente/${ingredienteID}`;
  console.log(data);
  sendRequest(method, route, JSON.stringify(data));
  location.reload();
}

function ingredientAction(isUpdate, ID) {
  ingredienteID = ID;
  let selected_ingrediente = sendRequest("GET", `ingrediente/${ingredienteID}`);

  $("#nombreInput")
    .val(selected_ingrediente.nombre)
    .prop("disabled", !isUpdate);
  $("#stockInput").val(selected_ingrediente.stock).prop("disabled", !isUpdate);
  $("#medidaInput")
    .val(selected_ingrediente.unidadMedida)
    .prop("disabled", !isUpdate);
  $("#precioInput")
    .val(selected_ingrediente.precio)
    .prop("disabled", !isUpdate);
  $("#imagenInput")
    .val(selected_ingrediente.imagen)
    .prop("disabled", !isUpdate);

  $("#form-title").text(
    isUpdate ? "Editar ingrediente" : "Eliminar ingrediente"
  );
  $("#save-btn").text(isUpdate ? "Actualizar" : "Eliminar");
  $("#save-btn").removeClass(isUpdate ? "btn-danger" : "btn-primary");
  $("#save-btn").addClass(isUpdate ? "btn-primary" : "btn-danger");
}

function sendRequest(method, route, data = {}) {
  return $.ajax({
    type: method,
    dataType: "json",
    data: data,
    url: `https://localhost:44327/api/${route}`,
    global: false,
    async: false,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    success: function (data) {
      return data;
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log("error: ", errorThrown);
    },
  }).responseJSON;
}
