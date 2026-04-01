import { Database } from "@db/sqlite";
import consts from "../../composables/consts.json" with { type: "json" };
import { Coluna, RespostaInterna } from "../../composables/tipos.ts";
import listarCategorias from "../cards/categorias/listarCategorias.ts";
import listarUsuarios from "../cards/usuarios/listarUsuarios.ts";

export default function (
  coluna: Coluna,
  campo = "id",
  offset = 0,
): RespostaInterna {
  const db = new Database(`${consts.db}.db`);

  if (campo == "id" || campo == "nome" || campo == "ordem") {
    const colunas = db.prepare(
      `
      SELECT * FROM colunas WHERE ${campo} = '${coluna[campo]}';
      `,
    ).all();

    if (colunas.length > 0) {
      colunas[0].cards = db.prepare(
        `
        SELECT * FROM cards
        WHERE id_coluna = :id LIMIT 100 OFFSET :offset;
        `,
      ).all({ id: colunas[0].id, offset: offset });
      colunas[0].cards.forEach((val: any, index: number) => {
        const categorias = listarCategorias(val.id);
        const usuarios = listarUsuarios(val.id);
        if (categorias.status) {
          colunas[0].cards[index].categorias = categorias.data;
        } else {
          colunas[0].cards[index].categorias = [];
        }
        if (usuarios.status) {
          colunas[0].cards[index].usuarios = usuarios.data;
        } else {
          colunas[0].cards[index].usuarios = [];
        }
      });
      db.close();
      return {
        status: true,
        msg: "Coluna encontrada!",
        data: colunas[0],
      };
    } else {
      db.close();
      return { status: false, msg: "Coluna não encontrada!", data: {} };
    }
  } else {
    db.close();
    return { status: false, msg: "Coluna não encontrada!", data: {} };
  }
}
