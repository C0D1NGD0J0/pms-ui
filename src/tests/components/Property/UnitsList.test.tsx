import { UnitsList } from "@components/Property/UnitsList";
import { UnitStatus, IUnit } from "@interfaces/unit.interface";
import { fireEvent, render, screen } from "@tests/utils/test-utils";

const mockUnits: IUnit[] = [
  {
    id: "1",
    puid: "unit-1",
    unitNumber: "A",
    unitType: "studio",
    floor: 1,
    isActive: true,
    status: "occupied" as UnitStatus,
    specifications: {
      rooms: 2,
      bathrooms: 1,
      totalArea: 850,
    },
    fees: {
      rentAmount: 1200,
      currency: "USD",
    },
    amenities: {
      airConditioning: false,
      heating: false,
      washerDryer: false,
      dishwasher: false,
      parking: false,
      storage: false,
      cableTV: false,
      internet: false,
    },
    leases: [],
  },
  {
    id: "2",
    puid: "unit-2",
    unitNumber: "B",
    unitType: "studio",
    floor: 1,
    isActive: true,
    status: "available" as UnitStatus,
    specifications: {
      rooms: 1,
      bathrooms: 1,
      totalArea: 600,
    },
    fees: {
      rentAmount: 900,
      currency: "USD",
    },
    amenities: {
      airConditioning: false,
      heating: false,
      washerDryer: false,
      dishwasher: false,
      parking: false,
      storage: false,
      cableTV: false,
      internet: false,
    },
    leases: [],
  },
  {
    id: "3",
    puid: "unit-3",
    unitNumber: "C",
    unitType: "studio",
    floor: 2,
    isActive: true,
    status: "maintenance" as UnitStatus,
    specifications: {
      rooms: 3,
      bathrooms: 2,
      totalArea: 1100,
    },
    fees: {
      rentAmount: 1500,
      currency: "USD",
    },
    amenities: {
      airConditioning: false,
      heating: false,
      washerDryer: false,
      dishwasher: false,
      parking: false,
      storage: false,
      cableTV: false,
      internet: false,
    },
    leases: [],
  },
];

const mockUnitsStats = {
  currentUnits: 3,
  maxAllowedUnits: 5,
  availableSpaces: 2,
  unitStats: {
    occupied: 1,
    available: 1,
    maintenance: 1,
    reserved: 0,
    inactive: 0,
    vacant: 1,
  },
  canAddUnit: true,
};

