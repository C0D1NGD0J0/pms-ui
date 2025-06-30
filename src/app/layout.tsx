import { ConfigProvider } from "antd";
import { ThemeProvider } from "@theme/index";
import { RectQueryProvider } from "@hooks/useReactQuery";
import { EventProvider } from "@components/EventProvider";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { NotificationProvider } from "@hooks/useNotification";
import { TokenRefreshOverlay } from "@components/TokenRefreshOverlay";
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
        <ThemeProvider>
          <AntdRegistry>
            <NotificationProvider>
              <ConfigProvider>
                <RectQueryProvider>
                  <EventProvider>
                    {children}
                    <TokenRefreshOverlay />
                  </EventProvider>
                </RectQueryProvider>
              </ConfigProvider>
            </NotificationProvider>
          </AntdRegistry>
        </ThemeProvider>
      </body>
    </html>
  );
}
