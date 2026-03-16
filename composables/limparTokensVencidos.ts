import { Database } from "@db/sqlite";
import consts from "./consts.json" with { type: "json" };

export default function () {
  console.log("a");
  const db = new Database(`${consts.db}.db`);

  db.exec(
    `
  	DELETE FROM tokens WHERE expirar < ${Date.now()};
    `,
  );
}
