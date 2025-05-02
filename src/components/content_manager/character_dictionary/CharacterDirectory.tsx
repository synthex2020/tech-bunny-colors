import { useEffect, useState } from 'react';
import SeriesCard from './SeriesCard';
import { Series } from '../../../types';
import { fetch_available_series } from '../../../persistence/SeriesPerisistence';

function CharacterDirectory() {
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSeries = async () => {
      try {
        const data = await fetch_available_series();
        setSeries(data);
      } catch (error) {
        console.error('Failed to fetch series:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSeries();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Caleido-Hope Labs Characters and Story Encyclopedia</h1>
        <p className="text-xl">A collection of our characters and relevant stories</p>
      </header>

      {loading ? (
        <div className="text-center text-lg">Loading series...</div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {series.map((item, index) => (
            <SeriesCard key={index} series={item} index={index} />
          ))}
        </section>
      )}

      <section className="text-center mt-12">
        <h2 className="text-2xl font-semibold mb-4">Interested in one of our Stories?</h2>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Our collection of stories continues to grow. Stay tuned for new series, characters,
          and exciting narrative worlds waiting to be explored.
        </p>
        <div className="mt-6">
          <button
            className="btn btn-outline btn-secondary"
            onClick={() => {
              // Future: Newsletter signup or notification
            }}
          >
            Get Updates
          </button>
        </div>
      </section>
    </div>
  );
}

export default CharacterDirectory;
