import { Database } from "@db/sqlite";
import consts from "../../composables/consts.json" with { type: "json" };

export default function (id: number = 0) {
  if (id > 0) {
    const db = new Database(`${consts.db}.db`);
    try {
      db.exec(
        `
        DELETE FROM usuarios
        WHERE id = ${id}; 
        `,
      );
      db.close();
      return {
        status: false,
        msg: "Usuário deletado com sucesso!",
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
