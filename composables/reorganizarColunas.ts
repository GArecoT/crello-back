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
      db.exec(
        `
        UPDATE colunas
        SET ordem = ${index + 1} 
        WHERE id == ${val.id}; 
        `,
      );
    }
  });

  const resColuna = pegarColuna(coluna);
  const colunaOriginal = resColuna.data;
  if (!resColuna.status) {
    db.close();
    //TODO: RECLAMAR ERRO
  }

  if (coluna.ordem && colunaOriginal.ordem < coluna.ordem) {
    db.exec(
      `
      UPDATE colunas
      SET ordem = ordem - 1 
      WHERE id != ${coluna.id} AND ordem > ${colunaOriginal.ordem} AND ordem <= ${coluna.ordem}; 

      `,
    );
  } else {
    db.exec(
      `
      UPDATE colunas
      SET ordem = ordem + 1 
      WHERE id != ${coluna.id} AND ordem < ${colunaOriginal.ordem} AND ordem >= ${coluna.ordem}; 
      `,
    );
  }

  //Inserir coluna
  db.exec(
    `
    UPDATE colunas
    SET nome = '${coluna.nome}', ordem = ${coluna.ordem}
    WHERE id == ${coluna.id}; 
    `,
  );
  //
  db.close();
}
