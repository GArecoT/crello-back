export type Login = { login: string; senha: string };

export type RespostaInterna = {
  status: boolean;
  msg: string;
  data: {
    id?: number | undefined;
    nome?: string | undefined;
    admin?: boolean | number;
    [key: string]: any;
    [key: number]: any;
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

export type Coluna = {
  id?: number;
  nome?: string;
  ordem?: number;
  cards?: object;
};

export type Card = {
  id?: number;
  id_coluna?: number;
  nome?: string;
  descricao?: string;
  categorias?: object;
  midias?: object;
  historico?: object;
};

export type Categoria = {
  nome?: string;
  cor?: string;
};
