const NOMBRE_TIENDA = "Comiquería Central";
const CLAVE_CATALOGO = "comiqueriaCentral.catalogo.v2";
const CLAVE_CARRITO = "comiqueriaCentral.carrito.v2";

let carrito = [];
let categoriaSeleccionada = "Todos";
let textoBusqueda = "";

let productosGrid;
let mensajeBusqueda;
let mensajeEstado;
let categoriaFiltro;
let buscarInput;
let buscarBtn;
let formularioProducto;
let mensajeFormulario;
let nombreProducto;
let precioProducto;
let categoriaProducto;
let stockProducto;
let vistaPreviaPortada;
let imagenPortadaDetectada;
let mensajePortada;
let temporizadorPortada;
let solicitudPortadaActual = 0;
let cantidadCarrito;
let carritoContenido;
let totalCarrito;
let carritoPanel;
let carritoOverlay;


const calcularSubtotal = (cantidad, precio) => cantidad * precio;


function calcularDescuento(cantidad, subtotal) {
    if (cantidad >= 3) {
        return subtotal * 0.10;
    }

    if (cantidad === 2) {
        return subtotal * 0.05;
    }

    return 0;
}


function escaparHTML(valor) {
    const elementoTemporal = document.createElement("div");
    elementoTemporal.textContent = valor;

    return elementoTemporal.innerHTML;
}


function seleccionarElementosDOM() {
    productosGrid = document.getElementById("productosGrid");
    mensajeBusqueda = document.getElementById("mensajeBusqueda");
    mensajeEstado = document.getElementById("mensajeEstado");
    categoriaFiltro = document.getElementById("categoriaFiltro");
    buscarInput = document.getElementById("buscarInput");
    buscarBtn = document.getElementById("buscarBtn");
    formularioProducto = document.querySelector("#formularioProducto");
    mensajeFormulario = document.getElementById("mensajeFormulario");
    nombreProducto = document.getElementById("nombreProducto");
    precioProducto = document.getElementById("precioProducto");
    categoriaProducto = document.getElementById("categoriaProducto");
    stockProducto = document.getElementById("stockProducto");
    vistaPreviaPortada = document.getElementById("vistaPreviaPortada");
    imagenPortadaDetectada = document.getElementById("imagenPortadaDetectada");
    mensajePortada = document.getElementById("mensajePortada");
    cantidadCarrito = document.getElementById("cantidadCarrito");
    carritoContenido = document.getElementById("carritoContenido");
    totalCarrito = document.getElementById("totalCarrito");
    carritoPanel = document.getElementById("carritoPanel");
    carritoOverlay = document.getElementById("carritoOverlay");
}


function guardarCatalogoEnStorage() {
    localStorage.setItem(CLAVE_CATALOGO, JSON.stringify(catalogo));
}


function guardarCarritoEnStorage() {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}


function guardarEstadoEnStorage() {
    guardarCatalogoEnStorage();
    guardarCarritoEnStorage();
}


function obtenerDatosDelStorage(clave) {
    try {
        return JSON.parse(localStorage.getItem(clave) ?? "null") ?? null;
    } catch (error) {
        mostrarMensaje(
            "No se pudieron recuperar los datos guardados. Podés usar el catálogo inicial.",
            "warning"
        );
        return null;
    }
}


function crearProductoDesdeStorage(datosProducto) {
    return crearProductoDesdeDatos(datosProducto);
}


function cargarEstadoDesdeStorage() {
    const productosGuardados = obtenerDatosDelStorage(CLAVE_CATALOGO);
    const carritoGuardado = obtenerDatosDelStorage(CLAVE_CARRITO);
    const hayCatalogoGuardado = Array.isArray(productosGuardados);
    const hayCarritoGuardado = Array.isArray(carritoGuardado);

    if (hayCatalogoGuardado) {
        const productosRecuperados = productosGuardados
            .filter(function (producto) {
                return producto?.id !== undefined &&
                    producto?.nombre &&
                    producto?.precio > 0 &&
                    producto?.categoria &&
                    producto?.stock >= 0;
            })
            .map(crearProductoDesdeStorage);

        catalogo.splice(0, catalogo.length, ...productosRecuperados);
        catalogo.forEach(completarDatosVisualesDelProducto);
    }

    carrito = hayCarritoGuardado
        ? carritoGuardado
            .map(Number)
            .filter(function (idProducto) {
                return obtenerProductoPorId(idProducto)?.id === idProducto;
            })
        : [];

    return hayCatalogoGuardado || hayCarritoGuardado;
}


