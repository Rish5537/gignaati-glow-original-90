
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type FeaturedGig = {
  id: string;
  title: string;
  price: number;
  rating: number;
  reviews_count: number;
  freelancer: string;
  xp: string;
  image: string;
};

const FeaturedGigs = () => {
  const [featuredGigs, setFeaturedGigs] = useState<FeaturedGig[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchFeaturedGigs = async () => {
      try {
        // Get top 6 gigs with highest rating
        const { data, error } = await supabase
          .from('gigs')
          .select(`
            id,
            title,
            price,
            rating,
            reviews_count,
            image_url,
            experience_level,
            profiles (
              full_name
            )
          `)
          .order('rating', { ascending: false })
          .limit(6);

        if (error) {
          throw error;
        }

        const formattedGigs = data.map(gig => ({
          id: gig.id,
          title: gig.title,
          price: gig.price,
          rating: gig.rating || 0,
          reviews_count: gig.reviews_count || 0,
          freelancer: gig.profiles.full_name || 'Anonymous Freelancer',
          xp: gig.experience_level || 'Intermediate',
          image: gig.image_url || 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
        }));

        setFeaturedGigs(formattedGigs);
      } catch (error) {
        console.error('Error fetching featured gigs:', error);
        toast({
          title: 'Error',
          description: 'Failed to load featured gigs. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedGigs();
  }, [toast]);

  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured AI Gigs</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover top-rated AI agents and services from our verified freelancers
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredGigs.map((gig) => (
              <Card key={gig.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <img 
                    src={gig.image} 
                    alt={gig.title} 
                    className="w-full h-full object-cover"
                  />
                  <Button 
                    size="sm" 
                    className="absolute top-3 right-3 bg-white text-black hover:bg-gray-100"
                  >
                    <Play className="h-4 w-4 mr-1 text-gignaati-coral" />
                    Demo
                  </Button>
                </div>
                
                <CardContent className="p-5">
                  <Link to={`/gig/${gig.id}`}>
                    <h3 className="font-semibold text-lg mb-2 hover:text-gignaati-coral transition-colors">
                      {gig.title}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center mb-3 text-sm">
                    <span className="bg-blue-100 text-blue-800 font-medium px-2 py-0.5 rounded-full mr-2">
                      {gig.xp}
                    </span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="ml-1 font-medium">{gig.rating}</span>
                      <span className="text-gray-500 ml-1">({gig.reviews_count})</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <img 
                      src="/placeholder.svg" 
                      alt={gig.freelancer} 
                      className="w-6 h-6 rounded-full mr-2" 
                    />
                    <span>{gig.freelancer}</span>
                  </div>
                </CardContent>
                
                <CardFooter className="px-5 py-3 border-t flex justify-between items-center">
                  <div className="font-bold text-lg">${gig.price}</div>
                  <Button asChild className="bg-gignaati-coral hover:bg-red-500 text-white">
                    <Link to={`/gig/${gig.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        
        <div className="text-center mt-10">
          <Button asChild className="bg-black hover:bg-gray-800 text-white px-6">
            <Link to="/browse-gigs">
              View All Gigs
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedGigs;
