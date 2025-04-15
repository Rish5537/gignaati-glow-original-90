
import { Gig } from "./types";

export const sortGigs = (gigs: Gig[], sortBy: string): Gig[] => {
  return [...gigs].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return parseInt(b.id) - parseInt(a.id); // Using ID as a proxy for date
      case 'topRated':
        return b.rating - a.rating;
      case 'priceLow':
        return a.price - b.price;
      case 'priceHigh':
        return b.price - a.price;
      case 'popular':
      default:
        return b.reviews_count - a.reviews_count;
    }
  });
};