// La promoción aparece después de entrar, mientras la interfaz sigue disponible.
function programarAvisoDeDescuento() {
    setTimeout(function () {
        document.getElementById("avisoDescuento").textContent =
            "Recordá: comprando 2 productos tenés un 5 % de descuento; " +
            "con 3 o más, un 10 %. Se aplica al finalizar la compra simulada.";
    }, 3000);
}


function mostrarMensaje(texto, tipo = "ok") {
    mensajeEstado.textContent = texto;
    mensajeEstado.className = "status-message " + tipo;
}


function obtenerProductosVisibles() {
    const productosPorCategoria = filtrarProductosPorCategoria(
        categoriaSeleccionada
    );

    return filtrarProductosPorTexto(textoBusqueda, productosPorCategoria);
}


function renderizarCatalogo(lista = obtenerProductosVisibles()) {
    if (lista.length === 0) {
        productosGrid.innerHTML = `
            <p class="empty-catalog">
                No encontramos títulos con esos filtros.
            </p>
        `;

        return;
    }

    productosGrid.innerHTML = lista.map(function (producto) {
        const sinStock = producto.stock === 0;
        const nombreSeguro = escaparHTML(producto.nombre);
        const categoriaSegura = escaparHTML(producto.categoria);
        const editorial = producto.editorial?.trim() || "Catálogo local";
        const editorialSeguro = escaparHTML(editorial);
        const imagen = producto.imagen?.trim() ?? "";
        const imagenSegura = escaparHTML(imagen);
        const enlaceEditorial = producto.enlaceEditorial?.trim() ?? "";
        const enlaceEditorialSeguro = escaparHTML(enlaceEditorial);
        const tieneImagen = imagen !== "";
        const contenidoPortada = tieneImagen
            ? `<img
                    src="${imagenSegura}"
                    alt="Portada de ${nombreSeguro}, edición ${editorialSeguro}"
                    loading="lazy"
                    decoding="async"
                >`
            : `<span>${nombreSeguro}</span>`;
        const fichaEditorial = enlaceEditorial
            ? `<a
                    class="editorial-link"
                    href="${enlaceEditorialSeguro}"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Abrir la ficha de ${nombreSeguro} en ${editorialSeguro}"
                >
                    Ver ficha en ${editorialSeguro}
                </a>`
            : "";

        return `
            <article class="product-card" id="producto-${producto.id}">
                <div class="product-cover${tieneImagen ? "" : " cover-fallback"}">
                    ${contenidoPortada}
                </div>

                <div class="product-info">
                    <div class="product-meta">
                        <span class="product-category">${categoriaSegura}</span>
                        <span class="product-editorial">${editorialSeguro}</span>
                    </div>
                    <h3>${nombreSeguro}</h3>
                    <p class="price">${formatearPrecio(producto.precio)}</p>
                    <p class="stock-text">Stock disponible: ${producto.stock}</p>
                    ${fichaEditorial}

                    <div class="product-actions">
                        <button
                            class="add-cart-btn"
                            type="button"
                            data-accion="agregar-carrito"
                            data-id="${producto.id}"
                            ${sinStock ? "disabled" : ""}
                        >
                            ${sinStock ? "Sin stock" : "Agregar al carrito"}
                        </button>

                        <button
                            class="delete-product-btn"
                            type="button"
                            data-accion="eliminar-producto"
                            data-id="${producto.id}"
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            </article>
        `;
    }).join("");
}


