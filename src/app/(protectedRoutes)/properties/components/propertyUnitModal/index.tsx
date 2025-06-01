"use client";
import { usePropertyUnitLogic } from "./hook";
import { PropertyUnitModalView } from "./view";
import { PropertyUnitModalProps } from "./interface";

export function PropertyUnitModal({
  isOpen,
  onClose,
  property,
}: PropertyUnitModalProps) {
  const logicProps = usePropertyUnitLogic({
    property,
    onClose,
  });

  return (
    <PropertyUnitModalView
      isOpen={isOpen}
      onClose={onClose}
      property={property}
      {...logicProps}
    />
  );
}
