import { Database } from "@db/sqlite";
import { RespostaInterna } from "../../composables/tipos.ts";
import consts from "../../composables/consts.json" with { type: "json" };
import removeCache from "../cache/removeCache.ts";

export default function (
  id_card: number,
  id_coluna: number,
): RespostaInterna {
  if (
    id_card === null || id_coluna === null || id_card === undefined ||
    id_coluna === undefined
  ) {
    return { status: false, msg: "Id coluna ou id card vazio", data: {} };
  }

  const db = new Database(`${consts.db}.db`);

  const colunas = db.prepare(
    `
    SELECT id from colunas WHERE id = ${id_coluna};
    `,
  ).all();
  if (colunas.length < 1) {
    db.close();
    return {
      status: false,
      msg: "Id coluna inválido",
      data: {},
    };
  }

  try {
    //se Card já existe
    if (id_card > 0) {
      db.exec(
        `
        UPDATE cards
        SET id_coluna = ${id_coluna}
        WHERE id = ${id_card}; 
        `,
      );
    } //se não criar novo
    else {
      db.close();
      return {
        status: false,
        msg: "Id card inválido",
        data: {},
      };
    }
    db.close();
    removeCache("listarColunas");
    return {
      status: true,
      msg: "Card salvo com sucesso!",
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
}
