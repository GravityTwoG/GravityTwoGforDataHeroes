"use strict";
import fs from "fs";
import pg from "pg";

import { loadCharactersToDB } from "./characters.js";

async function bootstrap() {
  const DATABASE_URL = process.env.DATABASE_URL;
  const CERTIFICATE_PATH = process.env.CERTIFICATE_PATH;

  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  if (!CERTIFICATE_PATH) {
    throw new Error("CERTIFICATE_PATH environment variable is not set");
  }

  const config = {
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: true,
      ca: fs.readFileSync(CERTIFICATE_PATH).toString(),
    },
  };

  const conn = new pg.Client(config);
  await conn.connect();

  console.log("Connected to database");

  await migrate(conn);

  console.log("Migrated schema");

  const rows = await loadCharactersToDB(conn);
  console.log(`Characters added: ${rows}`);

  const data = await conn.query(`SELECT COUNT(*) FROM "GravityTwoG"`);
  console.log(`Table GravityTwoG contains: ${data.rows[0].count} characters`);

  conn.end();
}

bootstrap();

function migrate(conn) {
  return conn.query(
    `
    CREATE TABLE IF NOT EXISTS "GravityTwoG"(
      id serial PRIMARY KEY NOT NULL,
      name text NOT NULL,
      data jsonb NOT NULL
    );
    `,
  );
}
