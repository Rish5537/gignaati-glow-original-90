
import { useState, useEffect } from 'react';
import { FilterState } from './GigFilters';
import GigCard from './GigCard';
import PaginationControls from './PaginationControls';
import EmptyGigsState from './EmptyGigsState';
import { getFilteredAndSortedGigs, Gig } from '../services/GigDataService';
import { useToast } from "@/hooks/use-toast";

// Export the Gig type from this file since it's referenced in GigCard
export type { Gig };

interface GigGridProps {
  searchQuery: string;
  sortBy: string;
  filters: FilterState;
}

const GigGrid = ({ searchQuery, sortBy, filters }: GigGridProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortedGigs, setSortedGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const gigsPerPage = 9;
  
  useEffect(() => {
    const fetchGigs = async () => {
      setLoading(true);
      try {
        const gigs = await getFilteredAndSortedGigs(searchQuery, sortBy, filters);
        setSortedGigs(gigs);
      } catch (error) {
        console.error('Error fetching gigs:', error);
        toast({
          title: 'Error',
          description: 'Failed to load gigs. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGigs();
  }, [searchQuery, sortBy, filters, toast]);
  
  // Calculate pagination
  const totalPages = Math.ceil(sortedGigs.length / gigsPerPage);
  const indexOfLastGig = currentPage * gigsPerPage;
  const indexOfFirstGig = indexOfLastGig - gigsPerPage;
  const currentGigs = sortedGigs.slice(indexOfFirstGig, indexOfLastGig);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : sortedGigs.length === 0 ? (
        <EmptyGigsState />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentGigs.map((gig) => (
              <GigCard key={gig.id} gig={gig} />
            ))}
          </div>
          
          <PaginationControls 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
          />
        </>
      )}
    </div>
  );
};

export default GigGrid;
