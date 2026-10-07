class Producto {
    constructor(
        id,
        nombre,
        precio,
        categoria,
        stock,
        imagen = "",
        editorial = "Catálogo local",
        enlaceEditorial = ""
    ) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
        this.stock = stock;
        this.imagen = imagen;
        this.editorial = editorial;
        this.enlaceEditorial = enlaceEditorial;
    }

    vender(cantidad) {
        if (!Number.isInteger(cantidad) || cantidad <= 0) {
            return {
                exito: false,
                mensaje: "La cantidad debe ser un número entero mayor a 0."
            };
        }

        if (cantidad > this.stock) {
            return {
                exito: false,
                mensaje: "No hay stock suficiente de " + this.nombre + "."
            };
        }

        this.stock -= cantidad;

        return {
            exito: true,
            mensaje:
                "Se agregaron " + cantidad + " unidad(es) de " +
                this.nombre + " al carrito."
        };
    }

    reponer(cantidad) {
        if (!Number.isInteger(cantidad) || cantidad <= 0) {
            return {
                exito: false,
                mensaje: "La cantidad a reponer debe ser mayor a 0."
            };
        }

        this.stock += cantidad;

        return {
            exito: true,
            mensaje:
                "Se repusieron " + cantidad + " unidad(es) de " +
                this.nombre + "."
        };
    }
}


const productosIniciales = [
    {
        id: 1,
        nombre: "Kagurabachi Vol. 1",
        precio: 15500,
        categoria: "Manga",
        stock: 8,
        imagen: "assets/portadas/kagurabachi-01.jpg",
        editorial: "Ivrea",
        enlaceEditorial: "https://www.ivrea.com.ar/titulo/kagurabachi/"
    },
    {
        id: 2,
        nombre: "Dandadan Vol. 1",
        precio: 15500,
        categoria: "Manga",
        stock: 6,
        imagen: "assets/portadas/dandadan-01.jpg",
        editorial: "Ivrea",
        enlaceEditorial: "https://www.ivrea.com.ar/titulo/dandadan/"
    },
    {
        id: 3,
        nombre: "Chainsaw Man Vol. 1",
        precio: 15800,
        categoria: "Manga",
        stock: 7,
        imagen: "assets/portadas/chainsaw-man-01.jpg",
        editorial: "Ivrea",
        enlaceEditorial: "https://www.ivrea.com.ar/titulo/chainsaw-man/"
    },
    {
        id: 4,
        nombre: "One Piece Vol. 1",
        precio: 15900,
        categoria: "Manga",
        stock: 10,
        imagen: "assets/portadas/one-piece-01.jpg",
        editorial: "Ivrea",
        enlaceEditorial: "https://www.ivrea.com.ar/titulo/one-piece/"
    },
    {
        id: 5,
        nombre: "Sakamoto Days Vol. 1",
        precio: 15500,
        categoria: "Manga",
        stock: 5,
        imagen: "assets/portadas/sakamoto-days-01.jpg",
        editorial: "Ivrea",
        enlaceEditorial: "https://www.ivrea.com.ar/titulo/sakamoto-days/"
    },
    {
        id: 6,
        nombre: "Blue Lock Vol. 1",
        precio: 15500,
        categoria: "Manga",
        stock: 6,
        imagen: "assets/portadas/blue-lock-01.jpg",
        editorial: "Ivrea",
        enlaceEditorial: "https://www.ivrea.com.ar/titulo/blue-lock/"
    },
    {
        id: 7,
        nombre: "Watchmen",
        precio: 35000,
        categoria: "Cómic",
        stock: 4,
        imagen: "assets/portadas/watchmen.webp",
        editorial: "OVNI Press",
        enlaceEditorial: "https://www.ovnipress.net/productos/watchmen/"
    },
    {
        id: 8,
        nombre: "Batman: No Man's Land — Cataclismo Parte 1",
        precio: 30000,
        categoria: "Cómic",
        stock: 3,
        imagen: "assets/portadas/batman-no-mans-land-cataclismo-01.webp",
        editorial: "OVNI Press",
        enlaceEditorial: "https://www.ovnipress.net/productos/batman-no-mans-land-cataclismo-parte-1-7r2mf/"
    },
    {
        id: 9,
        nombre: "Absolute Wonder Woman Vol. 1",
        precio: 26000,
        categoria: "Cómic",
        stock: 4,
        imagen: "assets/portadas/absolute-wonder-woman-01.webp",
        editorial: "OVNI Press",
        enlaceEditorial: "https://www.ovnipress.net/productos/absolute-wonder-woman-vol-1/"
    }
];


