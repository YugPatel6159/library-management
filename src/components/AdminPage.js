import React, { useState } from "react";
import {
  Button,
  TextField,
  Paper,
  Grid,
  Typography,
  Container,
} from "@mui/material";
import axios from "axios";

const AdminPage = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [bookFile, setBookFile] = useState(null);


    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Creating FormData to handle file upload with other data
        const formData = new FormData();
        formData.append("title", title);
        formData.append("author", author);
        formData.append("genre", genre);
        formData.append("file_path", bookFile); // Assuming 'bookFile' is a file object from input type="file"
    
        axios.post("http://localhost:3000/all-books", formData, {
            headers: {
                // When using FormData, you don't manually set `Content-Type`, let the browser set it
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error("Error:", error.response ? error.response.data : "Unknown error");
        });
    
}
    

  return (
    <Container component="main" maxWidth="sm">
      <Paper style={{ padding: "20px", marginTop: "20px" }}>
        <Typography variant="h6" gutterBottom>
          Add New Book
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Author"
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Genre"
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="file"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) => setBookFile(e.target.files[0])}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                Add Book
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default AdminPage;