function actualizarResumenCatalogo(lista) {
    const filtrosActivos =
        categoriaSeleccionada !== "Todos" || textoBusqueda !== "";

    if (lista.length === 0) {
        mensajeBusqueda.textContent =
            "No hay títulos que coincidan con la búsqueda.";
        mensajeBusqueda.className = "search-message error";
        return;
    }

    const palabra = lista.length === 1 ? "título" : "títulos";
    const detalleFiltro = filtrosActivos
        ? " que coinciden con los filtros actuales."
        : " disponibles en el catálogo.";

    mensajeBusqueda.textContent =
        "Mostrando " + lista.length + " " + palabra + detalleFiltro;
    mensajeBusqueda.className = "search-message ok";
}


function actualizarVistaCatalogo() {
    const listaVisible = obtenerProductosVisibles();

    renderizarCatalogo(listaVisible);
    actualizarResumenCatalogo(listaVisible);
}


function contarProducto(idProducto) {
    return carrito.filter(function (productoDelCarrito) {
        return productoDelCarrito === idProducto;
    }).length;
}


function obtenerProductosUnicosDelCarrito() {
    return carrito.filter(function (idProducto, indice) {
        return carrito.indexOf(idProducto) === indice;
    });
}


function calcularTotalCarrito() {
    return carrito.reduce(function (total, idProducto) {
        const producto = obtenerProductoPorId(idProducto);

        return producto === null ? total : total + producto.precio;
    }, 0);
}


function renderizarCarrito() {
    cantidadCarrito.textContent = carrito.length;
    totalCarrito.textContent = formatearPrecio(calcularTotalCarrito());

    if (carrito.length === 0) {
        carritoContenido.innerHTML = `
            <p class="empty-cart">
                Todavía no agregaste ningún producto.
            </p>
        `;

        return;
    }

    const productosUnicos = obtenerProductosUnicosDelCarrito();

    carritoContenido.innerHTML = productosUnicos.map(function (idProducto) {
        const producto = obtenerProductoPorId(idProducto);

        if (producto === null) {
            return "";
        }

        const cantidad = contarProducto(idProducto);
        const subtotal = calcularSubtotal(cantidad, producto.precio);
        const nombreSeguro = escaparHTML(producto.nombre);

        return `
            <article class="cart-item">
                <div>
                    <h3>${nombreSeguro}</h3>
                    <p class="cart-item-price">
                        ${formatearPrecio(producto.precio)} c/u
                    </p>
                    <p class="cart-item-price">
                        Stock disponible: ${producto.stock}
                    </p>
                </div>

                <strong class="cart-subtotal">
                    ${formatearPrecio(subtotal)}
                </strong>

                <div class="cart-item-controls">
                    <button
                        class="quantity-btn"
                        type="button"
                        data-accion="quitar-unidad"
                        data-id="${producto.id}"
                        aria-label="Quitar una unidad de ${nombreSeguro}"
                    >
                        −
                    </button>

                    <span class="quantity">${cantidad}</span>

                    <button
                        class="quantity-btn"
                        type="button"
                        data-accion="agregar-carrito"
                        data-id="${producto.id}"
                        ${producto.stock === 0 ? "disabled" : ""}
                        aria-label="Agregar una unidad de ${nombreSeguro}"
                    >
                        +
                    </button>

                    <button
                        class="remove-btn"
                        type="button"
                        data-accion="eliminar-carrito"
                        data-id="${producto.id}"
                    >
                        Quitar todo
                    </button>
                </div>
            </article>
        `;
    }).join("");
}


function agregarAlCarrito(idProducto) {
    const producto = obtenerProductoPorId(idProducto);

    if (producto === null) {
        mostrarMensaje("No se encontró el producto seleccionado.", "error");
        return;
    }

    const resultadoVenta = producto.vender(1);

    if (!resultadoVenta.exito) {
        mostrarMensaje(resultadoVenta.mensaje, "warning");
        return;
    }

    carrito.push(producto.id);
    guardarEstadoEnStorage();

    actualizarVistaCatalogo();
    renderizarCarrito();
    mostrarMensaje(resultadoVenta.mensaje, "ok");
}


