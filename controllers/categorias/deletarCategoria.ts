import { Database } from "@db/sqlite";
import consts from "../../composables/consts.json" with { type: "json" };

export default function (nome: string = "") {
  if (nome.length > 0) {
    const db = new Database(`${consts.db}.db`);
    try {
      db.exec(
        `
        DELETE FROM categorias
        WHERE nome = '${nome}'; 
        `,
      );
      db.close();
      return {
        status: true,
        msg: "Categoria deletada com sucesso!",
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
      msg: "Nome inválido",
      data: {},
    };
  }
}
