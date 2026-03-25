import { Database } from "@db/sqlite";
import consts from "../../composables/consts.json" with { type: "json" };
import removeCache from "../cache/removeCache.ts";

export default function (id: number = 0) {
  if (id > 0) {
    const db = new Database(`${consts.db}.db`);
    try {
      db.exec(
        `
        DELETE FROM cards
        WHERE id = ${id}; 
        `,
      );
      db.close();
      removeCache("listarColunas");
      return {
        status: true,
        msg: "Card deletado com sucesso!",
        data: {},
      };
    } catch (e) {
      db.close();
      return {
        status: false,
        msg: JSON.stringify(e, Object.getOwnPropertyNames(e)),
        data: {},
      };
    }
  } else {
    return {
      status: false,
      msg: "Id inválido",
      data: {},
    };
  }
}
