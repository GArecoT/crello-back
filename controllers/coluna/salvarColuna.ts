import { Database } from "@db/sqlite";
import { Coluna, RespostaInterna } from "../../composables/tipos.ts";
import consts from "../../composables/consts.json" with { type: "json" };
import pegarColuna from "./pegarColuna.ts";
import listarColunas from "./listarColunas.ts";

export default function (
  coluna: Coluna,
  id = 0,
): RespostaInterna {
  let resposta: RespostaInterna = {
    status: false,
    msg: "",
    data: {},
  };
  const chaves: (keyof Coluna)[] = ["nome"];
  const resCampos = chaves.every((chave) => {
    if (
      coluna[chave] === null || coluna[chave] === undefined ||
      typeof coluna[chave] != "string" ||
      coluna[chave]?.length === 0
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

  const resColuna = pegarColuna({ id: id });
  // Verificar se nome já foi usado
  const resColunaNome = pegarColuna(coluna, "nome");
  if (resColunaNome.status && resColunaNome.data.id != resColuna.data.id) {
    return {
      status: false,
      msg: `Coluna com esse nome já cadastrada!`,
      data: {},
    };
  }

  const db = new Database(`${consts.db}.db`);

  const resColunas = listarColunas();

  if (!resColunas.status) {
    return {
      status: false,
      msg: `Erro ao adicionar coluna`,
      data: {},
    };
  }
  try {
    //se coluna já existe
    if (id > 0) {
      db.exec(
        `
        UPDATE colunas
        SET nome = '${coluna.nome}', ordem = '${
          coluna.ordem || resColuna.data.ordem
        }'
        WHERE id = ${id}; 
        `,
      );
      // reorganizar colunas se mudar a ordem
      if (
        coluna.ordem && coluna.ordem > 0 && resColuna.data.ordem != coluna.ordem
      ) {
        if (coluna.ordem && coluna.ordem > 1) {
          db.exec(
            `
            UPDATE colunas
            SET ordem = ordem + 1 
            WHERE ordem > ${coluna.ordem}; 
            
            UPDATE colunas
            SET ordem = ordem - 1 
            WHERE ordem = ${coluna.ordem} AND id != ${resColuna.data.id}; 
            `,
          );
        } else {
          console.log(resColuna);
          console.log(`
            UPDATE colunas
            SET ordem = ordem + 1 
            WHERE ordem >= ${
            coluna.ordem || resColuna.data.ordem
          } AND id != ${resColuna.data.id}; 
            `);
          db.exec(
            `
            UPDATE colunas
            SET ordem = ordem + 1 
            WHERE ordem >= ${
              coluna.ordem || resColuna.data.ordem
            } AND id != ${resColuna.data.id}; 
            `,
          );
        }
      }
    } //se não criar novo
    else {
      db.exec(
        `
        INSERT INTO colunas (nome, ordem) Values ('${coluna.nome}',${
          resColunas.data.length + 1
        });     
        `,
      );
    }
    db.close();
    return {
      status: true,
      msg: "Coluna salva com sucesso!",
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