function quitarUnaUnidad(idProducto) {
    const posicion = carrito.indexOf(idProducto);

    if (posicion === -1) {
        return;
    }

    carrito.splice(posicion, 1);

    const producto = obtenerProductoPorId(idProducto);

    if (producto !== null) {
        producto.reponer(1);
        mostrarMensaje(
            "Se quitó una unidad de " + producto.nombre + " del carrito.",
            "ok"
        );
    }

    guardarEstadoEnStorage();
    actualizarVistaCatalogo();
    renderizarCarrito();
}


function eliminarProductoDelCarrito(idProducto) {
    const cantidadEliminada = contarProducto(idProducto);

    if (cantidadEliminada === 0) {
        return;
    }

    carrito = carrito.filter(function (productoDelCarrito) {
        return productoDelCarrito !== idProducto;
    });

    const producto = obtenerProductoPorId(idProducto);

    if (producto !== null) {
        producto.reponer(cantidadEliminada);
        mostrarMensaje(
            "Se quitaron " + cantidadEliminada + " unidad(es) de " +
            producto.nombre + " del carrito.",
            "ok"
        );
    }

    guardarEstadoEnStorage();
    actualizarVistaCatalogo();
    renderizarCarrito();
}


function eliminarProductoDelCatalogo(idProducto) {
    const posicion = catalogo.findIndex(function (producto) {
        return producto.id === idProducto;
    });

    if (posicion === -1) {
        mostrarMensaje("El producto ya no se encuentra en el catálogo.", "error");
        return;
    }

    const producto = catalogo[posicion];
    const unidadesEnCarrito = contarProducto(idProducto);

    carrito = carrito.filter(function (productoDelCarrito) {
        return productoDelCarrito !== idProducto;
    });

    catalogo.splice(posicion, 1);
    guardarEstadoEnStorage();

    actualizarVistaCatalogo();
    renderizarCarrito();

    const detalleCarrito = unidadesEnCarrito > 0
        ? " También se quitaron sus unidades del carrito."
        : "";

    mostrarMensaje(
        producto.nombre + " se eliminó del catálogo." + detalleCarrito,
        "warning"
    );
}


function devolverProductosAlStock() {
    carrito.forEach(function (idProducto) {
        const producto = obtenerProductoPorId(idProducto);

        if (producto !== null) {
            producto.reponer(1);
        }
    });
}


function vaciarCarrito() {
    if (carrito.length === 0) {
        mostrarMensaje("El carrito ya está vacío.", "warning");
        return;
    }

    devolverProductosAlStock();
    carrito = [];
    guardarEstadoEnStorage();

    actualizarVistaCatalogo();
    renderizarCarrito();
    mostrarMensaje("El carrito se vació y el stock fue restaurado.", "ok");
}


function finalizarCompra() {
    if (carrito.length === 0) {
        mostrarMensaje(
            "Agregá al menos un producto antes de finalizar la compra.",
            "warning"
        );
        return;
    }

    const cantidadProductos = carrito.length;
    const total = calcularTotalCarrito();
    const descuento = calcularDescuento(cantidadProductos, total);
    const totalFinal = total - descuento;

    carrito = [];
    guardarCatalogoEnStorage();
    localStorage.removeItem(CLAVE_CARRITO);

    actualizarVistaCatalogo();
    renderizarCarrito();
    cerrarCarrito();
    mostrarMensaje(
        "Compra simulada en " + NOMBRE_TIENDA + ": " +
        cantidadProductos + " producto(s), total " +
        formatearPrecio(totalFinal) + ".",
        "ok"
    );
}


function abrirCarrito() {
    carritoPanel.classList.add("open");
    carritoOverlay.classList.add("visible");
    carritoPanel.setAttribute("aria-hidden", "false");
    carritoOverlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("cart-open");
}


