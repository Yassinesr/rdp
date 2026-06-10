export const metadata = {
  title: "Garmin Coach",
  description: "Adaptive cycling coach powered by Garmin data",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0, background: "#0f1117", color: "#e6e8ee" }}>
        {children}
      </body>
    </html>
  );
}
