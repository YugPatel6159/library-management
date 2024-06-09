import axios from "axios";
import React, { useEffect, useState } from "react";

// Assume that the books (digital copy of books) are already in the system, to
// implement.
//  Registered users can search, access and download books anytime.
//  Design and implement secure communication between client and
// server when user searching, accessing and downloading books.
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Grid,
  Container,
  AppBar,
  Toolbar,
  InputBase,
  IconButton,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  useEffect(() => {
    axios
      .get("http://localhost:3000/all-books")
      
      .then((response) => {
        setBooks(response.data.data);
      })
      .catch((error) => console.error("Error fetching books:", error));
  }, []);

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Book Library</Typography>
          <div
            style={{ flexGrow: 1, display: "flex", justifyContent: "center" }}
          >
            <div
              style={{
                display: "flex",
                position: "relative",
                borderRadius: "4px",
                backgroundColor: "rgba(255,255,255,0.15)",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.25)" },
              }}
            >
              <InputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                sx={{ color: "inherit", width: "100%", ml: 1 }}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                }}
              />
              <IconButton
                type="submit"
                sx={{ p: "10px", color: "white" }}
                aria-label="search"
              >
                <SearchIcon />
              </IconButton>
            </div>
          </div>
        </Toolbar>
      </AppBar>
      <Container style={{ marginTop: "20px" }}>
        <Grid container spacing={3}>
          {books
            .filter((book) =>
              book.title.toLowerCase().includes(searchValue.toLowerCase())
            )
            .map((book) => (
              <Grid item xs={12} sm={6} md={4} key={book.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" component="h2">
                      {book.title}
                    </Typography>
                    <Typography color="textSecondary">
                      by {book.author}
                    </Typography>
                    <Typography variant="body2" component="p">
                      Genre: {book.genre}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      href={`http://localhost:3000/${book.file_path}`} // Ensure this path matches your static file serving setup
                      target="_blank"
                    >
                      View
                    </Button>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() =>
                        (window.location.href = `http://localhost:3000/download/${book.file_path}`)
                      }
                    >
                      Download
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Container>
    </div>
  );
};
export default HomePage;
