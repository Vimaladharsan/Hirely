from pydantic import BaseModel


class JobBase(BaseModel):
    title: str
    company: str | None = None
    description: str


class JobResponse(JobBase):
    id: int

    class Config:
        from_attributes = True
