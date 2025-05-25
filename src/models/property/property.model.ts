import { IPropertyDocument } from "@interfaces/property.interface";

export interface IPropertyTypeStrategy {
  isMultiUnit(propertyType: string, totalUnits: number): boolean;
  getMinUnits(propertyType: string): number;
  getDefaultUnits(propertyType: string): number;
  shouldValidateBedBath(propertyType: string, totalUnits: number): boolean;
}

class DefaultPropertyTypeStrategy implements IPropertyTypeStrategy {
  private readonly multiUnitTypes = new Set([
    "apartment",
    "condominium",
    "commercial",
    "industrial",
    "estate",
    "mixed-use",
  ]);

  isMultiUnit(propertyType: string, totalUnits: number): boolean {
    return this.multiUnitTypes.has(propertyType) || totalUnits > 1;
  }

  getMinUnits(propertyType: string): number {
    const minUnitsMap: Record<string, number> = {
      apartment: 2,
      condominium: 4,
      commercial: 4,
      estate: 2,
      mixed: 2,
      house: 1,
      townhouse: 1,
      industrial: 1,
    };
    return minUnitsMap[propertyType] ?? 1;
  }

  getDefaultUnits(propertyType: string): number {
    const defaultUnitsMap: Record<string, number> = {
      apartment: 4,
      condominium: 4,
      commercial: 4,
      estate: 10,
      mixed: 6,
      house: 1,
      townhouse: 1,
      industrial: 1,
    };
    return defaultUnitsMap[propertyType] ?? 1;
  }

  shouldValidateBedBath(propertyType: string, totalUnits: number): boolean {
    const singleFamilyTypes = new Set(["house", "townhouse"]);
    return singleFamilyTypes.has(propertyType) && totalUnits === 1;
  }
}

export class PropertyModel {
  readonly #data: IPropertyDocument;
  readonly #typeStrategy: IPropertyTypeStrategy;

  constructor(
    propertyData: IPropertyDocument,
    typeStrategy?: IPropertyTypeStrategy
  ) {
    this.#data = propertyData;
    this.#typeStrategy = typeStrategy || new DefaultPropertyTypeStrategy();

    return new Proxy(this, {
      get: (target, prop) => {
        if (prop in target) {
          return target[prop as keyof typeof target];
        }
        return this.#data[prop as keyof IPropertyDocument];
      },
    });
  }

  isVacant(): boolean {
    return this.#data.occupancyStatus === "vacant";
  }

  isOccupied(): boolean {
    return this.#data.occupancyStatus === "occupied";
  }

  isUnderMaintenance(): boolean {
    return this.#data.occupancyStatus === "maintenance";
  }

  isMultiUnit(): boolean {
    return this.#typeStrategy.isMultiUnit(
      this.#data.propertyType,
      this.#data.totalUnits
    );
  }

  isSingleFamily(): boolean {
    return !this.isMultiUnit();
  }

  getMinUnits(): number {
    return this.#typeStrategy.getMinUnits(this.#data.propertyType);
  }

  getDefaultUnits(): number {
    return this.#typeStrategy.getDefaultUnits(this.#data.propertyType);
  }

  shouldValidateBedBath(): boolean {
    return this.#typeStrategy.shouldValidateBedBath(
      this.#data.propertyType,
      this.#data.totalUnits
    );
  }

  isValidUnitCount(): boolean {
    return this.#data.totalUnits >= this.getMinUnits();
  }

  hasFinancialInfo(): boolean {
    return !!(
      this.#data.financialDetails?.purchasePrice ||
      this.#data.financialDetails?.marketValue ||
      this.#data.fees?.rentalAmount
    );
  }

  hasAddress(): boolean {
    return !!(this.#data.address?.fullAddress || this.#data.address?.street);
  }

  isCommercialType(): boolean {
    return ["commercial", "industrial", "mixed-use"].includes(
      this.#data.propertyType
    );
  }

  isResidentialType(): boolean {
    return [
      "house",
      "apartment",
      "condominium",
      "townhouse",
      "estate",
    ].includes(this.#data.propertyType);
  }

  isMixedUseType(): boolean {
    return this.#data.propertyType === "mixed";
  }

  getMonthlyRental(): number {
    return parseFloat(this.#data.fees?.rentalAmount || "0");
  }

  getSecurityDeposit(): number {
    return parseFloat(this.#data.fees?.securityDeposit || "0");
  }

  getTotalValue(): number {
    return (
      this.#data.financialDetails?.marketValue ||
      this.#data.financialDetails?.purchasePrice ||
      0
    );
  }

  getPropertyAge(): number | null {
    if (!this.#data.yearBuilt) return null;
    return new Date().getFullYear() - this.#data.yearBuilt;
  }

  hasAmenity(amenityCategory: string, amenityName: string): boolean {
    const amenities = this.#data[
      amenityCategory as keyof IPropertyDocument
    ] as any;
    return amenities?.[amenityName] === true;
  }

  getTotalBedrooms(): number {
    return this.#data.specifications?.bedrooms || 0;
  }

  getTotalBathrooms(): number {
    return this.#data.specifications?.bathrooms || 0;
  }

  getTotalArea(): number {
    return this.#data.specifications?.totalArea || 0;
  }

  getRawData(): IPropertyDocument {
    return { ...this.#data };
  }

  toJSON(): IPropertyDocument {
    return this.getRawData();
  }

  static create(data: IPropertyDocument): PropertyModel {
    return new PropertyModel(data);
  }

  static createWithStrategy(
    data: IPropertyDocument,
    strategy: IPropertyTypeStrategy
  ): PropertyModel {
    return new PropertyModel(data, strategy);
  }
}

export function postTransformPropertyData(
  data: IPropertyDocument,
  strategy?: IPropertyTypeStrategy
): PropertyModel {
  return new PropertyModel(data, strategy);
}

export function postTransformPropertiesData(
  data: IPropertyDocument[],
  strategy?: IPropertyTypeStrategy
): PropertyModel[] {
  return data.map((item) => new PropertyModel(item, strategy));
}

export { DefaultPropertyTypeStrategy };
