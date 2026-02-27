export type Login = { login: string; senha: string };

export type RespostaInterna = { status: boolean; msg: string; data: object };

export type Resposta = {
  info: { msg: string; cdg_erro: number };
  data: object;
};
