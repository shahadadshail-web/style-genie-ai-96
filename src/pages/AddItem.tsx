import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAddClothing } from "@/hooks/useClothes";
import { toast } from "sonner";
import { Camera, Upload, ArrowLeft, X, Loader2, Sparkles } from "lucide-react";

export default function AddItem() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const { mutate: addClothing, isPending } = useAddClothing();

  const handleFileSelect = (file: File) => {
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const clearImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const handleSubmit = () => {
    if (!selectedImage) {
      toast.error("Please select an image");
      return;
    }

    addClothing(
      { imageFile: selectedImage },
      {
        onSuccess: (data) => {
          toast.success(
            `Added to ${data.categorization.category}: ${data.categorization.sub_category}`,
            { icon: "✨" }
          );
          navigate("/");
        },
        onError: (error) => {
          toast.error("Failed to add item: " + error.message);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold font-serif">Add New Item</h1>
        </div>
      </header>

      <main className="container max-w-2xl mx-auto px-4 py-8">
        {/* Image Selection */}
        {!previewUrl ? (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-4">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">AI Auto-Categorization</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Just upload a photo — our AI will automatically categorize your clothing
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed border-border hover:border-accent hover:bg-accent/5 transition-all duration-200"
              >
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
                  <Camera className="w-6 h-6 text-accent" />
                </div>
                <span className="text-sm font-medium">Take a Photo</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed border-border hover:border-accent hover:bg-accent/5 transition-all duration-200"
              >
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-accent" />
                </div>
                <span className="text-sm font-medium">Upload from Gallery</span>
              </button>
            </div>

            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileInputChange}
              className="hidden"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Image Preview */}
            <div className="relative rounded-xl overflow-hidden bg-muted aspect-square max-w-sm mx-auto">
              <img
                src={previewUrl}
                alt="Selected clothing"
                className="w-full h-full object-cover"
              />
              {!isPending && (
                <button
                  onClick={clearImage}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-foreground/80 text-background flex items-center justify-center hover:bg-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              
              {isPending && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-accent" />
                  <div className="text-center">
                    <p className="font-medium text-sm">Analyzing with AI...</p>
                    <p className="text-xs text-muted-foreground">Categorizing your clothing</p>
                  </div>
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Smart Categorization</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Our AI will analyze your photo and automatically detect whether it's a top, bottom, shoes, or accessory — plus identify the specific type.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={isPending}
              className="w-full h-12 bg-accent text-accent-foreground hover:bg-accent/90 font-medium"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Add to Wardrobe
                </>
              )}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
