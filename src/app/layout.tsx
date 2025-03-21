import { ConfigProvider } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { NotificationProvider } from "@hooks/useNotification";
import "@styles/main.scss";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="An interactive property management platform for landlords and tenants"
        />
        <meta
          name="keywords"
          content='property management, landlord, tenant, "rental management"'
        />
        <link
          href="https://unpkg.com/boxicons@2.1.2/css/boxicons.min.css"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <AntdRegistry>
          <NotificationProvider>
            <ConfigProvider>{children}</ConfigProvider>
          </NotificationProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