const portadasReconocidas = [
    {
        claves: ["gurren lagann", "tengen toppa gurren lagann"],
        categoria: "Manga",
        titulo: "Gurren Lagann Vol. 1",
        imagen: "assets/portadas/gurren-lagann.jpg",
        editorial: "Panini Manga",
        enlaceEditorial: "https://openlibrary.org/works/OL19549759W"
    },
    {
        claves: ["naruto"],
        categoria: "Manga",
        titulo: "Naruto Vol. 1",
        imagen: "assets/portadas/naruto-01.jpg",
        editorial: "VIZ Media",
        enlaceEditorial: "https://www.viz.com/manga-books/manga/naruto-volume-1/product/91"
    },
    {
        claves: ["kagurabachi"],
        categoria: "Manga",
        titulo: "Kagurabachi Vol. 1",
        imagen: "assets/portadas/kagurabachi-01.jpg",
        editorial: "Ivrea",
        enlaceEditorial: "https://www.ivrea.com.ar/titulo/kagurabachi/"
    },
    {
        claves: ["dandadan", "dan da dan"],
        categoria: "Manga",
        titulo: "Dandadan Vol. 1",
        imagen: "assets/portadas/dandadan-01.jpg",
        editorial: "Ivrea",
        enlaceEditorial: "https://www.ivrea.com.ar/titulo/dandadan/"
    },
    {
        claves: ["chainsaw man", "chainsawman"],
        categoria: "Manga",
        titulo: "Chainsaw Man Vol. 1",
        imagen: "assets/portadas/chainsaw-man-01.jpg",
        editorial: "Ivrea",
        enlaceEditorial: "https://www.ivrea.com.ar/titulo/chainsaw-man/"
    },
    {
        claves: ["one piece"],
        categoria: "Manga",
        titulo: "One Piece Vol. 1",
        imagen: "assets/portadas/one-piece-01.jpg",
        editorial: "Ivrea",
        enlaceEditorial: "https://www.ivrea.com.ar/titulo/one-piece/"
    },
    {
        claves: ["sakamoto days"],
        categoria: "Manga",
        titulo: "Sakamoto Days Vol. 1",
        imagen: "assets/portadas/sakamoto-days-01.jpg",
        editorial: "Ivrea",
        enlaceEditorial: "https://www.ivrea.com.ar/titulo/sakamoto-days/"
    },
    {
        claves: ["blue lock"],
        categoria: "Manga",
        titulo: "Blue Lock Vol. 1",
        imagen: "assets/portadas/blue-lock-01.jpg",
        editorial: "Ivrea",
        enlaceEditorial: "https://www.ivrea.com.ar/titulo/blue-lock/"
    }
];


function crearProductoDesdeDatos(datosProducto) {
    const {
        id,
        nombre,
        precio,
        categoria,
        stock,
        imagen = "",
        editorial = "Catálogo local",
        enlaceEditorial = ""
    } = datosProducto;

    return new Producto(
        Number(id),
        String(nombre),
        Number(precio),
        String(categoria),
        Number(stock),
        String(imagen),
        String(editorial),
        String(enlaceEditorial)
    );
}


const catalogo = productosIniciales.map(crearProductoDesdeDatos);


function formatearPrecio(valor) {
    return "$" + valor.toLocaleString("es-AR");
}


function normalizarTexto(texto) {
    return String(texto)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("es")
        .replace(/[^a-z0-9]+/g, " ")
        .trim();
}


function obtenerDatosVisualesPorTitulo(nombre, categoria) {
    const tituloNormalizado = normalizarTexto(nombre);
    const portadaEncontrada = portadasReconocidas.find(function (portada) {
        return portada.categoria === categoria && portada.claves.some(function (clave) {
            return tituloNormalizado.includes(normalizarTexto(clave));
        });
    });

    const {
        imagen = "",
        editorial = "Catálogo local",
        enlaceEditorial = "",
        titulo = ""
    } = portadaEncontrada ?? {};

    return { imagen, editorial, enlaceEditorial, titulo };
}


function completarDatosVisualesDelProducto(producto) {
    const { imagen, editorial, enlaceEditorial } = obtenerDatosVisualesPorTitulo(
        producto.nombre,
        producto.categoria
    );
    const productoSinImagen = producto.imagen?.trim() === "";

    if (!productoSinImagen || imagen === "") {
        return false;
    }

    producto.imagen = imagen;
    producto.editorial = editorial;
    producto.enlaceEditorial = enlaceEditorial;

    return true;
}


const cachePortadasAutomaticas = new Map();


