import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X, Link as LinkIcon, ArrowRight, Loader2 } from "lucide-react";

export function UrlInput({ onSubmit, isLoading }) {
    const [urls, setUrls] = useState([""]);

    const updateUrl = (index, value) => {
        const newUrls = [...urls];
        newUrls[index] = value;
        setUrls(newUrls);
    };

    const addUrl = () => {
        if (urls.length < 10) {
            setUrls([...urls, ""]);
        }
    };

    const removeUrl = (index) => {
        const newUrls = urls.filter((_, i) => i !== index);
        setUrls(newUrls);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validUrls = urls.map(u => u.trim()).filter(u => u.length > 0);
        if (validUrls.length > 0) {
            onSubmit(validUrls);
        }
    };

    const isValid = urls.some(u => u.trim().length > 0);

    return (
        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
            <div className="space-y-3">
                {urls.map((url, index) => (
                    <div key={index} className="flex gap-2">
                        <div className="relative flex-1">
                            <LinkIcon className="absolute left-3 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                            <input
                                type="url"
                                value={url}
                                onChange={(e) => updateUrl(index, e.target.value)}
                                placeholder="https://example.com/article"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-9"
                                disabled={isLoading}
                            />
                        </div>
                        {urls.length > 1 && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeUrl(index)}
                                disabled={isLoading}
                                className="text-muted-foreground hover:text-destructive"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between pt-2">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addUrl}
                    disabled={urls.length >= 10 || isLoading}
                    className="text-muted-foreground hover:text-primary"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add URL ({urls.length}/10)
                </Button>

                <Button type="submit" disabled={!isValid || isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            Generate Brief
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}