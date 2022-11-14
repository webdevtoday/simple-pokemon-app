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
  CircularProgress,
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
  const [pokemons, setPokemons] = useState([]);
  useEffect(() => {
    P.getTypesList().then(({ results }) => {
      setPokemonTypes(results.map(({ name }) => ({ type: name })));
    });
    P.getPokemonsList().then(({ results, count }) => {
      setPokemonNames(results.map(({ name }) => ({ name })));
      setPokemonCount(count);
    });
  }, []);
  useEffect(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    P.getPokemonByName(
      pokemonNames.slice(startIndex, endIndex).map(({ name }) => name)
    ).then((result) =>
      setPokemons(
        result.map(({ name, sprites, types, stats }) => ({
          name,
          avatar:
            sprites.other.home.front_default ??
            sprites.other["official-artwork"].front_default,
          types,
          stats,
        }))
      )
    );
  }, [page, rowsPerPage, pokemonNames]);

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const loading = open && options.length === 0;
  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      if (active) {
        setOptions(pokemonNames);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

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
                open={open}
                onOpen={() => {
                  setOpen(true);
                }}
                onClose={() => {
                  setOpen(false);
                }}
                isOptionEqualToValue={(option, value) =>
                  option.name === value.name
                }
                getOptionLabel={(option) => option.name}
                options={options}
                loading={loading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Pokémon name"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
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

          <Grid container spacing={2}>
            {pokemons.map(({ avatar, name }) => (
              <Grid key={name} xs={12} sm={6} md={4} xl={3}>
                <Card>
                  <CardMedia component="img" image={avatar} alt={name} />
                  <CardHeader
                    title={name}
                    subheader="type (should visually look as a colored tag)"
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      the main pokemon stats (whichever additional pokemon info
                      you want to show)
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

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
        </Box>
      </Container>
    </Box>
  );
};

export default App;
