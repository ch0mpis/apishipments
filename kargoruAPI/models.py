import uuid
import enum

from sqlalchemy import Column, String, Float, DateTime, Enum as SqlEnum
from sqlalchemy.sql import func

from .database import Base


class EstadoEnvio(str, enum.Enum):
    pendiente = "pendiente"
    en_transito = "en_transito"
    entregado = "entregado"
    cancelado = "cancelado"


class Shipment(Base):
    __tablename__ = "shipments"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    origen = Column(String(255), nullable=False)
    destino = Column(String(255), nullable=False)
    remitente = Column(String(255), nullable=False)
    destinatario = Column(String(255), nullable=False)
    peso_kg = Column(Float, nullable=False)
    descripcion = Column(String(500), nullable=True)
    estado = Column(SqlEnum(EstadoEnvio), nullable=False, default=EstadoEnvio.pendiente)

    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now())
    fecha_actualizacion = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())