import consts from "../../composables/consts.json" with { type: "json" };
import { Database } from "@db/sqlite";
import { RespostaInterna } from "../../composables/tipos.ts";
// import listarCategorias from "../cards/categorias/listarCategorias.ts";
// import listarUsuarios from "../cards/usuarios/listarUsuarios.ts";
import salvaCache from "../cache/salvaCache.ts";
import listaCache from "../cache/listaCache.ts";
// import pegarColuna from "./pegarColuna.ts";

export default function (): RespostaInterna {
  const resCache = listaCache("listarColunas");
  if (resCache.status) {
    return {
      status: true,
      msg: "Colunas listadas com sucesso!",
      data: resCache.data.json,
    };
  }
  const db = new Database(`${consts.db}.db`);
  const colunas = db.prepare(
    `
      SELECT * FROM colunas
      ORDER BY ordem;
      `,
  ).all();

  // colunas.forEach((val, index) => {
  //   console.log(pegarColuna(colunas[index]));
  //   colunas[index].cards = pegarColuna(colunas[index]).data.cards;
  //   colunas[index].cards.forEach((val2: any, index2: number) => {
  //     const categorias = listarCategorias(val2.id);
  //     const usuarios = listarUsuarios(val2.id);
  //     if (categorias.status) {
  //       colunas[index].cards[index2].categorias = categorias.data;
  //     } else {
  //       colunas[index].cards[index2].categorias = [];
  //     }
  //     if (usuarios.status) {
  //       colunas[index].cards[index2].usuarios = usuarios.data;
  //     } else {
  //       colunas[index].cards[index2].usuarios = [];
  //     }
  //   });
  // });
  db.close();
  salvaCache({ servico: "listarColunas", json: colunas });
  return {
    status: true,
    msg: "Colunas listadas com sucesso!",
    data: colunas,
  };
}
