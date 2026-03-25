import { Database } from "@db/sqlite";
import consts from "../../composables/consts.json" with { type: "json" };
import removeCache from "../cache/removeCache.ts";

export default function (id: number = 0) {
  if (id > 0) {
    const db = new Database(`${consts.db}.db`);
    try {
      db.exec(
        `
        DELETE FROM colunas
        WHERE id = ${id}; 
        `,
      );
      db.close();

      // TODO: DELETAR OS CARDS EMITIDOS PARA ESSA COLUNA

      removeCache("listarColunas");
      return {
        status: true,
        msg: "Coluna deletada com sucesso!",
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
