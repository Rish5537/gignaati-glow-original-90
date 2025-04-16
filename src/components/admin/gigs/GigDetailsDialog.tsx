
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface GigDetailsDialogProps {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  selectedGig: any;
  gigRequirements: string;
}

const GigDetailsDialog: React.FC<GigDetailsDialogProps> = ({
  showDialog,
  setShowDialog,
  selectedGig,
  gigRequirements
}) => {
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Gig Details</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {selectedGig && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{selectedGig.title}</h3>
                <p className="text-sm text-gray-500">
                  Created by {selectedGig.profiles?.full_name || "Unknown Creator"} on{" "}
                  {new Date(selectedGig.created_at).toLocaleDateString()}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">Requirements</h4>
                <Textarea 
                  value={gigRequirements} 
                  readOnly 
                  className="h-32 resize-none bg-gray-50" 
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-medium">Price</h4>
                  <p>${selectedGig.price}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowDialog(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GigDetailsDialog;
