from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.database.init_db import init_db
from app.services.similarity_service import _get_model

app = FastAPI(title="Hirely API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    init_db()

    # Load the embedding model once, up front, instead of on the first
    # /screening/analyze request. Without this, whoever submits the
    # first batch of resumes after a server restart pays the full
    # model-load cost inline, which is exactly the "loading forever"
    # experience this is meant to avoid.
    _get_model()


app.include_router(api_router)
