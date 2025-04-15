
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { Gig } from '../services/GigDataService';

interface GigCardProps {
  gig: Gig;
}

const GigCard = ({ gig }: GigCardProps) => {
  return (
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
  );
};

export default GigCard;
