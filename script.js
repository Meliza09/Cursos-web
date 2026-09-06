
const cursos = [
  {
    id: 1,
    institucion: "Fundamentos de programación",
    titulo: "Curso 1",
    duracion: "20 horas",
    descripcion: "Aprende los conceptos esenciales de la programación, como variables, operadores, condicionales, ciclos y funciones, desarrollando una base sólida para comenzar a crear tus propios programas.",
    precioMXN: 1290.0,
    colorLogo: "#7a1f2b",
    iniciales: "C1",
  },
  {
    id: 2,
    institucion: "Desarrollo Web con HTML y CSS",
    titulo: "Curso 2",
    duracion: "15 horas",
    descripcion: "Aprende a crear páginas web modernas y atractivas utilizando HTML para estructurar el contenido y CSS para diseñar y personalizar la apariencia de cada sitio.",
    precioMXN: 990.0,
    colorLogo: "#1f4d7a",
    iniciales: "C2",
  },
  {
    id: 3,
    institucion: "JavaScript desde cero",
    titulo: "Curso 3",
    duracion: "25 horas",
    descripcion: "Descubre cómo agregar interactividad y funcionalidades dinámicas a tus páginas web mediante JavaScript, aprendiendo desde conceptos básicos hasta la creación de aplicaciones sencillas.",
    precioMXN: 1490.0,
    colorLogo: "#1f7a4d",
    iniciales: "C3",
  },
  {
    id: 4,
    institucion: "Programación orientada a objetos con Java",
    titulo: "Curso 4",
    duracion: "18 horas",
    descripcion: "Conoce los principios de la programación orientada a objetos y aprende a desarrollar aplicaciones utilizando clases, objetos, herencia, encapsulamiento y polimorfismo con Java.",
    precioMXN: 1190.0,
    colorLogo: "#c9a24b",
    iniciales: "C4",
  },
  {
    id: 5,
    institucion: "Desarrollo de Aplicaciones con Python",
    titulo: "Curso 5",
    duracion: "12 horas",
    descripcion: "Aprende a programar en Python mediante ejercicios prácticos y proyectos, utilizando estructuras de datos, funciones, módulos y diferentes herramientas para desarrollar soluciones eficientes.",
    precioMXN: 850.0,
    colorLogo: "#5c3d7a",
    iniciales: "C5",
  },
  {
    id: 6,
    institucion: "Base de Datos y SQL",
    titulo: "Curso 6",
    duracion: "30 horas",
    descripcion: "Aprende a diseñar, administrar y consultar bases de datos utilizando SQL. Conoce conceptos como tablas, relaciones, consultas, inserción, actualización y eliminación de información.",
    precioMXN: 1690.0,
    colorLogo: "#7a5c1f",
    iniciales: "C6",
  },
];

// API obligatorio: tipo de cambio USD/MXN
const API_USD_MXN = "https://mx.dolarapi.com/v1/cotizaciones/usd";

// Conversión USD -> JPY fija (no se obtiene por API).

const JPY_POR_USD = 149.5;

const grid = document.getElementById("gridCursos");
const btnActualizar = document.getElementById("btnActualizar");
const estadoTipoCambio = document.getElementById("estadoTipoCambio");

const BANDERAS = {
  MXN: "🇲🇽",
  USD: "🇺🇸",
  JPY: "🇯🇵",
};

let tipoCambioActual = null; // { compra, venta, fix, fechaActualizacion }