function cerrarCarrito() {
    carritoPanel.classList.remove("open");
    carritoOverlay.classList.remove("visible");
    carritoPanel.setAttribute("aria-hidden", "true");
    carritoOverlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("cart-open");
}


function actualizarBusquedaDesdeInput() {
    textoBusqueda = buscarInput.value.trim();
    actualizarVistaCatalogo();
}


function buscarDesdeWeb() {
    actualizarBusquedaDesdeInput();

    if (textoBusqueda === "") {
        mostrarMensaje("Mostrando todo el catálogo.", "ok");
        return;
    }

    const coincidencias = obtenerProductosVisibles().length;

    if (coincidencias === 0) {
        mostrarMensaje(
            "No encontramos títulos para “" + textoBusqueda + "”.",
            "warning"
        );
        return;
    }

    mostrarMensaje(
        "Encontramos " + coincidencias + " resultado(s) para “" +
        textoBusqueda + "”.",
        "ok"
    );
}


function ocultarVistaPreviaPortada() {
    vistaPreviaPortada.hidden = true;
    vistaPreviaPortada.classList.remove("is-searching", "not-found");
    vistaPreviaPortada.setAttribute("aria-busy", "false");
    imagenPortadaDetectada.hidden = false;
    imagenPortadaDetectada.removeAttribute("src");
    imagenPortadaDetectada.alt = "";
    mensajePortada.textContent = "";
}


function mostrarVistaPreviaPortada(datosVisuales, mensaje) {
    const { imagen, titulo } = datosVisuales;

    vistaPreviaPortada.hidden = false;
    vistaPreviaPortada.classList.remove("is-searching", "not-found");
    vistaPreviaPortada.setAttribute("aria-busy", "false");
    imagenPortadaDetectada.hidden = false;
    imagenPortadaDetectada.src = imagen;
    imagenPortadaDetectada.alt = "Portada detectada de " + titulo;
    mensajePortada.textContent = mensaje;
}


function mostrarBusquedaDePortada() {
    vistaPreviaPortada.hidden = false;
    vistaPreviaPortada.classList.add("is-searching");
    vistaPreviaPortada.classList.remove("not-found");
    vistaPreviaPortada.setAttribute("aria-busy", "true");
    imagenPortadaDetectada.hidden = true;
    imagenPortadaDetectada.removeAttribute("src");
    imagenPortadaDetectada.alt = "";
    mensajePortada.textContent = "Buscando una portada para este título...";
}


function mostrarPortadaNoEncontrada() {
    vistaPreviaPortada.hidden = false;
    vistaPreviaPortada.classList.remove("is-searching");
    vistaPreviaPortada.classList.add("not-found");
    vistaPreviaPortada.setAttribute("aria-busy", "false");
    imagenPortadaDetectada.hidden = true;
    imagenPortadaDetectada.removeAttribute("src");
    imagenPortadaDetectada.alt = "";
    mensajePortada.textContent =
        "No encontramos una portada automática. Se agregará como catálogo local.";
}


function actualizarVistaPreviaPortada() {
    clearTimeout(temporizadorPortada);

    const nombre = nombreProducto.value.trim();
    const categoria = categoriaProducto.value;
    const datosLocales = obtenerDatosVisualesPorTitulo(nombre, categoria);
    const numeroSolicitud = ++solicitudPortadaActual;

    if (datosLocales.imagen !== "") {
        mostrarVistaPreviaPortada(
            datosLocales,
            "Portada detectada: " + datosLocales.titulo +
            ". Se agregará automáticamente."
        );
        return;
    }

    if (normalizarTexto(nombre).length < 3) {
        ocultarVistaPreviaPortada();
        return;
    }

    mostrarBusquedaDePortada();

    temporizadorPortada = setTimeout(async function () {
        const datosVisuales = await buscarDatosVisualesPorTitulo(nombre, categoria);

        if (numeroSolicitud !== solicitudPortadaActual) {
            return;
        }

        if (datosVisuales.imagen === "") {
            mostrarPortadaNoEncontrada();
            return;
        }

        mostrarVistaPreviaPortada(
            datosVisuales,
            "Portada encontrada: " + datosVisuales.titulo +
            ". Se agregará automáticamente."
        );
    }, 500);
}


