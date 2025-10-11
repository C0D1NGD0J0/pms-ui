import { TableColumn, Table } from "@components/Table";
import { render, screen } from "@testing-library/react";

// Mock Panel components
jest.mock("@components/Panel", () => ({
  PanelHeader: ({ children }: any) => <div>{children}</div>,
  PanelContent: ({ children }: any) => <div>{children}</div>,
}));

interface TestData {
  id: string;
  name: string;
  status: string;
}

describe("Table", () => {
  const mockColumns: TableColumn<TestData>[] = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Status", dataIndex: "status", key: "status" },
  ];

  const mockData: TestData[] = [
    { id: "1", name: "John Doe", status: "active" },
    { id: "2", name: "Jane Smith", status: "pending" },
  ];

  it("should render table with data", () => {
    render(<Table columns={mockColumns} dataSource={mockData} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("should render column headers", () => {
    render(<Table columns={mockColumns} dataSource={mockData} />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("should render empty state when no data", () => {
    render(
      <Table
        columns={mockColumns}
        dataSource={[]}
        emptyText="No records found"
      />
    );

    expect(screen.getByText("No records found")).toBeInTheDocument();
  });
});
