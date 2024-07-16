"use strict";

export async function loadCharactersToDB(conn) {
  const charactersData = await fetchCharacters();
  const characters = charactersData.results;

  const q = await addCharactersToDB(conn, characters);

  return q;
}

async function fetchCharacters() {
  const response = await fetch("https://rickandmortyapi.com/api/character", {
    method: "GET",
  });

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
        SELECT name, data FROM UNNEST ($1::text[], $2::jsonb[]) AS t(name, data)
        ON CONFLICT DO NOTHING;
    `,
    [characters.map((character) => character.name), characters],
  );
}
