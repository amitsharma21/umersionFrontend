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
  Modal,
  Box,
  Button,
  TextField,
  MenuItem,
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

const GuidedMeditation = () => {
  const classes = useStyles();
  const [guidedMeditation, setGuidedMeditation] = useState(null);
  const [category, setCategory] = useState(null);
  const [createNewMeditation, setCreateNewMeditation] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: [],
    thumbnail: "",
    category: "",
  });

  useEffect(async () => {
    const { data } = await axios.get(`${URL}/guidedmeditation/fetchall`);
    setGuidedMeditation(data);
    const result = await axios.get(`${URL}/category/fetchall`);
    setCategory(result.data);
  }, []);

  const deleteGuidedMeditationHandler = async (id) => {
    if (window.confirm("Do you want to delete this Guided Meditation")) {
      const newArray = guidedMeditation.filter((single) => {
        if (single._id !== id) return true;
        else return false;
      });
      setGuidedMeditation(newArray);
      await axios.delete(`${URL}/guidedmeditation/delete/${id}`);
    }
  };
  const closeNewMeditationModal = () => {
    setCreateNewMeditation(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const reader = new FormData();
    reader.append("title", formData.title);
    reader.append("description", formData.description);
    reader.append("category", formData.category);
    reader.append("tags", formData.tags);
    reader.append("thumbnail", formData.thumbnail);
    const { data } = await axios.post(`${URL}/guidedmeditation/create`, reader);
    guidedMeditation.push(data);
    closeNewMeditationModal();
    setFormData({
      title: "",
      description: "",
      tags: [],
      thumbnail: "",
      category: "",
    });
  };

  return (
    <Layout>
      <Card className={classes.Card}>
        <div className={classes.Header}>
          <Typography variant="h5">Guided Meditation</Typography>
          <ButtonGroup>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setCreateNewMeditation(true)}
            >
              Create New
            </Button>
          </ButtonGroup>
        </div>
        {guidedMeditation === null ? (
          <CircularProgress />
        ) : (
          <Table className={classes.table} aria-label="users table">
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  <strong>Title</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Description</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Category</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {guidedMeditation.map((single) => (
                <TableRow key={single._id}>
                  <TableCell component="th" scope="row" align="center">
                    {single.title}
                  </TableCell>
                  <TableCell align="center">
                    {single.description.substr(
                      0,
                      Math.min(20, single.description.length)
                    )}
                    ....
                  </TableCell>
                  <TableCell align="center">{single.category}</TableCell>
                  <TableCell align="center">
                    <ButtonGroup
                      variant="outlined"
                      style={{ marginBottom: "10px" }}
                    >
                      <EditIcon color="primary" className={classes.Icon} />
                      <DeleteIcon
                        color="error"
                        onClick={() =>
                          deleteGuidedMeditationHandler(single._id)
                        }
                        title="delete"
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

      {/* ---------------------Create New Guided Meditation modal---------------- */}
      <Modal
        open={createNewMeditation}
        onClose={closeNewMeditationModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h5">Create New Guided Meditation</Typography>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
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
                select
                label="Category"
                value={formData.category}
                variant="outlined"
                fullWidth
                onChange={(e) => {
                  setFormData({ ...formData, category: e.target.value });
                }}
              >
                {category?.map((option) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.title}
                  </MenuItem>
                ))}
              </TextField>
            </div>
            <div className={classes.Input}>
              <label>thumbnail</label>
              <br />
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => {
                  setFormData({ ...formData, thumbnail: e.target.files[0] });
                }}
              />
            </div>
            <Button variant="contained" color="primary" type="submit">
              Create
            </Button>
          </form>
        </Box>
      </Modal>
    </Layout>
  );
};

export default GuidedMeditation;
