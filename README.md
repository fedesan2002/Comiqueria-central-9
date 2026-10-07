# Comiquería Central

Entrega de JavaScript: Pre-Entrega 9 — Asincronismo y Promesas.

Catálogo web interactivo de manga y cómics. La interfaz se genera desde un
array de objetos `Producto` y permite buscar, filtrar, sumar títulos al
catálogo y administrar un carrito de compra sin recargar la página.

## Funcionalidades

- Búsqueda en vivo y filtro por categoría.
- Catálogo renderizado dinámicamente con DOM, template strings y eventos.
- Carrito con suma, resta, eliminación por producto, total y descuento.
- Formulario para agregar títulos propios al catálogo.
- Detección de portadas por nombre: primero usa portadas locales y, si no
  encuentra el título, consulta catálogos públicos para asignar una portada
  automáticamente antes de guardar el producto.
- Persistencia de catálogo, carrito y stock mediante `localStorage`.
- Recuperación de datos con `JSON.parse()` y guardado con `JSON.stringify()`.
- Aviso de descuentos a los 3 segundos de ingresar, mediante `setTimeout()`.
- Alta de productos con `try-catch-finally`, mensaje de error y botón disponible
  para reintentar después de finalizar la operación.

## Catálogo visual

Las portadas están organizadas dentro de `assets/portadas/` y cada tarjeta
incluye su editorial y un enlace a la ficha original.

- Los mangas toman como referencia el catálogo oficial de
  [Editorial Ivrea Argentina](https://www.ivrea.com.ar/) y, para Naruto, la
  ficha oficial de [VIZ Media](https://www.viz.com/).
- Los cómics toman como referencia el catálogo oficial de
  [OVNI Press](https://www.ovnipress.net/).

Las imágenes se utilizan como referencia visual dentro de este proyecto
académico y conservan su atribución mediante los enlaces de cada ficha.

## Estructura

```text
index.html
css/styles.css
js/catalogo.js
js/main.js
assets/portadas/
```

## Persistencia

El estado se guarda bajo claves versionadas de `localStorage`. Cada acción que
modifica productos, stock o carrito actualiza el array, persiste los cambios y
vuelve a renderizar la interfaz.

El código utiliza operadores modernos (`??`, `?.` y ternarios) y destructuring
para recuperar los datos de cada producto sin perder los métodos de la clase
`Producto` al recargar la página.

## Pre-Entrega 9

En `js/main.js`, `programarAvisoDeDescuento()` se llama al iniciar la aplicación.
El temporizador permite seguir buscando y usando el carrito durante la espera.
El aviso informa los descuentos que aplica `calcularDescuento()` a la compra
simulada: 5 % por 2 unidades y 10 % por 3 o más unidades.

En `agregarProductoDesdeFormulario()`, el bloque `try` espera la portada y
guarda el producto. El `catch` muestra un mensaje visible si falla y retira el
producto del array cuando no llegó a guardarse. El `finally` siempre restaura
el botón y termina el estado de carga. No se borra el formulario si falla el
guardado, para poder reintentar.

Las búsquedas de portadas usan `async/await` y las promesas de `fetch()`. Si una
fuente externa no está disponible, se intenta la siguiente y se puede agregar
el título sin portada.

## Cómo probar

1. Abrí `index.html` con Live Server en Visual Studio Code.
2. Usá el buscador inmediatamente: la interfaz responde antes de que aparezca
   el aviso de descuentos a los 3 segundos.
3. Agregá un título nuevo con precio y stock válidos. El botón indica
   “Agregando...” durante el proceso, se guarda el título y vuelve a habilitarse.
4. Recargá la página para comprobar que el título sigue en el catálogo.
5. Para verificar un error de guardado, ejecutá en la consola del navegador:

   ```js
   window.setItemOriginal = Storage.prototype.setItem;
   Storage.prototype.setItem = function () {
       throw new Error("Error de guardado simulado");
   };
   ```

   Intentá agregar otro título. Se muestra el error, se conservan los campos,
   el título no se agrega y el botón vuelve a estar disponible. Restaurá el
   guardado antes de continuar:

   ```js
   Storage.prototype.setItem = window.setItemOriginal;
   delete window.setItemOriginal;
   ```

## Entrega en GitHub

Subí el contenido de esta carpeta a un repositorio público. `index.html` debe
quedar junto a `js/`, `css/` y `assets/`. Entregá el enlace del repositorio.
