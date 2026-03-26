import { Database } from "@db/sqlite";
import consts from "./consts.json" with { type: "json" };
import { Coluna } from "./tipos.ts";
import pegarColuna from "../controllers/coluna/pegarColuna.ts";

export default function (coluna: Coluna) {
  const db = new Database(`${consts.db}.db`);
  const colunas = db.prepare(
    `
    SELECT * FROM colunas  
    ORDER BY ordem;
    `,
  ).all();

  colunas.forEach((val, index) => {
    if (val.ordem != index + 1) {
      db.prepare(
        `
        UPDATE colunas
        SET ordem = :ordem
        WHERE id == :id; 
        `,
      ).run({ ordem: index + 1, id: val.id });
    }
  });

  const resColuna = pegarColuna(coluna);
  const colunaOriginal = resColuna.data;
  if (!resColuna.status) {
    db.close();
    //TODO: RECLAMAR ERRO
  }

  if (coluna.ordem && colunaOriginal.ordem < coluna.ordem) {
    db.prepare(
      `
      UPDATE colunas
      SET ordem = ordem - 1 
      WHERE id != :id AND ordem > :ordemOriginal AND ordem <= :novaOrdem; 

      `,
    ).run({
      id: coluna.id,
      ordemOriginal: colunaOriginal.ordem,
      novaOrdem: coluna.ordem,
    });
  } else {
    db.prepare(
      `
      UPDATE colunas
      SET ordem = ordem + 1 
      WHERE id != :id AND ordem < :ordemOriginal AND ordem >= :novaOrdem; 
      `,
    ).run({
      id: coluna.id,
      ordemOriginal: colunaOriginal.ordem,
      novaOrdem: coluna.ordem,
    });
  }

  //Inserir coluna
  db.prepare(
    `
    UPDATE colunas
    SET nome = :nome, ordem = :ordem
    WHERE id == :id; 
    `,
  ).run({ nome: coluna.nome, ordem: coluna.ordem, id: coluna.id });
  //
  db.close();
}
