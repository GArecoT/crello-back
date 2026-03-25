import { Database } from "@db/sqlite";
import { Cache, RespostaInterna } from "../../composables/tipos.ts";
import consts from "../../composables/consts.json" with { type: "json" };

export default function (
  cache: Cache,
): RespostaInterna {
  let resposta: RespostaInterna = {
    status: false,
    msg: "",
    data: {},
  };
  const chaves: (keyof Cache)[] = ["servico"];
  const resCampos = chaves.every((chave) => {
    if (
      cache[chave] === null || cache[chave] === undefined ||
      typeof cache[chave] != "string" ||
      cache[chave]?.length === 0
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

  const listaCache = db.prepare(
    `
    SELECT * from cache WHERE servico = '${cache.servico}';
    `,
  ).all();

  try {
    //se categoria já existe
    if (listaCache.length > 0) {
      db.exec(
        `
        UPDATE cache
        SET json = '${
          JSON.stringify(cache.json)
        }', timestamp = CURRENT_TIMESTAMP, expirado = 0
        WHERE servico = '${cache.servico}'; 
        `,
      );
    } //se não criar novo
    else {
      db.exec(
        `
        INSERT INTO cache (servico, json) 
        Values ('${cache.servico}', '${JSON.stringify(cache.json)}');        
        `,
      );
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