// ==========================================================
// Requerimiento funcional 1: construir las 6 tarjetas dentro
// de un grid responsivo. El botón de inscripción NO ejecuta
// ==========================================================
function renderCursos() {
  grid.innerHTML = "";

  cursos.forEach((curso) => {
    const card = document.createElement("article");
    card.className = "card";

    const precioUSD = calcularPrecioUSD(curso.precioMXN);
    const precioJPY = calcularPrecioJPY(precioUSD);

    card.innerHTML = `
      <div class="card__image-wrap">
        <div class="card__image" style="background-color:${curso.colorLogo}">
          ${curso.iniciales}
        </div>
      </div>
      <div class="card__body">
        <span class="card__institucion">${curso.institucion}</span>
        <h2 class="card__titulo">${curso.titulo}</h2>
        <p class="card__duracion">&#9201; Duración: ${curso.duracion}</p>
        <p class="card__descripcion">${curso.descripcion}</p>
        <div class="card__precios">
          <div class="precio">
            <span class="precio__etiqueta"><span class="precio__bandera">${BANDERAS.MXN}</span>MXN</span>
            <span class="precio__valor">$${curso.precioMXN.toFixed(2)}</span>
          </div>
          <div class="precio">
            <span class="precio__etiqueta"><span class="precio__bandera">${BANDERAS.USD}</span>USD</span>
            <span class="precio__valor" data-precio-usd="${curso.id}">
              ${precioUSD !== null ? "$" + precioUSD.toFixed(2) : "—"}
            </span>
          </div>
          <div class="precio">
            <span class="precio__etiqueta"><span class="precio__bandera">${BANDERAS.JPY}</span>JPY</span>
            <span class="precio__valor" data-precio-jpy="${curso.id}">
              ${precioJPY !== null ? "¥" + precioJPY.toFixed(0) : "—"}
            </span>
          </div>
        </div>
        <button type="button" class="card__btn-inscripcion">Inscribirse</button>
      </div>
    `;

    grid.appendChild(card);
  });
}

// Convierte el precio fijo en MXN a USD usando el tipo de cambio de venta.
function calcularPrecioUSD(precioMXN) {
  if (!tipoCambioActual || !tipoCambioActual.venta) return null;
  return precioMXN / tipoCambioActual.venta;
}

// Convierte el precio en USD a JPY usando una tasa fija (JPY_POR_USD),
// sin llamar a ningún API.
function calcularPrecioJPY(precioUSD) {
  if (precioUSD === null) return null;
  return precioUSD * JPY_POR_USD;
}

// Actualiza solo los valores en USD y JPY ya pintados, sin volver a construir las tarjetas.
function actualizarPreciosEnPantalla() {
  cursos.forEach((curso) => {
    const precioUSD = calcularPrecioUSD(curso.precioMXN);
    const precioJPY = calcularPrecioJPY(precioUSD);

    const spanUSD = document.querySelector(`[data-precio-usd="${curso.id}"]`);
    if (spanUSD) {
      spanUSD.textContent = precioUSD !== null ? "$" + precioUSD.toFixed(2) : "—";
    }

    const spanJPY = document.querySelector(`[data-precio-jpy="${curso.id}"]`);
    if (spanJPY) {
      spanJPY.textContent = precioJPY !== null ? "¥" + precioJPY.toFixed(0) : "—";
    }
  });
}

// ==========================================================
// Requerimiento funcional 3: al hacer clic en "Actualizar Precios"
// se consulta el API REST obligatorio (dolarapi.com) para obtener
// el tipo de cambio USD/MXN y recalcular el precio en dólares.
// El precio en yenes usa una conversión ya fija (JPY_POR_USD),
// El precio en MXN permanece fijo.
// ==========================================================
async function actualizarTipoCambio() {
  btnActualizar.disabled = true;
  btnActualizar.classList.add("loading");
  estadoTipoCambio.textContent = "Consultando tipo de cambio...";
  estadoTipoCambio.className = "estado-tc";

  try {
    const respuesta = await fetch(API_USD_MXN);

    if (!respuesta.ok) {
      throw new Error(`Error HTTP ${respuesta.status}`);
    }

    const datos = await respuesta.json();
    // Estructura esperada:
    // { fix, compra, venta, nombre, moneda, fechaActualizacion }
    tipoCambioActual = datos;

    actualizarPreciosEnPantalla();

    const fecha = datos.fechaActualizacion
      ? new Date(datos.fechaActualizacion).toLocaleString("es-MX")
      : "desconocida";

    estadoTipoCambio.textContent =
      `Tipo de cambio USD/MXN actualizado — compra: $${datos.compra} | venta: $${datos.venta} | 1 USD ≈ ¥${JPY_POR_USD.toFixed(2)} (última actualización: ${fecha})`;
    estadoTipoCambio.classList.add("ok");
  } catch (error) {
    console.error("No se pudo obtener el tipo de cambio:", error);
    estadoTipoCambio.textContent =
      "No se pudo obtener el tipo de cambio en este momento. Intenta de nuevo más tarde.";
    estadoTipoCambio.classList.add("error");
  } finally {
    btnActualizar.disabled = false;
    btnActualizar.classList.remove("loading");
  }
}

btnActualizar.addEventListener("click", actualizarTipoCambio);

// Construir las tarjetas al cargar la página.
document.addEventListener("DOMContentLoaded", renderCursos);
