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

  res.send(pageLayout({ title: "Portada", content: pageContent }));
});

// --------
// Esta página muestra los resultados de la búsqueda
app.get("/search", (req, res) => {
  const { query } = req.query;
  if (query.length < 2)
    throw new Error("La cadena de búsqueda debe tener más de 1 caracteres");

  const matchedPokemon = pokedex.filter((pokemon) => {
    return pokemon.name.english.toLowerCase().includes(query.toLowerCase());
  });

  if (matchedPokemon.length === 0) {
    const error = new Error("Ningún pokémon encontrado");
    error.code = 404;
    throw error;
  }

  const pageContent = searchResults({ results: matchedPokemon });
  res.send(
    pageLayout({
      title: `Resultados de la búsqueda: ${query}`,
      content: pageContent,
    })
  );
});

// --------
// Está página muestra la ficha del pokemon
app.get("/pokemon/:id", (req, res) => {
  const id = req.params.id;

  const [pokemon] = pokedex.filter((pokemon) => pokemon.id === Number(id));

  if (!pokemon) {
    const error = new Error("Pokémon no encontrado");
    error.code = 404;
    throw error;
  }
});

// --------
// Error middleware, sólo se va a ejecutar si hacemos un throw en las rutas anteriores
app.use((error, req, res, next) => {
  const pageContent = errorPage({ message: error.message });

  res
    .status(error.code || 500)
    .send(
      pageLayout({ title: `Error: ${error.message}`, content: pageContent })
    );
});

// --------
// Not found middleware, sólo llega aquí si la url solicitada no entra en ninguna ruta
app.use((req, res) => {
  const pageContent = errorPage({ message: "Página no encontrada" });

  res
    .status(404)
    .send(
      pageLayout({ title: "Error: Página no encontrada", content: pageContent })
    );
});

app.listen(3000, () => {
  console.log(`Servidor web funcionando en http://localhost:${port}`);
});
