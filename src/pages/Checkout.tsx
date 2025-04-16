
import { useParams, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Checkout = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const packageType = searchParams.get("package");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-16 flex-1">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Purchase</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              You are purchasing the {packageType} package for gig #{id}.
            </p>
            <p className="text-gray-600">
              This is a placeholder for the checkout process.
            </p>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
