
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface PackageDetails {
  name: string;
  price: number;
  description: string;
  deliveryTime: string;
  revisions: number | string;
}

interface PackageSelectorProps {
  packages: Record<string, PackageDetails>;
  defaultPackage?: string;
  gigId: string | number; // Add gigId prop
}

const PackageSelector = ({ packages, defaultPackage = "training", gigId }: PackageSelectorProps) => {
  const [selectedPackage, setSelectedPackage] = useState(defaultPackage);
  const navigate = useNavigate();
  
  // Get user authentication status (in a real app, this would check your auth state)
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  
  const handleSelectPackage = () => {
    if (isAuthenticated) {
      // User is authenticated, proceed to checkout
      toast({
        title: "Package selected!",
        description: `You selected the ${packages[selectedPackage].name} package.`
      });
      navigate(`/checkout/${gigId}?package=${selectedPackage}`);
    } else {
      // User is not authenticated, redirect to auth with return URL
      const returnUrl = `/checkout/${gigId}?package=${selectedPackage}`;
      localStorage.setItem("authRedirectUrl", returnUrl);
      navigate(`/auth?returnUrl=${encodeURIComponent(returnUrl)}`);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Packages</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={defaultPackage} value={selectedPackage} onValueChange={setSelectedPackage}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
            <TabsTrigger value="customization">Customization</TabsTrigger>
          </TabsList>
          
          {Object.entries(packages).map(([key, pkg]) => (
            <TabsContent key={key} value={key} className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{pkg.name}</h3>
                <div className="text-2xl font-bold">${pkg.price}</div>
              </div>
              <p className="text-gray-700">{pkg.description}</p>
              <div className="pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery time:</span>
                  <span className="font-medium">{pkg.deliveryTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Revisions:</span>
                  <span className="font-medium">{pkg.revisions}</span>
                </div>
              </div>
              <Button 
                className="w-full bg-gignaati-coral hover:bg-red-500 mt-4"
                onClick={handleSelectPackage}
              >
                Select & Continue
              </Button>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PackageSelector;
