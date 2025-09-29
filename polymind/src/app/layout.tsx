import "./globals.css";

export const metadata = {
  title: "Polymind",
  description: "A multi-agent AI workspace assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className=" bg-background text-foreground font-body antialiased">
      <body>{children}</body>
    </html>
  );
}
