from fastapi import FastAPI, Query
from services.search import search_products

app = FastAPI(title="SoGetkey AI Search Service")

@app.get("/search")
async def search(q: str = Query(..., min_length=1)):
    return await search_products(q)
