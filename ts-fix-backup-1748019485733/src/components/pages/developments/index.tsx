import DevelopmentsList from './DevelopmentsList';

export default function DevelopmentsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#2B5273] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">Find your new home</h1>
          <p className="mt-2 text-white/80">Browse our developments in Drogheda</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold mb-8">All Communities</h2>
        <DevelopmentsList />
      </div>
    </div>
  );
}