import hash from "./hash.ts";
import { Login } from "./tipos.ts";

export default async function (login: Login) {
  const string = JSON.stringify({
    ...login,
    criacao: Date.now(),
  });
  return (await hash(string));
}
