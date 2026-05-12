from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.profile import router as profile_router
from app.routers.compare import router as compare_router

app = FastAPI(title="GitScan API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

app.include_router(profile_router)
app.include_router(compare_router)


@app.get("/health")
async def health():
    return {"status": "ok"}