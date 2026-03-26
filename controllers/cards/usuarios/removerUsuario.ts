import { Database } from "@db/sqlite";
import consts from "../../../composables/consts.json" with { type: "json" };
import removeCache from "../../cache/removeCache.ts";

export default function (id_card: number, id_usuario: number) {
  if (!id_card || id_card < 1) {
    return {
      status: false,
      msg: "Cartão não encontrado",
      data: {},
    };
  }

  if (!id_usuario || id_usuario < 1) {
    return {
      status: false,
      msg: "Usuário não encontrado",
      data: {},
    };
  }
  const db = new Database(`${consts.db}.db`);
  try {
    db.prepare(
      `
        DELETE FROM usuarios_cards
        WHERE id_card = :id_card AND id_usuario = id_usuario;
      `,
    ).run({ id_card: id_card, id_usuario: id_usuario });
    db.close();
    removeCache("listarColunas");
    return {
      status: true,
      msg: "Usuário removido com sucesso!",
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
