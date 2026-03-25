import consts from "../../../composables/consts.json" with { type: "json" };
import { Database } from "@db/sqlite";
import { RespostaInterna } from "../../../composables/tipos.ts";
import removeCache from "../../cache/removeCache.ts";

export default function (id_card: number): RespostaInterna {
  if (!id_card || id_card < 1) {
    return {
      status: false,
      msg: "Card inválido",
      data: {},
    };
  }
  const db = new Database(`${consts.db}.db`);
  const usuarios = db.prepare(
    `
    SELECT id_usuario FROM usuarios_cards
    WHERE id_card = ${id_card};
    `,
  ).all();

  let requisicao = "";
  let usuarios_card: any[] = [];

  if (usuarios.length > 0) {
    usuarios.forEach((val, index) => {
      if (index == 0) {
        requisicao = `id = ${val.id_usuario}`;
      } else {
        requisicao = `${requisicao} OR id = ${val.id_usuario}`;
      }
    });

    usuarios_card = db.prepare(
      `
    SELECT id, nome, admin FROM usuarios
    WHERE ${requisicao};
    `,
    ).all();
  }
  db.close();
  removeCache("listarColunas");
  return {
    status: true,
    msg: "Usuarios do cartão encontrados com sucesso",
    data: usuarios_card,
  };
}
