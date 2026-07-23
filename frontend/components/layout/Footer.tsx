// frontend/components/layout/Footer.tsx
// Komponen footer halaman

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-500">
          <p>© {year} UAS Web Dinamis. Semua hak dilindungi.</p>
          <p>
            Backend:{' '}
            <span className="font-mono text-blue-600">localhost:3000</span>
            {' | '}
            Frontend:{' '}
            <span className="font-mono text-blue-600">localhost:3001</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
