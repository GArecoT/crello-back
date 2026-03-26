import { Database } from "@db/sqlite";
import { Categoria, RespostaInterna } from "../../composables/tipos.ts";
import consts from "../../composables/consts.json" with { type: "json" };

export default function (
  categoria: Categoria,
): RespostaInterna {
  let resposta: RespostaInterna = {
    status: false,
    msg: "",
    data: {},
  };
  const chaves: (keyof Categoria)[] = ["nome", "cor"];
  const resCampos = chaves.every((chave) => {
    if (
      categoria[chave] === null || categoria[chave] === undefined ||
      typeof categoria[chave] != "string" ||
      categoria[chave]?.length === 0
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

  const categorias = db.prepare(
    `
    SELECT * from categorias WHERE nome = '${categoria.nome}';
    `,
  ).all();

  try {
    //se categoria já existe
    if (categorias.length > 0) {
      db.prepare(
        `
        UPDATE categorias
        SET nome = :nome, cor = :cor
        WHERE nome = :nome; 
        `,
      ).run({ nome: categoria.nome, cor: categoria.cor });
    } //se não criar novo
    else {
      db.prepare(
        `
        INSERT INTO categorias (nome, cor) 
        Values (:nome, :cor);        
        `,
      ).run({ nome: categoria.nome, cor: categoria.cor });
    }
    db.close();
    return {
      status: true,
      msg: "Categoria salva com sucesso!",
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
