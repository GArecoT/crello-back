import consts from "../../composables/consts.json" with { type: "json" };
import { Database } from "@db/sqlite";
import { RespostaInterna } from "../../composables/tipos.ts";

export default function (servico: string): RespostaInterna {
  if (!servico || servico.length < 1) {
    return {
      status: true,
      msg: "Servico inválido",
      data: {},
    };
  }
  const db = new Database(`${consts.db}.db`);
  const cache = db.prepare(
    `
    SELECT * FROM cache
    WHERE servico = '${servico}';
    `,
  ).all();

  const retorno = cache[0];

  if (cache.length > 0) {
    try {
      retorno.json = JSON.parse(retorno.json);
    } catch (e) {
      return {
        status: false,
        msg: JSON.stringify(e, Object.getOwnPropertyNames(e)),
        data: {},
      };
    }
  } else {
    return {
      status: false,
      msg: "Não encontrado",
      data: {},
    };
  }

  db.close();
  return {
    status: true,
    msg: "Caches encontrados com sucesso",
    data: retorno,
  };
}
