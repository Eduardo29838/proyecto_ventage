function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

document.addEventListener("DOMContentLoaded", () => {
  const abrir = document.getElementById("abrirBuscador");
  const overlay = document.getElementById("buscadorOverlay");
  const cerrar = document.getElementById("cerrarBuscador");
  const input = document.getElementById("inputBuscador");
  const formulario = document.getElementById("formBuscador");
  const resultados = document.getElementById("resultadosBuscador");

  if (!abrir || !overlay || !cerrar || !input || !formulario || !resultados) {
    return;
  }

  function abrirBuscador() {
    overlay.classList.add("activo");
    input.focus();
    mostrarResultados();
  }

  function cerrarBuscador() {
    overlay.classList.remove("activo");
    input.value = "";
    resultados.innerHTML = "";
    abrir.focus();
  }

  function obtenerProductos() {
    const tarjetas = document.querySelectorAll(
      ".product-card, .producto-card, .card-producto"
    );

    return [...tarjetas].map((tarjeta) => {
      const titulo =
        tarjeta.querySelector("h2, h3, h4, .card-title, .product-title");

      const enlace = tarjeta.querySelector("a[href]");
      const precio = tarjeta.querySelector(
        ".precio, .price, .product-price"
      );

      return {
        nombre: titulo?.textContent.trim() || tarjeta.textContent.trim(),
        precio: precio?.textContent.trim() || "",
        enlace: enlace?.getAttribute("href") || "#",
        texto: tarjeta.textContent.toLowerCase()
      };
    }).filter((producto) => producto.nombre);
  }

  function mostrarResultados() {
    const consulta = input.value.trim().toLowerCase();
    resultados.innerHTML = "";

    if (!consulta) {
      resultados.innerHTML =
        '<p class="sin-resultados">Busca por nombre, modelo o colección.</p>';
      return;
    }

    const productos = obtenerProductos().filter((producto) =>
      producto.texto.includes(consulta) ||
      producto.nombre.toLowerCase().includes(consulta)
    );

    if (productos.length === 0) {
      resultados.innerHTML =
        '<p class="sin-resultados">No encontramos productos con ese nombre.</p>';
      return;
    }

    productos.forEach((producto) => {
      const enlace = document.createElement("a");
      enlace.className = "resultado-buscador";
      enlace.href = producto.enlace;

      const titulo = document.createElement("strong");
      titulo.textContent = producto.nombre;
      enlace.appendChild(titulo);

      if (producto.precio) {
        const precio = document.createElement("small");
        precio.textContent = producto.precio;
        enlace.appendChild(precio);
      }

      resultados.appendChild(enlace);
    });
  }

  abrir.addEventListener("click", abrirBuscador);
  cerrar.addEventListener("click", cerrarBuscador);
  input.addEventListener("input", mostrarResultados);

  overlay.addEventListener("click", (evento) => {
    if (evento.target === overlay) cerrarBuscador();
  });

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && overlay.classList.contains("activo")) {
      cerrarBuscador();
    }
  });

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    mostrarResultados();

    const primerResultado = resultados.querySelector("a.resultado-buscador");

    if (primerResultado) {
      window.location.href = primerResultado.href;
    }
  });
});
