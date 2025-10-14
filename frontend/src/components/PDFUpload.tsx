import { useState, useRef } from "react";
import { Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface PDFUploadProps {
  onUpload: (file: File) => void;
}

const PDFUpload = ({ onUpload }: PDFUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find((file) => file.type === "application/pdf");

    if (pdfFile) {
      setSelectedFile(pdfFile);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      await onUpload(selectedFile);
      toast({
        title: "Success!",
        description: "Your PDF has been uploaded. You can now start chatting!",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
            isDragging
              ? "border-blue-500 bg-blue-50 shadow-md"
              : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
          }`}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-blue-500 flex items-center justify-center shadow-md">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-lg font-semibold mb-2">Drop your PDF here</p>
              <p className="text-sm text-gray-500">or click to browse files</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
              id="pdf-upload"
            />
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md transition-all"
            >
              Select PDF File
            </Button>
          </div>
        </div>
      ) : (
        <div className="border border-gray-300 rounded-xl p-6 bg-white shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              disabled={isUploading}
              className="text-gray-500 hover:text-red-500"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <Button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md transition-all"
          >
            {isUploading ? "Uploading..." : "Upload and Start Chat"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PDFUpload;
