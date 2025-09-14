from fastapi import FastAPI

# cria o app
app = FastAPI()

# rota raiz
@app.get("/")
def read_root():
    return {"message": "Olá, FastAPI está rodando!"}

# rota com parâmetro
@app.get("/saudacao/{nome}")
def read_item(nome: str):
    return {"mensagem": f"Olá, {nome}!"}
