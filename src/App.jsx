import { useState, useEffect } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  TablePagination,
  Unstable_Grid2 as Grid,
  Autocomplete,
  TextField,
  Skeleton,
  Alert,
  AlertTitle,
} from "@mui/material";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";

import { Pokedex } from "pokeapi-js-wrapper";

const P = new Pokedex();
const rowsPerPageOptions = [10, 20, 50];

const App = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [pokemonTypes, setPokemonTypes] = useState([]);
  const [pokemonNames, setPokemonNames] = useState([]);
  const [pokemonCount, setPokemonCount] = useState(0);
  const [filteredPokemonNames, setFilteredPokemonNames] = useState([]);
  const [pokemons, setPokemons] = useState([]);
  const [filters, setFilters] = useState({
    pokemonName: "",
    pokemonType: [],
  });
  const [isEmptyResult, setIsEmptyResult] = useState(false);
  useEffect(() => {
    setIsEmptyResult(false);

    if (pokemonTypes.length === 0) {
      P.getTypesList().then(({ results }) => {
        setPokemonTypes(results.map(({ name }) => ({ type: name })));
      });
    }
    if (pokemonNames.length === 0) {
      P.getPokemonsList().then(({ results }) => {
        setPokemonNames(results.map(({ name }) => ({ name })));
      });
    }

    (async function () {
      let filtered = filters.pokemonType.length > 0 ? [] : pokemonNames;

      if (filters.pokemonType.length > 0) {
        const results = await P.getTypeByName(
          filters.pokemonType.map(({ type }) => type)
        );
        filtered = results
          .map(({ pokemon }) => pokemon)
          .reduce((acc, arr) => [...acc, ...arr])
          .map(({ pokemon }) => ({ name: pokemon.name }));
      }

      if (filters.pokemonName) {
        filtered = filtered.filter(({ name }) =>
          name.includes(filters.pokemonName)
        );
      }

      if (filtered.length === 0 && pokemonNames.length !== 0) {
        setIsEmptyResult(true);
      }
      setFilteredPokemonNames(filtered);
      setPokemonCount(filtered.length);
    })();
  }, [pokemonNames, filters]);
  useEffect(() => {
    setPokemons([]);

    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    P.getPokemonByName(
      filteredPokemonNames.slice(startIndex, endIndex).map(({ name }) => name)
    ).then((result) => {
      setPokemons(
        result.map(({ name, sprites, types, stats }) => ({
          name,
          avatar:
            sprites.other.home.front_default ??
            sprites.other["official-artwork"].front_default ??
            sprites.front_default,
          types,
          stats,
        }))
      );
    });
  }, [page, rowsPerPage, filteredPokemonNames]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" id="back-to-top-anchor">
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            My Pokédex
          </Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Box sx={{ my: 2 }}>
          <Grid container>
            <Grid xs={12} md={6}>
              <Autocomplete
                options={pokemonTypes}
                value={filters.pokemonType}
                onChange={(event, newValue) => {
                  setFilters((oldState) => ({
                    ...oldState,
                    pokemonType: newValue,
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Pokémon types"
                    placeholder="Pokémon types..."
                  />
                )}
                renderOption={(props, option, { inputValue }) => {
                  const matches = match(option.type, inputValue, {
                    insideWords: true,
                  });
                  const parts = parse(option.type, matches);

                  return (
                    <li {...props}>
                      <div>
                        {parts.map((part, index) => (
                          <span
                            key={index}
                            style={{ fontWeight: part.highlight ? 700 : 400 }}
                          >
                            {part.text}
                          </span>
                        ))}
                      </div>
                    </li>
                  );
                }}
                multiple
                limitTags={2}
                getOptionLabel={(option) => option.type}
                sx={{ maxWidth: 600 }}
              />
            </Grid>
            <Grid
              xs={12}
              md={6}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mt: { xs: 2, md: 0 },
              }}
            >
              <Autocomplete
                freeSolo
                sx={{ maxWidth: { xs: "auto", sm: 300 }, width: "100%" }}
                value={filters.pokemonName}
                onChange={(event, newValue) => {
                  setFilters((oldState) => ({
                    ...oldState,
                    pokemonName: newValue?.name ?? newValue ?? "",
                  }));
                }}
                isOptionEqualToValue={(option, value) =>
                  option.name === value.name
                }
                getOptionLabel={(option) => {
                  // Value selected with enter, right from the input
                  if (typeof option === "string") {
                    return option;
                  }
                  // Regular option
                  return option.name;
                }}
                options={pokemonNames}
                renderInput={(params) => (
                  <TextField {...params} label="Pokémon name" />
                )}
                renderOption={(props, option, { inputValue }) => {
                  const matches = match(option.name, inputValue, {
                    insideWords: true,
                  });
                  const parts = parse(option.name, matches);

                  return (
                    <li {...props}>
                      <div>
                        {parts.map((part, index) => (
                          <span
                            key={index}
                            style={{ fontWeight: part.highlight ? 700 : 400 }}
                          >
                            {part.text}
                          </span>
                        ))}
                      </div>
                    </li>
                  );
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Container>
        <Box sx={{ my: 2 }}>
          {!isEmptyResult && (
            <TablePagination
              component="div"
              count={pokemonCount}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={rowsPerPageOptions}
              onRowsPerPageChange={handleChangeRowsPerPage}
              showFirstButton
              showLastButton
              labelRowsPerPage="Cards per page:"
            />
          )}

          <Grid container spacing={2}>
            {isEmptyResult && (
              <Container maxWidth="sm" sx={{ py: 10 }}>
                <Alert severity="warning">
                  <AlertTitle>No Pokémon Matched Your Search!</AlertTitle>
                  Try to use — <strong>filters different values!</strong>
                </Alert>
              </Container>
            )}
            {pokemons.length === 0 &&
              !isEmptyResult &&
              [...new Array(rowsPerPage)].map((v, i) => (
                <Grid key={i} xs={12} sm={6} md={4} xl={3}>
                  <Card>
                    <Skeleton
                      sx={{ height: 190 }}
                      animation="wave"
                      variant="rectangular"
                    />
                    <CardHeader
                      title={
                        <Skeleton
                          animation="wave"
                          height={10}
                          width="80%"
                          style={{ marginBottom: 6 }}
                        />
                      }
                      subheader={
                        <Skeleton animation="wave" height={10} width="40%" />
                      }
                    />
                    <CardContent>
                      <Skeleton
                        animation="wave"
                        height={10}
                        style={{ marginBottom: 6 }}
                      />
                      <Skeleton animation="wave" height={10} width="80%" />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            {pokemons.length > 0 &&
              pokemons.map(({ avatar, name }) => (
                <Grid key={name} xs={12} sm={6} md={4} xl={3}>
                  <Card>
                    <CardMedia component="img" image={avatar} alt={name} />
                    <CardHeader
                      title={name}
                      subheader="type (should visually look as a colored tag)"
                    />
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        the main pokemon stats (whichever additional pokemon
                        info you want to show)
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>

          {!isEmptyResult && (
            <TablePagination
              component="div"
              count={pokemonCount}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={rowsPerPageOptions}
              onRowsPerPageChange={handleChangeRowsPerPage}
              showFirstButton
              showLastButton
              labelRowsPerPage="Cards per page:"
            />
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default App;
