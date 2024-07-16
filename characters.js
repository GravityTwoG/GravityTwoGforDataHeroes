"use strict";

export async function loadCharactersToDB(conn) {
  const charactersData = await fetchCharacters(1);
  const characters = charactersData.results;

  const q = await addCharactersToDB(conn, characters);

  let charactersAddded = q.rowCount;

  for (let page = 2; page <= charactersData.info.pages; page++) {
    const charactersData = await fetchCharacters(page);
    const characters = charactersData.results;

    const q = await addCharactersToDB(conn, characters);
    charactersAddded += q.rowCount;
  }

  return charactersAddded;
}

async function fetchCharacters(page) {
  const response = await fetch(
    `https://rickandmortyapi.com/api/character?page=${page}`,
    {
      method: "GET",
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  return data;
}

async function addCharactersToDB(conn, characters) {
  return conn.query(
    `
      INSERT INTO "GravityTwoG" (name, data)
        SELECT name, data FROM UNNEST ($1::text[], $2::jsonb[]) AS t(name, data);
    `,
    [characters.map((character) => character.name), characters],
  );
}
