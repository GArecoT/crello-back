import { Database } from "@db/sqlite";
import { Card, RespostaInterna } from "../../composables/tipos.ts";
import consts from "../../composables/consts.json" with { type: "json" };
import removeCache from "../cache/removeCache.ts";

export default function (
  card: Card,
  id = 0,
): RespostaInterna {
  let resposta: RespostaInterna = {
    status: false,
    msg: "",
    data: {},
  };
  const chaves: (keyof Card)[] = ["nome", "id_coluna"];
  const resCampos = chaves.every((chave) => {
    if (
      card[chave] === null || card[chave] === undefined ||
      typeof card[chave] != "string" ||
      card[chave]?.length === 0
    ) {
      resposta = {
        status: false,
        msg: `Campo ${chave} inválido ou vazio`,
        data: {},
      };
      return false;
    } else return true;
  });

  if (resCampos === false) {
    return resposta;
  }

  const db = new Database(`${consts.db}.db`);

  const colunas = db.prepare(
    `
    SELECT id from colunas WHERE id = ${card.id_coluna};
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
    if (id > 0) {
      db.prepare(
        `
        UPDATE cards
        SET nome = :nome, id_coluna = :id_coluna,  descricao = :descricao
        WHERE id = :id 
        `,
      ).run({
        nome: card.nome,
        id_coluna: card.id_coluna,
        descricao: card.descricao || "",
        id: id,
      });
    } //se não criar novo
    else {
      db.prepare(
        `
        INSERT INTO cards (nome, id_coluna, descricao) 
        Values (:nome,:id_coluna,:descricao);     
        `,
      ).run({
        nome: card.nome,
        id_coluna: card.id_coluna,
        descricao: card.descricao,
      });
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
