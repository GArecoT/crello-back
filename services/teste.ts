export default function teste() {
  const body = JSON.stringify({ message: "Testado com sucesso!" });
  return new Response(body, {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });
}
