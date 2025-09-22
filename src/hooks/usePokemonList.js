// usePokemonList.js
// Custom React hook for fetching a list of Pokémon from the PokéAPI.
// - Accepts a `limit` (default 151, Gen 1).
// - Returns list data plus loading state.

import { useEffect, useState } from "react";

export function usePokemonList(limit = 151) {
  const [list, setList] = useState([]);         // array of Pokémon objects
  const [loading, setLoading] = useState(true); // true while fetching

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Fetch Pokémon list from API
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
        const data = await res.json();

        // Normalize data: extract id and name for each Pokémon
        const shaped = data.results.map((p) => {
          const id = p.url.split("/").filter(Boolean).pop();
          return {
            id,
            name: p.name,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
          };
        });
        if (mounted) setList(shaped);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [limit]);

  const getRandom = (excludeId) => {
    if (!list.length) return null;
    let next;
    do {
      next = list[Math.floor(Math.random() * list.length)];
    } while (excludeId && next.id === excludeId && list.length > 1);
    return next;
  };

  return { list, loading, getRandom };
}
