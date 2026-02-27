import consts from "./composables/consts.json" with { type: "json" };
import manutencaoDB from "./controllers/manutencaoDB.ts";

await manutencaoDB();
Deno.serve({ port: consts.port }, async (req) => {
  try {
    const url = new URL(req.url);
    const servico = await import(`./services${url.pathname}.ts`);

    if (req.method == "GET") {
      return servico.default();
    } else {
      try {
        const body = await req.json();
        return servico.default(body, req.method);
      } catch {
        return servico.default({});
      }
    }
  } catch {
    const body = JSON.stringify({ message: "SERVICE NOT FOUND" });
    return new Response(body, {
      status: 404,
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });
  }
});
