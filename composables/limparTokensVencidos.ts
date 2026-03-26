import { Database } from "@db/sqlite";
import consts from "./consts.json" with { type: "json" };

export default function () {
  const db = new Database(`${consts.db}.db`);

  db.prepare(
    `
  	DELETE FROM tokens WHERE expirar < :expirar;
    `,
  ).run({ expirar: Date.now() });
}