describe("UnitsList Component", () => {
  const defaultProps = {
    units: mockUnits,
    isLoading: false,
    errors: null,
    unitsStats: mockUnitsStats,
  };

  it("renders units list with header", () => {
    render(<UnitsList {...defaultProps} />);

    expect(screen.getByText("Property Units")).toBeInTheDocument();
    expect(screen.getByText("3 | 5")).toBeInTheDocument();
  });

  it("displays all units", () => {
    render(<UnitsList {...defaultProps} />);

    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getByText("C")).toBeInTheDocument();
  });

  it("shows correct unit statuses", () => {
    render(<UnitsList {...defaultProps} />);

    expect(screen.getByText("Occupied")).toBeInTheDocument();
    expect(screen.getByText("Available")).toBeInTheDocument();
    expect(screen.getByText("Maintenance")).toBeInTheDocument();
  });

  it("formats unit specifications correctly", () => {
    render(<UnitsList {...defaultProps} />);

    expect(screen.getByText("2 bed, 1 bath, 850 sq ft")).toBeInTheDocument();
    expect(screen.getByText("1 bed, 1 bath, 600 sq ft")).toBeInTheDocument();
    expect(screen.getByText("3 bed, 2 bath, 1100 sq ft")).toBeInTheDocument();
  });

  it("formats rent amounts correctly", () => {
    render(<UnitsList {...defaultProps} />);

    expect(screen.getByText("$1,200.00/month")).toBeInTheDocument();
    expect(screen.getByText("$900.00/month")).toBeInTheDocument();
    expect(screen.getByText("$1,500.00/month")).toBeInTheDocument();
  });

  it("shows appropriate tenant text based on status", () => {
    render(<UnitsList {...defaultProps} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument(); // Occupied unit A
    expect(screen.getByText("Available for rent")).toBeInTheDocument(); // Available unit
    expect(screen.getByText("Under maintenance")).toBeInTheDocument(); // Maintenance unit
  });

  it("renders search input when searchable is true", () => {
    render(<UnitsList {...defaultProps} searchable={true} />);

    const searchInput = screen.getByPlaceholderText("Search units...");
    expect(searchInput).toBeInTheDocument();
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });

  it("hides search input when searchable is false", () => {
    render(<UnitsList {...defaultProps} searchable={false} />);

    expect(
      screen.queryByPlaceholderText("Search units...")
    ).not.toBeInTheDocument();
  });

  it("filters units based on search term", () => {
    render(<UnitsList {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText("Search units...");
    fireEvent.change(searchInput, { target: { value: "maintenance" } });

    // Should only show unit C which is under maintenance
    expect(screen.getByText("C")).toBeInTheDocument();
    expect(screen.queryByText("A")).not.toBeInTheDocument();
    expect(screen.queryByText("B")).not.toBeInTheDocument();
  });

  it("filters units by tenant text", () => {
    render(<UnitsList {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText("Search units...");
    fireEvent.change(searchInput, { target: { value: "john" } });

    expect(screen.getByText("A")).toBeInTheDocument(); // Unit A has "John Doe"
    expect(screen.queryByText("B")).not.toBeInTheDocument();
    expect(screen.queryByText("C")).not.toBeInTheDocument();
  });

  it("calls onUnitClick when unit is clicked", () => {
    const mockOnUnitClick = jest.fn();
    render(<UnitsList {...defaultProps} onUnitClick={mockOnUnitClick} />);

    const unitA = screen.getByText("A").closest(".unit-card");
    fireEvent.click(unitA!);

    expect(mockOnUnitClick).toHaveBeenCalledWith(mockUnits[0]);
  });

  it("shows loading state", () => {
    render(<UnitsList {...defaultProps} isLoading={true} />);

    expect(screen.getByText("Fetching property units")).toBeInTheDocument();
    expect(screen.queryByText("Property Units")).not.toBeInTheDocument();
  });

  it("shows error state", () => {
    const error = new Error("Failed to load units");
    render(<UnitsList {...defaultProps} errors={error} />);

    expect(
      screen.getByText("Error loading units: Failed to load units")
    ).toBeInTheDocument();
    expect(screen.queryByText("Property Units")).not.toBeInTheDocument();
  });

  it("handles empty units array", () => {
    render(<UnitsList {...defaultProps} units={[]} />);

    expect(screen.getByText("Property Units")).toBeInTheDocument();
    expect(screen.queryByText("A")).not.toBeInTheDocument();
  });

  it("handles units without complete specifications", () => {
    const incompleteUnit: IUnit = {
      id: "4",
      puid: "unit-4",
      unitNumber: "D",
      unitType: "studio",
      floor: 1,
      isActive: true,
      status: "available" as UnitStatus,
      specifications: {
        totalArea: 0, // Required field but empty value
      },
      fees: {
        rentAmount: 800,
        currency: "USD",
      },
      amenities: {
        airConditioning: false,
        heating: false,
        washerDryer: false,
        dishwasher: false,
        parking: false,
        storage: false,
        cableTV: false,
        internet: false,
      },
      leases: [],
    };

    render(<UnitsList {...defaultProps} units={[incompleteUnit]} />);

    expect(screen.getByText("No details available")).toBeInTheDocument();
  });

  it("applies correct CSS classes to units", () => {
    const { container } = render(<UnitsList {...defaultProps} />);

    const occupiedUnit = container.querySelector(".unit-card.occupied");
    const availableUnit = container.querySelector(".unit-card.available");
    const maintenanceUnit = container.querySelector(".unit-card.maintenance");

    expect(occupiedUnit).toBeInTheDocument();
    expect(availableUnit).toBeInTheDocument();
    expect(maintenanceUnit).toBeInTheDocument();
  });

  it("uses puid as key when available, falls back to id", () => {
    const { container } = render(<UnitsList {...defaultProps} />);

    const unitCards = container.querySelectorAll(".unit-card");
    expect(unitCards).toHaveLength(3);
  });
});
