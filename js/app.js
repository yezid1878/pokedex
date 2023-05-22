const d = document;

const $pokemonList = d.getElementById("list_pokemon"),
  $template = d.getElementById("template").content,
  $fragment = d.createDocumentFragment(),
  $input = d.getElementById("input"),
  $color1 = d.querySelector(".template__type1"),
  $color2 = d.querySelector(".template__type2");

let pokeApi = "https://pokeapi.co/api/v2/pokemon?limit=151";

// funcion asincrona que va a permitir cargar los pokemon de la API

const loadPokemon = async (url) => {
  // manejo de errores

  // primer try catch
  try {
    $pokemonList.innerHTML = `<img src="./assets/Spinner-3.gif" alt="cargando..." class="loader" >`;

    let res = await fetch(url),
      json = await res.json();

    // console.log(json);

    if (!res.ok) throw { status: res.status, statusText: res.statusText };

    for (let i = 0; i < json.results.length; i++) {
      // console.log(json.results[i]);

      // try catch dentro del for
      try {
        let res = await fetch(json.results[i].url),
          pokemon = await res.json();

        // console.log(pokemon);

        if (!res.ok) throw { status: res.status, statusText: res.statusText };

        // colocamos lo dastos del pokemon por cada template
        $template.querySelector(".template__name").textContent = pokemon.name;
        $template.querySelector(".template__img").src =
          pokemon.sprites.front_default;
        $template.querySelector(
          ".template__number"
        ).textContent = `N° ${pokemon.id.toString().padStart(4, 0)}`;
        $template.querySelector(".template__type1").textContent =
          pokemon.types[0].type.name;
        $template.querySelector(".template__type2").textContent = pokemon
          .types[1]
          ? pokemon.types[1].type.name
          : "";
        let $clone = d.importNode($template, true);

        $fragment.appendChild($clone);
      } catch (err) {
        let message = err.statusText || "Ocurrio un error";
        $pokemonList.innerHTML = `Error ${err.status}: ${message}`;
      }
    }

    $pokemonList.innerHTML = "";
    $pokemonList.appendChild($fragment);
  } catch (err) {
    // creando una variable con el mensaje del error

    let message = err.statusText || "Ocurrio un error";
    $pokemonList.innerHTML = `Error ${err.status}: ${message}`;
  }
};

d.addEventListener("DOMContentLoaded", (e) => {
  loadPokemon(pokeApi);
  search();
});

const search = () => {
  d.addEventListener("keyup", (e) => {
    if (e.target === $input) {
      if (e.key === "Escape") e.target.value = "";

      d.querySelectorAll(".template__container").forEach((el) =>
        el.textContent.toLocaleLowerCase().includes(e.target.value)
          ? el.classList.remove("filter")
          : el.classList.add("filter")
      );
    }
  });
};
