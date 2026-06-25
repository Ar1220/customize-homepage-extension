import { SearchCommand } from '../App';

export const executeSearch = (query: string, searchCommands: SearchCommand[] = []) => {
  if (!query.trim()) return;

  const trimmedQuery = query.trim();
  
  if (trimmedQuery.startsWith('/')) {
    const parts = trimmedQuery.slice(1).split(' ');
    const trigger = parts[0].toLowerCase();
    const searchQuery = parts.slice(1).join(' ');

    const command = searchCommands.find(c => c.trigger === trigger);

    if (command) {
      let finalUrl = command.url;
      if (searchQuery) {
        finalUrl = finalUrl.replace('{query}', encodeURIComponent(searchQuery));
      } else {
        finalUrl = finalUrl.replace('{query}', '');
      }
      window.location.href = finalUrl;
      return;
    }
  }

  // Fallback to default Google search
  window.location.href = `https://www.google.com/search?q=${encodeURIComponent(trimmedQuery)}`;
};
