import "./App.css";
import { useEffect, useState } from "react";
import { Pokedex } from "pokeapi-js-wrapper";

import {
  Container,
  Row,
  Pagination,
  Button,
  ButtonGroup,
  Toast,
} from "react-bootstrap";

import PokemonsList from "./PokemonsList";

function App() {
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [pokemonsCount, setPokemonsCount] = useState(0);
  const [pokemons, setPokemons] = useState([]);

  useEffect(() => {
    const P = new Pokedex();

    const offset = currentPage > 1 ? (currentPage - 1) * limit : 0;

    P.getPokemonsList({ offset: offset, limit: limit })
      .then(({ count, results, next, previous }) => {
        // console.log(count, previous, next);
        setPokemonsCount(count);

        return results.map(({ name }) => name);
      })
      .then((result) => P.getPokemonByName(result))
      .then((result) =>
        result.map(({ name, sprites, types, stats }) => ({
          name,
          avatar: sprites.other.home.front_default,
          types,
          stats,
        }))
      )
      .then((result) => setPokemons(result));
  }, [currentPage, limit]);

  // ...
  // stats: stats.reduce((acc, { base_stat, effort, stat }) => {
  //   return { ...acc, [stat.name]: { base_stat, effort } };
  // }, {}),
  // ...

  return (
    <div className="App">
      <Container>
        <Row>
          <ButtonGroup>
            <Button variant="secondary" onClick={() => setLimit(10)}>
              10
            </Button>
            <Button variant="secondary" onClick={() => setLimit(20)}>
              20
            </Button>
            <Button variant="secondary" onClick={() => setLimit(50)}>
              50
            </Button>
          </ButtonGroup>
        </Row>
        <Row>
          <Pagination size="lg">
            <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} />
            <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} />
          </Pagination>
        </Row>
        <Row style={{ gap: "20px" }}>
          <PokemonsList pokemons={pokemons} />
        </Row>
      </Container>
      <Toast>
        <Toast.Header>
          <strong className="me-auto">Bootstrap</strong>
          <small>11 mins ago</small>
        </Toast.Header>
        <Toast.Body>Hello, bro! We get {pokemonsCount} pokemons.</Toast.Body>
      </Toast>
    </div>
  );
}

export default App;
