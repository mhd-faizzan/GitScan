from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.profile import router

app = FastAPI(title="GitScan API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_methods=["GET"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/health")
async def health():
    return {"status": "ok"}