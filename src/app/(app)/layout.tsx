import Navbar from "@/components/Navbar";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            {children}
            <footer className="text-gray-600 mt-auto text-center p-2">
                © 2024 Mystry Message. All rights reserved.
            </footer>
        </div>
    );
}
