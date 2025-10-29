import Link from "next/link";

export const generatePropertyColumn = () => {
  return [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Property Type",
      dataIndex: "propertyType",
      render: (type: string) => type.charAt(0).toUpperCase() + type.slice(1),
    },
    {
      title: "Address",
      dataIndex: "address",
      render: (address: any) => {
        if (address.state !== address.city) {
          return `${address.street}, ${address.city}, ${address.state}, ${address.country}`;
        }
        return `${address.street}, ${address.city}, ${address.country}`;
      },
    },
    {
      title: "Details",
      dataIndex: "specifications",
      render: (specs: any, record: any) => {
        if (
          record.propertyType === "commercial" ||
          record.propertyType === "industrial"
        ) {
          return `${specs?.totalArea || 0} sq ft`;
        }
        return `${specs?.bedrooms || 0} bed, ${specs?.bathrooms || 0} bath, ${
          specs?.totalArea || 0
        } sq ft`;
      },
    },
    { title: "Status", dataIndex: "status", isStatus: true },
    {
      title: "Action",
      dataIndex: "pid",
      render: (pid: string) => (
        <div className="action-icons">
          <Link
            href={`/properties/${pid}`}
            className="action-icon view-icon"
            title="View Property"
          >
            <i className="bx bx-show"></i>
          </Link>
          <Link
            href={`/properties/${pid}/edit`}
            className="action-icon edit-icon"
            title="Edit Property"
          >
            <i className="bx bx-edit"></i>
          </Link>
        </div>
      ),
    },
  ];
};
