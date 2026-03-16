import { Database } from "@db/sqlite";
import { Card, RespostaInterna } from "../../composables/tipos.ts";
import consts from "../../composables/consts.json" with { type: "json" };

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
      db.exec(
        `
        UPDATE cards
        SET nome = '${card.nome}', id_coluna = ${card.id_coluna},  descricao = '${
          card.descricao || ""
        }'
        WHERE id = ${id}; 
        `,
      );
    } //se não criar novo
    else {
      db.exec(
        `
        INSERT INTO cards (nome, id_coluna, descricao) 
        Values ('${card.nome}',${card.id_coluna},'${
          card.descricao || ""
        }');     
        `,
      );
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
