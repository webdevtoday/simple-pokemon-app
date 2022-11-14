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

const sleep = (delay = 0) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

const App = () => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const loading = open && options.length === 0;

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      await sleep(1e3); // For demo purposes.

      if (active) {
        // TODO: SET AUTOCOMPLETE OPTIONS
        setOptions([]);
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

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
                options={[]}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Pokémon types"
                    placeholder="Pokémon types..."
                  />
                )}
                renderOption={(props, option, { inputValue }) => {
                  const matches = match(option.label, inputValue, {
                    insideWords: true,
                  });
                  const parts = parse(option.label, matches);

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
                getOptionLabel={(option) => option.label}
                sx={{ maxWidth: 500 }}
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
                sx={{ maxWidth: 300, width: "100%" }}
                open={open}
                onOpen={() => {
                  setOpen(true);
                }}
                onClose={() => {
                  setOpen(false);
                }}
                isOptionEqualToValue={(option, value) =>
                  option.label === value.label
                }
                getOptionLabel={(option) => option.label}
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
                  const matches = match(option.label, inputValue, {
                    insideWords: true,
                  });
                  const parts = parse(option.label, matches);

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
            count={100}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[10, 20, 50]}
            onRowsPerPageChange={handleChangeRowsPerPage}
            showFirstButton
            showLastButton
            labelRowsPerPage="Cards per page:"
          />

          <Grid container spacing={2}>
            {[...new Array(10)].map((v, i) => (
              <Grid key={i} xs={12} sm={6} md={4} xl={3}>
                <Card>
                  <CardMedia
                    component="img"
                    height="194"
                    image="https://assets.pokemon.com/assets/cms2/img/pokedex/detail/001.png"
                    alt="Bulbasaur"
                  />
                  <CardHeader
                    title="Pokemon Name"
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
            count={100}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[10, 20, 50]}
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
