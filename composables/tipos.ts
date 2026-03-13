export type Login = { login: string; senha: string };

export type RespostaInterna = {
  status: boolean;
  msg: string;
  data: {
    id?: number | undefined;
    nome?: string | undefined;
    admin?: boolean | number;
    [key: string]: any;
  };
};

export type Resposta = {
  info: { msg: string; cdg_erro: number };
  data: { [key: string]: any } | [] | string;
};

export type Usuario = {
  id?: number;
  nome?: string;
  senha?: string;
  admin?: boolean;
};
