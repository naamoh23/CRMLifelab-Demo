import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'LifeLab CRM · Customer Workspace', description: 'พื้นที่ทำงาน CRM ของ Life Lab Academy — จากลูกค้าคนแรกถึงวันรับใบประกาศ', icons: { icon: '/favicon.svg' } };
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>) { return <html lang="th" suppressHydrationWarning><body>{children}</body></html>; }
