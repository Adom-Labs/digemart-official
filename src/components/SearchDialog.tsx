import { searchSite } from "@/lib/search/action";
import { SiteSearchItem } from "@/lib/search/site-search-data";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import * as Icons from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";

const SearchDialog = ({ variant = "dark" }: { variant?: "white" | "dark" }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SiteSearchItem[]>([]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/") {
        e.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (query) {
      startTransition(async () => {
        const searchResults = await searchSite(query);
        setResults(searchResults);
      });
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSelect = (item: SiteSearchItem) => {
    setOpen(false);
    router.push(item.path);
  };

  const IconComponent = ({ name }: { name?: string }) => {
    if (!name) return <Search className="h-4 w-4" />;
    const Icon = (Icons as any)[name] || Search;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          aria-label="Search site"
          className={`flex items-center gap-2 px-2 py-1 rounded-full border ${
            variant === "white"
              ? "text-white border-white/20 hover:bg-white/10"
              : "text-gray-700 border-gray-200 hover:bg-gray-50"
          }`}
        >
          <Search className="h-4 w-4" />
          <span className="text-sm hidden sm:inline">Search features...</span>
          <div className="hidden sm:flex items-center gap-1">
            <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-gray-100 px-1.5 font-mono text-[10px] font-medium text-gray-600">
              /
            </kbd>
          </div>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[750px] p-0">
        <DialogTitle className="sr-only">
          Search features, tools, and resources...
        </DialogTitle>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
          <Input
            placeholder="Search features, tools, and resources..."
            className="pl-10 pr-4 py-6 border-0 focus-visible:ring-0"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="absolute right-3 top-3">
            <kbd
              onClick={() => setOpen(false)}
              className="inline-flex cursor-pointer h-5 select-none items-center gap-1 rounded border bg-gray-100 px-1.5 font-mono text-[10px] font-medium text-gray-400"
            >
              ESC
            </kbd>
          </div>
        </div>
        {isPending && (
          <div className="p-4 flex items-center justify-center text-gray-500">
            <Icons.Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}
        {results.length > 0 && (
          <div className="max-h-[80vh] overflow-y-auto p-4">
            <div className="space-y-2">
              {results.map((item) => (
                <button
                  key={item.title}
                  onClick={() => handleSelect(item)}
                  className="w-full flex items-start gap-4 p-3 rounded-lg hover:bg-gray-100 transition-colors text-left group"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                    <IconComponent name={item.icon} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium">{item.title}</h4>
                      <Icons.ArrowRight className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        {query && !isPending && results.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <p>No results found for &quot;{query}&quot;</p>
          </div>
        )}
        {!query && (
          <div className="p-4 text-sm text-gray-500">
            Start typing to search features, tools, and resources...
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
