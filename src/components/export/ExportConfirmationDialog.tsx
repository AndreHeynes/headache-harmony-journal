
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Clock, User } from "lucide-react";
import { getUserSession } from "@/utils/userSession";

interface ExportConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  exportType: 'pdf' | 'csv';
  recordCount: number;
}

export function ExportConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  exportType,
  recordCount
}: ExportConfirmationDialogProps) {
  const [userConfirmation, setUserConfirmation] = useState('');
  const session = getUserSession();
  
  const expectedConfirmation = 'EXPORT';
  const isConfirmationValid = userConfirmation.toUpperCase() === expectedConfirmation;

  const handleConfirm = () => {
    if (isConfirmationValid) {
      onConfirm();
      setUserConfirmation('');
      onClose();
    }
  };

  const handleCancel = () => {
    setUserConfirmation('');
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-gray-900 border-gray-700 max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white flex items-center gap-2">
            <Shield className="h-5 w-5 text-teal-400" />
            Confirm Data Export
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            You're about to export your personal headache data. Please review the details below.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-gray-800 p-3 rounded-lg space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400 flex items-center gap-1">
                <User className="h-4 w-4" />
                User ID:
              </span>
              <span className="text-gray-300 font-mono text-xs">
                {session.id.slice(-8)}...
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Export Format:</span>
              <span className="text-teal-400 uppercase">{exportType}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Records:</span>
              <span className="text-gray-300">{recordCount} entries</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400 flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Timestamp:
              </span>
              <span className="text-gray-300 text-xs">
                {new Date().toLocaleString()}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-gray-300">
              Type <span className="font-bold text-teal-400">{expectedConfirmation}</span> to confirm:
            </Label>
            <Input
              value={userConfirmation}
              onChange={(e) => setUserConfirmation(e.target.value)}
              placeholder="Type EXPORT to confirm"
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>
          
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-md p-3">
            <p className="text-amber-300 text-xs">
              <strong>Privacy Notice:</strong> This export will include all your personal headache data. 
              Only share this information with trusted healthcare providers.
            </p>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={handleCancel}
            className="bg-gray-800 text-white hover:bg-gray-700"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!isConfirmationValid}
            className="bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Export Data
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
