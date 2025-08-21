import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Breadcrumb as AntBreadcrumb } from "antd";

interface BreadcrumbItem {
  title: React.ReactNode;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  className = "",
}) => {
  const pathname = usePathname();
  const breadcrumbItems = items || generateBreadcrumbItems(pathname);

  return (
    <div className={`page-breadcrumb ${className}`}>
      <AntBreadcrumb
        items={breadcrumbItems.map((item) => ({
          title: item.href ? (
            <Link href={item.href}>{item.title}</Link>
          ) : (
            item.title
          ),
        }))}
      />
    </div>
  );
};

const generateBreadcrumbItems = (pathname: string): BreadcrumbItem[] => {
  const pathSegments = pathname.split("/").filter((segment) => segment);

  const breadcrumbItems: BreadcrumbItem[] = [
    { title: "Home", href: "/dashboard" },
  ];

  let currentPath = "";

  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    const formattedName = segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

    breadcrumbItems.push({
      title: formattedName,
      href: index < pathSegments.length - 1 ? currentPath : undefined,
    });
  });

  return breadcrumbItems;
};
