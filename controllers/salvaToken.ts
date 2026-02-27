import { Database } from "@db/sqlite";
import consts from "../composables/consts.json" with { type: "json" };
import hash from "../composables/hash.ts";

export default async function (token: string, expirar: number | null = null) {
  const db = new Database(`${consts.db}.db`);

  const hashToken = await hash(token);

  db.exec(
    `
    INSERT INTO tokens (token, expirar) Values ('${hashToken}', '${expirar}')
      `,
  );

  db.close();
}