async function agregarProductoDesdeFormulario(evento) {
    evento.preventDefault();

    const botonAgregar = formularioProducto.querySelector('button[type="submit"]');

    // Evita dos altas si se vuelve a enviar mientras se busca la portada.
    if (botonAgregar.disabled) {
        return;
    }

    mensajeFormulario.textContent = "";

    const nombre = nombreProducto.value.trim();
    const precio = Number(precioProducto.value);
    const categoria = categoriaProducto.value;
    const stock = Number(stockProducto.value);

    if (nombre.length < 2) {
        mostrarMensajeFormulario("Escribí un nombre de al menos 2 caracteres.", "error");
        mostrarMensaje(
            "Escribí un nombre de al menos 2 caracteres para el título.",
            "error"
        );
        nombreProducto.focus();
        return;
    }

    if (!Number.isFinite(precio) || precio <= 0) {
        mostrarMensajeFormulario("Ingresá un precio válido mayor a 0.", "error");
        mostrarMensaje("Ingresá un precio válido mayor a 0.", "error");
        precioProducto.focus();
        return;
    }

    if (stockProducto.value.trim() === "" || !Number.isInteger(stock) || stock < 0) {
        mostrarMensajeFormulario("Ingresá un stock entero igual o mayor a 0.", "error");
        mostrarMensaje(
            "El stock debe ser un número entero igual o mayor a 0.",
            "error"
        );
        stockProducto.focus();
        return;
    }

    const existeNombre = catalogo.some(function (producto) {
        return normalizarTexto(producto.nombre) === normalizarTexto(nombre);
    });

    if (existeNombre) {
        mostrarMensajeFormulario("Ya existe un título con ese nombre.", "error");
        mostrarMensaje(
            "Ya existe un título con ese nombre en el catálogo.",
            "warning"
        );
        nombreProducto.focus();
        return;
    }

    const textoOriginal = botonAgregar.textContent;
    let nuevoProducto = null;
    let productoGuardado = false;
    botonAgregar.disabled = true;
    botonAgregar.textContent = "Agregando...";
    formularioProducto.setAttribute("aria-busy", "true");
    mostrarMensajeFormulario("Buscando la portada y guardando el título...", "pending");

    // Buscar una portada o escribir en localStorage puede fallar.
    try {
        const datosVisuales = await buscarDatosVisualesPorTitulo(nombre, categoria);
        const { imagen, editorial, enlaceEditorial, titulo } = datosVisuales;

        nuevoProducto = new Producto(
            obtenerSiguienteId(), nombre, precio, categoria, stock,
            imagen, editorial, enlaceEditorial
        );

        catalogo.push(nuevoProducto);
        // Esta operación cambia solamente el catálogo, no el carrito.
        guardarCatalogoEnStorage();
        productoGuardado = true;

        formularioProducto.reset();
        categoriaSeleccionada = "Todos";
        categoriaFiltro.value = "Todos";
        textoBusqueda = "";
        buscarInput.value = "";
        actualizarVistaPreviaPortada();
        actualizarVistaCatalogo();

        const detallePortada = imagen !== ""
            ? " Se asignó la portada de " + titulo + "."
            : "";
        const mensaje = nombre + " se agregó al catálogo correctamente." + detallePortada;
        mostrarMensaje(mensaje, "ok");
        mostrarMensajeFormulario(mensaje, "ok");
        nombreProducto.focus();
    } catch (error) {
        // Si falla el guardado, retira el alta para permitir reintentar.
        if (nuevoProducto !== null && !productoGuardado) {
            const posicion = catalogo.indexOf(nuevoProducto);
            if (posicion !== -1) {
                catalogo.splice(posicion, 1);
            }
        }

        const mensaje = productoGuardado
            ? "El título se guardó, pero no se pudo actualizar la vista. Recargá la página."
            : "No se pudo agregar el título. Revisá que el navegador permita guardar datos e intentá de nuevo.";
        mostrarMensaje(mensaje, "error");
        mostrarMensajeFormulario(mensaje, "error");
    } finally {
        // Se ejecuta tanto si la operación funciona como si falla.
        botonAgregar.disabled = false;
        botonAgregar.textContent = textoOriginal;
        formularioProducto.setAttribute("aria-busy", "false");
    }
}


