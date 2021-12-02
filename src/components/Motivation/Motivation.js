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
  const [motivations, setMotivations] = useState(null);
  const [createMotivationModal, setCreateMotivationModal] = useState(false);
  const [editMotivationModal, setEditMotivationModal] = useState(false);
  const [currentMotivationId, setCurrentMotivationId] = useState(null);
  const [formData, setFormData] = useState({
    quote: "",
    image: "",
  });

  useEffect(async () => {
    const { data } = await axios.get(`${URL}/motivation/fetchall`);
    setMotivations(data);
  }, []);

  const deleteMotivationHandler = async (id) => {
    if (window.confirm("Do you want to delete this Motivation")) {
      const newMotivationsArray = motivations.filter((singleMotivation) => {
        if (singleMotivation._id !== id) return true;
        else return false;
      });
      setMotivations(newMotivationsArray);
      await axios.delete(`${URL}/motivation/delete/${id}`);
    }
  };

  const createMotivation = async (e) => {
    e.preventDefault();
    const reader = new FormData();
    reader.append("quote", formData.quote);
    reader.append("motivationImage", formData.image);
    const { data } = await axios.post(`${URL}/motivation/create`, reader);
    motivations.push(data);
    closeCreateMotivationModal();
    setFormData({
      title: "",
      image: "",
    });
  };

  const editMotivation = async (e) => {
    e.preventDefault();
    const reader = new FormData();
    reader.append("quote", formData.quote);
    reader.append("motivationImage", formData.image);
    const { data } = await axios.patch(
      `${URL}/motivation/update/${currentMotivationId}`,
      reader
    );
    for (let i = 0; i < motivations.length; i++) {
      if (motivations[i]._id === currentMotivationId) {
        motivations[i] = formData;
      }
    }
    closeEditMotivationModal();
  };

  const editConfigHandler = (motivation) => {
    setCurrentMotivationId(motivation._id);
    setFormData({ ...motivation });
    setEditMotivationModal(true);
  };

  const closeCreateMotivationModal = () => {
    setCreateMotivationModal(false);
  };

  const closeEditMotivationModal = () => {
    setEditMotivationModal(false);
    setFormData({
      quote: "",
      image: "",
    });
    setCurrentMotivationId(null);
  };

  return (
    <Layout>
      <Card className={classes.Card}>
        <div className={classes.Header}>
          <Typography variant="h5">Motivation</Typography>
          <ButtonGroup>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setCreateMotivationModal(true)}
            >
              Create New
            </Button>
          </ButtonGroup>
        </div>
        {motivations === null ? (
          <CircularProgress />
        ) : (
          <Table className={classes.table} aria-label="users table">
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  <strong>Id</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Quote</strong>
                </TableCell>

                <TableCell align="center">
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {motivations.map((motivation) => (
                <TableRow key={motivation._id}>
                  <TableCell component="th" scope="row" align="center">
                    {motivation._id}
                  </TableCell>
                  <TableCell align="center">
                    {motivation.quote.substr(
                      0,
                      Math.min(20, motivation.quote.length)
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
                        onClick={() => editConfigHandler(motivation)}
                      />
                      <DeleteIcon
                        color="error"
                        onClick={() => deleteMotivationHandler(motivation._id)}
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

      {/* ---------------------Create Motivation modal---------------- */}
      <Modal
        open={createMotivationModal}
        onClose={closeCreateMotivationModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h5">Create New Motivation </Typography>
          <form onSubmit={createMotivation} encType="multipart/form-data">
            <div className={classes.Input}>
              <TextField
                required
                label="Quote"
                value={formData.quote}
                variant="outlined"
                fullWidth
                onChange={(e) => {
                  setFormData({ ...formData, quote: e.target.value });
                }}
              />
            </div>

            <div className={classes.Input}>
              <label>
                <strong>Image</strong>
              </label>
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

      {/* ---------------------Edit Motivation modal---------------- */}
      <Modal
        open={editMotivationModal}
        onClose={closeEditMotivationModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h5">Edit Motivation </Typography>
          <form onSubmit={editMotivation} encType="multipart/form-data">
            <div className={classes.Input}>
              <TextField
                required
                label="Quote"
                value={formData.quote}
                variant="outlined"
                fullWidth
                onChange={(e) => {
                  setFormData({ ...formData, quote: e.target.value });
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
