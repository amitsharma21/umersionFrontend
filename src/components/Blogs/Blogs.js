import React, { useState, useEffect } from "react";

import {
  Card,
  Typography,
  TextField,
  ButtonGroup,
  Button,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Modal,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useHistory } from "react-router-dom";

import Layout from "../../UI/Layout/Layout";
import useStyles from "./styles";
import { URL } from "../../constants/url";

//these styels are for modals
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 650,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const Blogs = () => {
  const classes = useStyles();
  const history = useHistory();
  const [blogs, setBlogs] = useState(null);
  const [createBlogModal, setCreateBlogModal] = useState(false);
  const [editBlogModal, setEditBlogModal] = useState(false);
  const [currentBlogId, setCurrentBlogId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    image: "",
  });

  useEffect(async () => {
    const { data } = await axios.get(`${URL}/blog/fetchall`);
    setBlogs(data);
  }, []);

  const deleteBlogHandler = async (id) => {
    if (window.confirm("Do you want to delete this Blog")) {
      const newBlogsArray = blogs.filter((singleBlog) => {
        if (singleBlog._id !== id) return true;
        else return false;
      });
      setBlogs(newBlogsArray);
      await axios.delete(`${URL}/blog/delete/${id}`);
    }
  };

  const createBlog = async (e) => {
    e.preventDefault();
    const reader = new FormData();
    reader.append("title", formData.title);
    reader.append("description", formData.description);
    reader.append("tags", formData.tags);
    reader.append("blogImage", formData.image);
    const { data } = await axios.post(`${URL}/blog/create`, reader);
    blogs.push(data);
    closeCreateBlogModal();
    setFormData({
      title: "",
      description: "",
      tags: "",
      image: "",
    });
  };

  const editBlog = async (e) => {
    e.preventDefault();
    const reader = new FormData();
    reader.append("title", formData.title);
    reader.append("description", formData.description);
    reader.append("tags", formData.tags);
    reader.append("blogImage", formData.image);
    const { data } = await axios.patch(
      `${URL}/blog/update/${currentBlogId}`,
      reader
    );
    for (let i = 0; i < blogs.length; i++) {
      if (blogs[i]._id === currentBlogId) {
        blogs[i] = formData;
      }
    }
    closeEditBlogModal();
  };

  const editConfigHandler = (blog) => {
    setCurrentBlogId(blog._id);
    setFormData({ ...blog });
    setEditBlogModal(true);
  };

  const closeCreateBlogModal = () => {
    setCreateBlogModal(false);
  };

  const closeEditBlogModal = () => {
    setEditBlogModal(false);
    setFormData({
      title: "",
      description: "",
      tags: "",
      image: "",
    });
    setCurrentBlogId(null);
  };

  return (
    <Layout>
      <Card className={classes.Card}>
        <div className={classes.Header}>
          <Typography variant="h5">Blogs</Typography>
          <ButtonGroup>
            <Button
              variant="contained"
              color="primary"
              // onClick={() => setCreateBlogModal(true)}
              onClick={() => history.push("/dashboard/blog/create")}
            >
              Create New
            </Button>
          </ButtonGroup>
        </div>
        {blogs === null ? (
          <CircularProgress />
        ) : (
          <Table className={classes.table} aria-label="users table">
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  <strong>Id</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Title</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Description</strong>
                </TableCell>

                <TableCell align="center">
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {blogs.map((blog) => (
                <TableRow key={blog._id}>
                  <TableCell component="th" scope="row" align="center">
                    {blog._id}
                  </TableCell>
                  <TableCell align="center">
                    {blog.title.substr(0, Math.min(20, blog.title.length))}
                    ....
                  </TableCell>
                  <TableCell align="center">
                    {" "}
                    {blog.description.substr(
                      0,
                      Math.min(20, blog.description.length)
                    )}
                    ....
                  </TableCell>
                  <TableCell align="center">
                    <ButtonGroup
                      variant="outlined"
                      style={{ marginBottom: "10px" }}
                    >
                      <EditIcon
                        color="primary"
                        className={classes.Icon}
                        onClick={() => editConfigHandler(blog)}
                      />
                      <DeleteIcon
                        color="error"
                        onClick={() => deleteBlogHandler(blog._id)}
                        className={classes.Icon}
                      />
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* ---------------------Create Blog modal---------------- */}
      <Modal
        open={createBlogModal}
        onClose={closeCreateBlogModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h5">Create New Blog </Typography>
          <form onSubmit={createBlog} encType="multipart/form-data">
            <div className={classes.Input}>
              <TextField
                required
                label="Title"
                value={formData.title}
                variant="outlined"
                fullWidth
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                }}
              />
            </div>
            <div className={classes.Input}>
              <TextField
                required
                label="Description"
                value={formData.description}
                variant="outlined"
                fullWidth
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                }}
              />
            </div>
            <div className={classes.Input}>
              <TextField
                required
                label="Tags"
                value={formData.tags}
                variant="outlined"
                fullWidth
                onChange={(e) => {
                  setFormData({ ...formData, tags: e.target.value });
                }}
              />
            </div>
            <div className={classes.Input}>
              <label>Image</label>
              <br />
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => {
                  setFormData({ ...formData, image: e.target.files[0] });
                }}
              />
            </div>
            <Button variant="contained" color="primary" type="submit">
              Create
            </Button>
          </form>
        </Box>
      </Modal>

      {/* ---------------------Edit Blog modal---------------- */}
      <Modal
        open={editBlogModal}
        onClose={closeEditBlogModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h5">Edit Blog </Typography>
          <form onSubmit={editBlog} encType="multipart/form-data">
            <div className={classes.Input}>
              <TextField
                required
                label="Title"
                value={formData.title}
                variant="outlined"
                fullWidth
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                }}
              />
            </div>
            <div className={classes.Input}>
              <TextField
                required
                label="Description"
                value={formData.description}
                variant="outlined"
                fullWidth
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                }}
              />
            </div>
            <div className={classes.Input}>
              <TextField
                required
                label="Tags"
                value={formData.tags}
                variant="outlined"
                fullWidth
                onChange={(e) => {
                  setFormData({ ...formData, tags: e.target.value });
                }}
              />
            </div>
            <div className={classes.Input}>
              <label>Image</label>
              <br />
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => {
                  setFormData({ ...formData, image: e.target.files[0] });
                }}
              />
            </div>
            <Button variant="contained" color="primary" type="submit">
              Update
            </Button>
          </form>
        </Box>
      </Modal>
    </Layout>
  );
};

export default Blogs;