function mostrarMensajeFormulario(texto, tipo) {
    mensajeFormulario.textContent = texto;
    mensajeFormulario.className = "form-message form-field-wide " + tipo;
}


function manejarAccionesCatalogo(evento) {
    const boton = evento.target.closest("button[data-accion]");

    if (!boton || !productosGrid.contains(boton)) {
        return;
    }

    const idProducto = Number(boton.dataset.id);

    if (boton.dataset.accion === "agregar-carrito") {
        agregarAlCarrito(idProducto);
    }

    if (boton.dataset.accion === "eliminar-producto") {
        eliminarProductoDelCatalogo(idProducto);
    }
}


function manejarAccionesCarrito(evento) {
    const boton = evento.target.closest("button[data-accion]");

    if (!boton || !carritoContenido.contains(boton)) {
        return;
    }

    const idProducto = Number(boton.dataset.id);
    const accion = boton.dataset.accion;

    if (accion === "agregar-carrito") {
        agregarAlCarrito(idProducto);
    }

    if (accion === "quitar-unidad") {
        quitarUnaUnidad(idProducto);
    }

    if (accion === "eliminar-carrito") {
        eliminarProductoDelCarrito(idProducto);
    }
}


function registrarEventos() {
    buscarBtn.addEventListener("click", buscarDesdeWeb);

    buscarInput.addEventListener("keyup", actualizarBusquedaDesdeInput);

    buscarInput.addEventListener("keydown", function (evento) {
        if (evento.key === "Escape") {
            buscarInput.value = "";
            actualizarBusquedaDesdeInput();
            mostrarMensaje("Se limpió la búsqueda.", "ok");
        }
    });

    categoriaFiltro.addEventListener("change", function () {
        categoriaSeleccionada = categoriaFiltro.value;
        actualizarVistaCatalogo();

        const mensaje = categoriaSeleccionada === "Todos"
            ? "Se muestran todas las categorías."
            : "Filtro aplicado: " + categoriaSeleccionada + ".";

        mostrarMensaje(mensaje, "ok");
    });

    formularioProducto.addEventListener("submit", agregarProductoDesdeFormulario);
    nombreProducto.addEventListener("input", actualizarVistaPreviaPortada);
    categoriaProducto.addEventListener("change", actualizarVistaPreviaPortada);
    productosGrid.addEventListener("click", manejarAccionesCatalogo);
    carritoContenido.addEventListener("click", manejarAccionesCarrito);

    document
        .getElementById("abrirCarritoBtn")
        .addEventListener("click", abrirCarrito);

    document
        .getElementById("navCarritoBtn")
        .addEventListener("click", abrirCarrito);

    document
        .getElementById("cerrarCarritoBtn")
        .addEventListener("click", cerrarCarrito);

    carritoOverlay.addEventListener("click", cerrarCarrito);

    document
        .getElementById("vaciarCarritoBtn")
        .addEventListener("click", vaciarCarrito);

    document
        .getElementById("finalizarCompraBtn")
        .addEventListener("click", finalizarCompra);
}


function iniciarAplicacion() {
    seleccionarElementosDOM();
    const seRecuperoEstado = cargarEstadoDesdeStorage();

    actualizarVistaCatalogo();
    renderizarCarrito();
    registrarEventos();
    programarAvisoDeDescuento();

    if (seRecuperoEstado) {
        mostrarMensaje(
            "Se recuperaron los datos guardados de tu catálogo y carrito.",
            "ok"
        );
    }
}


document.addEventListener("DOMContentLoaded", iniciarAplicacion);
