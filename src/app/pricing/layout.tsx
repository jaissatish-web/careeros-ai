export const metadata = { title: 'Pricing — CareerOS AI' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className='dark'>
      <body className='font-body bg-[#030712] text-[#f9fafb]'>
        {children}
      </body>
    </html>
  );
}
