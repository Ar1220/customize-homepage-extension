import { Search } from "lucide-react";

export function SearchBar() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = new FormData(e.currentTarget).get("q");
    if (query) {
      window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query as string)}`;
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="group relative flex w-full max-w-xl items-center"
    >
      <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-white/50 group-focus-within:text-white transition-colors" />
      </div>
      <input
        type="text"
        name="q"
        placeholder="Search the web..."
        autoComplete="off"
        className="w-full rounded-full border border-white/10 bg-black/20 backdrop-blur-md px-14 py-4 text-lg text-white placeholder-white/50 outline-none ring-0 transition-all focus:border-white/30 focus:bg-black/40 focus:ring-4 focus:ring-white/5 shadow-2xl"
      />
    </form>
  );
}