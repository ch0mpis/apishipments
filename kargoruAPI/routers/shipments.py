from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/shipments", tags=["Shipments"])


@router.post("", response_model=schemas.ShipmentOut, status_code=status.HTTP_201_CREATED)
def create_shipment(data: schemas.ShipmentCreate, db: Session = Depends(get_db)):
    shipment = models.Shipment(**data.model_dump())
    db.add(shipment)
    db.commit()
    db.refresh(shipment)
    return shipment


@router.get("", response_model=list[schemas.ShipmentOut])
def list_shipments(db: Session = Depends(get_db)):
    return db.query(models.Shipment).all()


@router.get("/{shipment_id}", response_model=schemas.ShipmentOut)
def get_shipment(shipment_id: str, db: Session = Depends(get_db)):
    shipment = db.query(models.Shipment).filter(models.Shipment.id == shipment_id).first()
    if not shipment:
        raise HTTPException(status_code=404, detail="Envío no encontrado")
    return shipment


@router.patch("/{shipment_id}", response_model=schemas.ShipmentOut)
def update_shipment(shipment_id: str, data: schemas.ShipmentUpdate, db: Session = Depends(get_db)):
    shipment = db.query(models.Shipment).filter(models.Shipment.id == shipment_id).first()
    if not shipment:
        raise HTTPException(status_code=404, detail="Envío no encontrado")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(shipment, field, value)

    db.commit()
    db.refresh(shipment)
    return shipment


@router.delete("/{shipment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_shipment(shipment_id: str, db: Session = Depends(get_db)):
    shipment = db.query(models.Shipment).filter(models.Shipment.id == shipment_id).first()
    if not shipment:
        raise HTTPException(status_code=404, detail="Envío no encontrado")

    db.delete(shipment)
    db.commit()
    return None