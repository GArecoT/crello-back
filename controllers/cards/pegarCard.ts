import { Database } from "@db/sqlite";
import consts from "../../composables/consts.json" with { type: "json" };
import { Card, RespostaInterna } from "../../composables/tipos.ts";
import listarCategorias from "./categorias/listarCategorias.ts";

export default function (card: Card): RespostaInterna {
  const db = new Database(`${consts.db}.db`);

  const cards = db.prepare(
    `
      SELECT * FROM cards WHERE id = '${card.id}';
      `,
  ).all();

  if (cards.length > 0) {
    const categorias = listarCategorias(card.id as number);
    if (categorias.status) {
      cards[0].categorias = categorias.data;
    } else {
      cards[0].categorias = [];
    }
    db.close();
    return {
      status: true,
      msg: "Card encontrado!",
      data: cards[0],
    };
  } else {
    db.close();
    return { status: false, msg: "Card não encontrado!", data: {} };
  }
}
