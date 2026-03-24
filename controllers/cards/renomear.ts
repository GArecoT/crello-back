import { Database } from "@db/sqlite";
import { RespostaInterna } from "../../composables/tipos.ts";
import consts from "../../composables/consts.json" with { type: "json" };

export default function (
  id_card: number,
  nome: string,
): RespostaInterna {
  if (
    id_card === null || nome === null || id_card === undefined ||
    nome.length < 1
  ) {
    return { status: false, msg: "Id coluna ou nome card vazio", data: {} };
  }

  const db = new Database(`${consts.db}.db`);

  try {
    //se Card já existe
    if (id_card > 0) {
      db.exec(
        `
        UPDATE cards
        SET nome = '${nome}'
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