function elegirResultadoMasCercano(lista, nombre, obtenerTitulo) {
    const nombreNormalizado = normalizarTexto(nombre);

    return lista.find(function (resultado) {
        const tituloNormalizado = normalizarTexto(obtenerTitulo(resultado));

        if (tituloNormalizado === "") {
            return false;
        }

        return tituloNormalizado === nombreNormalizado ||
            tituloNormalizado.includes(nombreNormalizado) ||
            nombreNormalizado.includes(tituloNormalizado);
    }) ?? lista[0] ?? null;
}


function convertirImagenEnHTTPS(urlImagen) {
    return String(urlImagen ?? "").replace(/^http:/, "https:");
}


async function buscarPortadaEnGoogleBooks(nombre) {
    try {
        const consulta = encodeURIComponent("intitle:" + nombre);
        const respuesta = await fetch(
            "https://www.googleapis.com/books/v1/volumes?q=" + consulta +
            "&maxResults=5&printType=books"
        );

        if (!respuesta.ok) {
            return null;
        }

        const { items = [] } = await respuesta.json();
        const volumen = elegirResultadoMasCercano(
            items,
            nombre,
            function (resultado) {
                return resultado.volumeInfo?.title ?? "";
            }
        );
        const informacion = volumen?.volumeInfo ?? {};
        const imagenes = informacion.imageLinks ?? {};
        const imagen = convertirImagenEnHTTPS(
            imagenes.large ??
            imagenes.medium ??
            imagenes.small ??
            imagenes.thumbnail
        );

        if (imagen === "") {
            return null;
        }

        return {
            imagen,
            editorial: informacion.publisher ?? "Portada automática",
            enlaceEditorial: informacion.infoLink ?? "",
            titulo: informacion.title ?? nombre
        };
    } catch (error) {
        return null;
    }
}


async function buscarPortadaEnOpenLibrary(nombre) {
    try {
        const consulta = encodeURIComponent(nombre);
        const respuesta = await fetch(
            "https://openlibrary.org/search.json?title=" + consulta +
            "&limit=5&fields=title,cover_i,key,publisher"
        );

        if (!respuesta.ok) {
            return null;
        }

        const { docs = [] } = await respuesta.json();
        const libro = elegirResultadoMasCercano(
            docs,
            nombre,
            function (resultado) {
                return resultado.title ?? "";
            }
        );
        const idPortada = libro?.cover_i;

        if (!idPortada) {
            return null;
        }

        return {
            imagen: "https://covers.openlibrary.org/b/id/" + idPortada + "-L.jpg",
            editorial: libro.publisher?.[0] ?? "Portada automática",
            enlaceEditorial: libro.key
                ? "https://openlibrary.org" + libro.key
                : "",
            titulo: libro.title ?? nombre
        };
    } catch (error) {
        return null;
    }
}


async function buscarDatosVisualesPorTitulo(nombre, categoria) {
    const datosLocales = obtenerDatosVisualesPorTitulo(nombre, categoria);

    if (datosLocales.imagen !== "") {
        return datosLocales;
    }

    const tituloNormalizado = normalizarTexto(nombre);

    if (tituloNormalizado.length < 3) {
        return datosLocales;
    }

    const claveCache = categoria + ":" + tituloNormalizado;
    const resultadoGuardado = cachePortadasAutomaticas.get(claveCache);

    if (resultadoGuardado) {
        return resultadoGuardado;
    }

    const busqueda = (async function () {
        const portadaGoogle = await buscarPortadaEnGoogleBooks(nombre);

        if (portadaGoogle !== null) {
            return portadaGoogle;
        }

        return (await buscarPortadaEnOpenLibrary(nombre)) ?? datosLocales;
    })();

    cachePortadasAutomaticas.set(claveCache, busqueda);

    const resultado = await busqueda;
    cachePortadasAutomaticas.set(claveCache, resultado);

    return resultado;
}


function filtrarProductosPorCategoria(categoria, lista = catalogo) {
    return lista.filter(function (producto) {
        return categoria === "Todos" || producto.categoria === categoria;
    });
}


function filtrarProductosPorTexto(texto, lista = catalogo) {
    const busqueda = normalizarTexto(texto);

    if (busqueda === "") {
        return lista;
    }

    return lista.filter(function (producto) {
        return normalizarTexto(producto.nombre).includes(busqueda);
    });
}


function obtenerProductoPorId(idProducto) {
    const productoEncontrado = catalogo.find(function (producto) {
        return producto.id === idProducto;
    });

    return productoEncontrado || null;
}


function obtenerSiguienteId() {
    const ultimoId = catalogo.reduce(function (mayorId, producto) {
        return Math.max(mayorId, producto.id);
    }, 0);

    return ultimoId + 1;
}
