function pageLayout({ title, content }) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <title>${title}</title>
    
    <link rel="stylesheet" href="/css/style.css" />
  </head>
  <body>
    <header>
      <h1><a href="/">Pokedex!</a></h1>
    </header>

      ${content}
  
    </body>
  </html>
  `;
}

function frontPage() {
  return `
  <section>
    <form action="/search" method="GET">
      <fieldset>
        <label for="query">Busca tu pokemon</label>
        <input type="search" name="query" id="query" /> 
      </fieldset>
      <button>Buscar</button>
    </form>
  </section>
  `;
}

function searchResults({ results }) {
  const htmlResults = results.map((result) => {
    const { english, japanese } = result.name;

    return `<li>
              <img src="/sprites${imagePath({
                id: result.id,
                suffix: "MS",
              })}" alt="${english} / ${japanese} icon" />
              <a href="/pokemon/${result.id}">
                ${english} / ${japanese}
              </a>
              (${result.type.join(", ")})
            </li>`;
  });

  return `
  <section>
   <ul>
    ${htmlResults.join("")}
   </ul>
  </section>
  `;
}

function pokemonCard({ pokemon }) {
  const { id, name, type, base } = pokemon;
  return `
    <article>
      <header>
        <h1>${name.english} / ${name.japanese}</h1>
        <p>${type.join(", ")}</p>
      </header>
      <section>
        <figure>
          <img src="/images/${imagePath({ id })}" alt="${name.english} / ${
    name.japanese
  }" />
          <figcaption>${name.english} / ${name.japanese}</figcaption>
        </figure>
      </section>

      <dl>
        <dt>HP</dt>
        <dd>${base.HP}</dd>
        <dt>Attack</dt>
        <dd>${base.Attack}</dd>
        <dt>Defense</dt>
        <dd>${base.Defense}</dd>
        <dt>Sp. Attack</dt>
        <dd>${base["Sp. Attack"]}</dd>
        <dt>Sp. Defense</dt>
        <dd>${base["Sp. Defense"]}</dd>
        <dt>Speed</dt>
        <dd>${base.Speed}</dd>
      </dl>
      
    </article>
  `;
}

function errorPage({ message }) {
  return `
    <section class="error">
      <p>${message}</p>
      <a href="/">Volver a la portada</a>
    </section>
  `;
}

function imagePath({ id, suffix = "", extension = "png" }) {
  let imageName;

  if (id < 10) {
    imageName = `00${id}`;
  } else if (id < 100) {
    imageName = `0${id}`;
  } else {
    imageName = id;
  }
  return `/${imageName}${suffix}.${extension}`;
}

module.exports = {
  pageLayout,
  frontPage,
  errorPage,
  searchResults,
  pokemonCard,
};
