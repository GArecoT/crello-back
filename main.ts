import consts from "./composables/consts.json" with { type: "json" };
import manutencaoDB from "./controllers/manutencaoDB.ts";

await manutencaoDB();
const regexQuery = /\/\d+/gi;
Deno.serve({ port: consts.port }, async (req) => {
  try {
    const url = new URL(req.url);
    const queryArray = url.pathname.match(regexQuery);
    let query = null;

    if (
      queryArray && queryArray.length > 0 && typeof queryArray[0] === "string"
    ) {
      query = queryArray[0].replace("/", "");
    }

    url.pathname = url.pathname.replace(regexQuery, "");
    const servico = await import(`./services${url.pathname}.ts`);

    if (req.method == "GET") {
      return servico.default(req.method, req.headers, {}, query);
    } else {
      try {
        const body = await req.json();

        return servico.default(req.method, req.headers, body, query);
      } catch {
        return servico.default(req.method, req.headers, {}, query);
      }
    }
  } catch (e) {
    console.log(e);
    const body = JSON.stringify({ message: "SERVICE NOT FOUND" });
    return new Response(body, {
      status: 404,
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });
  }
});
