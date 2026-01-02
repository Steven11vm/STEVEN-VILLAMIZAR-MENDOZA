import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Gestión de Asistentes IA - Funnelhot',
  description: 'Sistema de gestión de asistentes IA para automatizar interacciones con leads',
  authors: [{ name: 'STEVEN VILLAMIZAR MENDOZA' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Sistema profesional de gestión de asistentes IA para automatizar interacciones con leads" />
      </head>
      <body>{children}</body>
    </html>
  );
}

