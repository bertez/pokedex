require("dotenv").config();
const express = require("express");
const path = require("path");

const {
  pageLayout,
  frontPage,
  errorPage,
  searchResults,
} = require("./helpers/html");

const port = process.env.PORT;
const app = express();

const pokedex = require("./pokedex.json");

/*
  Rutas necesarias:

  - / : portada con formulario buscador
  - /search/?query=texto : resultados búsqueda
  - /pokemon/:id : ficha pokemon

  - el formulario de portada debe enviarse con GET 
  - si la búsqueda es de menos de 3 letras debe dar un error
  - las fichas deben mostrar la imagen del pokemon, el nombre en ingles y japones y sus estadísticas
  - todo el HTML se debe generar en backend (ver ./helpers/html.js)
  - debe cargar las imagenes de cada pokemon en la ficha de pokemon que hay en ./static/images
  - las páginas deben cargar el css que hay en ./static/css 
*/

// --------
// Esta página muestra la portada con su formulario
app.get("/", (req, res) => {
  const pageContent = frontPage();

  res.status(200).send(pageLayout("Portada", pageContent));
});

// --------
// Esta página muestra los resultados de la búsqueda
app.get("/search", (req, res) => {
  const { query } = req.query;
  if (query.length < 3)
    throw new Error("La cadena de búsqueda debe tener más de 2 caracteres");

  const pageContent = searchResults();
  res
    .status(200)
    .send(pageLayout(`Resultados de la búsqueda: ${query}`, pageContent));
});

// --------
// Error middleware, sólo se va a ejecutar si hacemos un throw en las rutas anteriores
app.use((error, req, res, next) => {
  const pageContent = errorPage(error.message);

  res.status(500).send(pageLayout(`Error: ${error.message}`, pageContent));
});

// --------
// Not found middleware, sólo llega aquí si la url solicitada no entra en ninguna ruta
app.use((req, res) => {
  const pageContent = errorPage("Página no encontrada");

  res.status(404).send(pageLayout("Error: Página no encontrada", pageContent));
});

app.listen(3000, () => {
  console.log(`Servidor web funcionando en http://localhost:${port}`);
});
