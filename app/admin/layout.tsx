import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '../globals.css';

const epilogue = localFont({
  src: [
    {
      path: '../../public/fonts/Epilogue-Thin.otf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Epilogue-ExtraLight.otf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Epilogue-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Epilogue-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Epilogue-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Epilogue-SemiBold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Epilogue-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Epilogue-ExtraBold.otf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Epilogue-Black.otf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-epilogue',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Admin Panel | Doris Art',
  description: 'Admin panel for managing Doris Art content',
  robots: 'noindex, nofollow',
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${epilogue.variable} ${epilogue.className}`}>
      <body className="bg-cream antialiased">
        {children}
      </body>
    </html>
  );
}
