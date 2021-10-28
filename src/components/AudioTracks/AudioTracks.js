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
  Box,
  Modal,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FilterAltSharpIcon from "@mui/icons-material/FilterAltSharp";
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
  width: 650,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const AudioTracks = () => {
  const classes = useStyles();
  const [audioTracks, setAudioTracks] = useState(null);
  const [audioModal, setAudioModal] = useState(false);
  const [category, setCategory] = useState(null);

  useEffect(async () => {
    const { data } = await axios.get(`${URL}/music/fetchall`);
    setAudioTracks(data);
    const result = await axios.get(`${URL}/category/fetchall`);
    setCategory(result.data);
  }, []);

  const deleteAudioHandler = async (id) => {
    if (window.confirm("Do you want to delete this video")) {
      const newAudioArray = audioTracks.filter((singleAudio) => {
        if (singleAudio._id !== id) return true;
        else return false;
      });
      setAudioTracks(newAudioArray);
      await axios.delete(`${URL}/music/delete/${id}`);
    }
  };
  const closeAudioModal = () => {
    setAudioModal(false);
  };

  return (
    <Layout>
      <Card className={classes.Card}>
        <div className={classes.Header}>
          <Typography variant="h5">Audio Tracks</Typography>
          <ButtonGroup>
            <CloudUploadIcon />
            <FilterAltSharpIcon />
          </ButtonGroup>
        </div>
        {audioTracks === null ? (
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
              {audioTracks.map((audio) => (
                <TableRow key={audio._id}>
                  <TableCell component="th" scope="row" align="center">
                    {audio.title}
                  </TableCell>
                  <TableCell align="center">
                    {audio.description.substr(
                      0,
                      Math.min(20, audio.description.length)
                    )}
                    ....
                  </TableCell>
                  <TableCell align="center">{audio.category}</TableCell>
                  <TableCell align="center">
                    <ButtonGroup
                      variant="outlined"
                      style={{ marginBottom: "10px" }}
                    >
                      <PlayArrowIcon
                        color="primary"
                        className={classes.Icon}
                        onClick={() => {
                          setAudioModal(true);
                        }}
                      />
                      <EditIcon color="primary" className={classes.Icon} />
                      <DeleteIcon
                        color="error"
                        onClick={() => deleteAudioHandler(audio._id)}
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

      {/* ---------------------Audio Modal--------------------------- */}
      <Modal
        open={audioModal}
        onClose={closeAudioModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <audio controls src={`${URL}/music/1635322244156.mp3`}></audio>
        </Box>
      </Modal>
    </Layout>
  );
};

export default AudioTracks;
