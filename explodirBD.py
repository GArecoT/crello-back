import requests

for coluna in range (9, 13):
    for x in range(1,1000):
        res = requests.post('http://192.168.15.18:8000/card', headers = {
            "Host": "localhost:8000",
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:148.0) Gecko/20100101 Firefox/148.0",
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
            "Accept-Encoding": "gzip, deflate, br, zstd",
            "Content-Type": "application/json",
            "Authorization": "Bearer 19727a0888404a56516c294102fd945c0ea73b77ade4e9e69da6754ac3d2b01c",
            "Content-Length": "26",
            "Origin": "http://localhost:9001",
            "Connection": "keep-alive",
            "Referer": "http://localhost:9001/",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",

        }, json = {
        "nome": "Card teste auto" + str(x),
        "id_coluna": str(coluna)
        })
        print(res)
