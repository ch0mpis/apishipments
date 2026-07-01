from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, ConfigDict

from .models import EstadoEnvio


class ShipmentCreate(BaseModel):
    origen: str
    destino: str
    remitente: str
    destinatario: str
    peso_kg: float = Field(..., gt=0)
    descripcion: Optional[str] = None


class ShipmentUpdate(BaseModel):
    origen: Optional[str] = None
    destino: Optional[str] = None
    remitente: Optional[str] = None
    destinatario: Optional[str] = None
    peso_kg: Optional[float] = None
    descripcion: Optional[str] = None
    estado: Optional[EstadoEnvio] = None


class ShipmentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    origen: str
    destino: str
    remitente: str
    destinatario: str
    peso_kg: float
    descripcion: Optional[str]
    estado: EstadoEnvio
    fecha_creacion: datetime
    fecha_actualizacion: datetime