import { Database } from "@db/sqlite";
import { RespostaInterna, Usuario } from "../../composables/tipos.ts";
import validaSenha from "../../composables/validaSenha.ts";
import pegarUsuario from "./pegarUsuario.ts";
import consts from "../../composables/consts.json" with { type: "json" };
import hash from "../../composables/hash.ts";

export async function salvarUsuario(
  usuario: Usuario,
  id = 0,
): Promise<RespostaInterna> {
  let resposta: RespostaInterna = {
    status: false,
    msg: "",
    data: {},
  };
  const chaves: (keyof Usuario)[] = ["nome"];
  const resCampos = chaves.every((chave) => {
    if (
      usuario[chave] === null || usuario[chave] === undefined ||
      typeof usuario[chave] != "string" ||
      usuario[chave]?.length === 0
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
  //Verificar tamanho senha se for um usuário novo, ou se a senha for > 0
  if (
    (id == 0) ||
    (usuario.senha && usuario.senha?.length > 0)
  ) {
    if (!validaSenha(usuario.senha)) {
      return {
        status: false,
        msg:
          `Senha precisa ter 6 caracteres, letra maíuscula, número e caracter especial`,
        data: {},
      };
    }
  }

  // Verificar se nome já foi usado
  if (pegarUsuario(usuario, "nome").status) {
    return {
      status: false,
      msg: `Usuário com esse nome já cadastrado!`,
      data: {},
    };
  }

  const senhaHash = await hash(usuario.senha as string);

  const db = new Database(`${consts.db}.db`);
  try {
    console.log(id);
    //se usuario já existe
    if (id > 0) {
      if (usuario.senha && usuario.senha.length > 0) {
        db.exec(
          `
        UPDATE usuarios
        SET nome = '${usuario.nome}', senha = '${senhaHash}', admin = ${
            usuario.admin ? 1 : 0
          }
        WHERE id = ${id}; 
        `,
        );
      } else {
        db.exec(
          `
        UPDATE usuarios
        SET nome = '${usuario.nome}', admin = ${usuario.admin ? 1 : 0}
        WHERE id = ${id}; 
        `,
        );
      }
      //se não criar novo
    } else {
      db.exec(
        `
        INSERT INTO usuarios (nome,senha, admin) Values ('${usuario.nome}','${senhaHash}', ${
          usuario.admin ? 1 : 0
        });
      `,
      );
    }
    db.close();
    return {
      status: true,
      msg: "Usuario salvo com sucesso!",
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
