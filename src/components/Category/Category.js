import React, { useEffect, useState } from "react";

import {
  Card,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  ButtonGroup,
  Button,
  Modal,
  Box,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

import useStyles from "./styles";
import Layout from "../../UI/Layout/Layout";
import { URL } from "../../constants/url";

//these styels are for modals
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const VideoTracks = () => {
  const classes = useStyles();
  const [category, setCategory] = useState(null);
  const [createCategoryModal, setCreateCategoryModal] = useState(false);
  const [editCategoryModal, setEditCategoryModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [formData, setFormData] = useState({ title: "" });

  useEffect(async () => {
    const result = await axios.get(`${URL}/category/fetchall`);
    setCategory(result.data);
  }, []);

  const deleteCategoryHandler = async (id) => {
    if (
      window.confirm(
        "Deleting this category will result in deletion of All video tracks,audio tracks, and guided meditation that belong to given category"
      )
    ) {
      const newArray = category.filter((single) => {
        if (single._id !== id) return true;
        else return false;
      });
      setCategory(newArray);
      await axios.delete(`${URL}/category/delete/${id}`);
    }
  };

  const closeCreateCategoryModal = () => {
    setCreateCategoryModal(false);
  };

  const closeEditCategoryModal = () => {
    setEditCategoryModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await axios.post(`${URL}/category/create`, formData);
    category.push(data);
    setFormData({ title: "" });
    setCreateCategoryModal(false);
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    const { data } = await axios.patch(
      `${URL}/category/update/${currentCategory._id}`,
      formData
    );
    category.map((single) => {
      if (single._id === data._id) {
        single.title = data.title;
      }
    });
    setFormData({ title: "" });
    setEditCategoryModal(false);
    setCurrentCategory(null);
  };
  return (
    <Layout>
      <Card className={classes.Card}>
        <div className={classes.Header}>
          <Typography variant="h5">Categories</Typography>
          <ButtonGroup>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setCreateCategoryModal(true)}
            >
              Create New
            </Button>
          </ButtonGroup>
        </div>
        {category === null ? (
          <CircularProgress />
        ) : (
          <Table className={classes.table} aria-label="users table">
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  <strong>ID</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Name</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {category.map((single) => (
                <TableRow key={single._id}>
                  <TableCell component="th" scope="row" align="center">
                    {single._id}
                  </TableCell>
                  <TableCell align="center">{single.title}</TableCell>
                  <TableCell align="center">
                    <ButtonGroup
                      variant="outlined"
                      style={{ marginBottom: "10px" }}
                    >
                      <EditIcon
                        color="primary"
                        className={classes.Icon}
                        onClick={() => {
                          setEditCategoryModal(true);
                          setCurrentCategory(single);
                          setFormData({ title: single.title });
                        }}
                      />
                      <DeleteIcon
                        color="error"
                        title="delete"
                        className={classes.Icon}
                        onClick={() => deleteCategoryHandler(single._id)}
                      />
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* ---------------------Create Category Modal--------------------------- */}
      <Modal
        open={createCategoryModal}
        onClose={closeCreateCategoryModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h5">Create New Category</Typography>
          <div className={classes.Input}>
            <TextField
              required
              label="Category Name"
              value={formData.title}
              variant="outlined"
              fullWidth
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
              }}
            />
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            type="submit"
          >
            Create
          </Button>
        </Box>
      </Modal>

      {/* ---------------------Edit Category Modal--------------------------- */}
      <Modal
        open={editCategoryModal}
        onClose={closeEditCategoryModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h5">Edit Category Details</Typography>
          <div className={classes.Input}>
            <TextField
              required
              label="Category Name"
              value={formData.title}
              variant="outlined"
              fullWidth
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
              }}
            />
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitEdit}
            type="submit"
          >
            Edit
          </Button>
        </Box>
      </Modal>
    </Layout>
  );
};

export default VideoTracks;
