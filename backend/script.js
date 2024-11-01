
const link = "https://miapi-1660.onrender.com/productos";
fetch(link, {
  method: "GET"
})
.then(response => response.json())
.then(data => {
  const list = document.getElementById("productos");
  data.forEach(productos => {
    const myhtml = document.createRange().createContextualFragment(` 
                    <div class="container">
                        <div class="card">
                          <div class="imgBx">
                            <img src="${productos.image}" class="card-img-top" alt="...">
                          </div>
                          <div class="card-body">
                            <h3 class="card-title">${productos.title}</h3>
                            <p class="card-text">${productos.description}</p>
                            <p class="card-text">$ ${productos.value}</p>
                            <button onclick="editar(${productos.id})" class="btn-warning"> <img src="imagenes/pencil-square.svg" alt="editar"> Edit</button>
                            <button onclick="deletePost(${productos.id})" class="btn-danger"> <img src="imagenes/trash3-fill.svg" alt="eliminar"> Delete</button>
                          </div>
                        </div>
                      </div>
    `);
    list.append(myhtml); 
  })
});

function sendForm() {
    const title = document.getElementById("title");
    const description = document.getElementById("description");
    const value = document.getElementById("value");
    const image = document.getElementById("image");
    const editId = document.getElementById("editId").value; 

    const body = {
        title: title.value,
        description: description.value,
        value: value.value,
        image: image.value
    };

    const method = editId ? "PATCH" : "POST"; // Utilizar PATCH si se edita, en caso contrario POST
    const url = editId ? `https://miapi-1660.onrender.com/productos/${editId}` : "https://miapi-1660.onrender.com/productos";

    fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
      },
        body: JSON.stringify(body)
    })
    .then(res => res.json())
    .then(res => {
        console.log("respuesta de la api", res);
        title.value = "";
        description.value = "";
        value.value = "";
        image.value = "";
        document.getElementById("editId").value = ""; // Restablecer el Id de edición
        location.reload();
    });
}

function deletePost(id) {
    fetch(`https://miapi-1660.onrender.com/productos/${id}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(res => {
        console.log("respuesta de la api", res);
        location.reload();
    });
}

function editar(id) {
    fetch(`https://miapi-1660.onrender.com/productos/${id}`, {
        method: "GET"
    })
    .then(response => response.json())
    .then(productos => {
        document.getElementById("title").value = productos.title;
        document.getElementById("description").value = productos.description;
        document.getElementById("value").value = productos.value;
        document.getElementById("image").value = productos.image; // Suponiendo que la primera imagen es la que hay que editar
        document.getElementById("editId").value = productos.id; // Establecer el id de edición
    });
}