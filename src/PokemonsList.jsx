import PokemonCard from "./PokemonCard";

const PokemonsList = ({ pokemons }) => {
  return (
    <>
      {pokemons.map((pokemon) => (
        <PokemonCard pokemon={pokemon} key={pokemon.name} />
      ))}
    </>
  );
};

export default PokemonsList;
