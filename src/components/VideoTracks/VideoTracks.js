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
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
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
  width: 650,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const VideoTracks = () => {
  const classes = useStyles();
  const [videoTracks, setVideoTracks] = useState(null);
  const [category, setCategory] = useState(null);
  const [videoModal, setVideoModal] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [editVideoModal, setEditVideoModal] = useState(false);
  const [createVideoModal, setCreateVideoModal] = useState(false);

  useEffect(async () => {
    const { data } = await axios.get(`${URL}/video/fetchall`);
    setVideoTracks(data);
    const result = await axios.get(`${URL}/category/fetchall`);
    setCategory(result.data);
  }, []);

  const deleteVideoHandler = async (id) => {
    if (window.confirm("Do you want to delete this video")) {
      const newVideoArray = videoTracks.filter((singleVideo) => {
        if (singleVideo._id !== id) return true;
        else return false;
      });
      setVideoTracks(newVideoArray);
      await axios.delete(`${URL}/video/delete/${id}`);
    }
  };
  const closeVideoModal = () => {
    setVideoModal(false);
  };
  const closeEditVideoModal = () => {
    setEditVideoModal(false);
  };
  const closeCreateVideoModal = () => {
    setCreateVideoModal(false);
  };

  return (
    <Layout>
      <Card className={classes.Card}>
        <div className={classes.Header}>
          <Typography variant="h5">Video Tracks</Typography>
          <ButtonGroup>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setCreateVideoModal(true)}
            >
              Create New
            </Button>
          </ButtonGroup>
        </div>
        {videoTracks === null ? (
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
              {videoTracks.map((video) => (
                <TableRow key={video._id}>
                  <TableCell component="th" scope="row" align="center">
                    {video.title}
                  </TableCell>
                  <TableCell align="center">
                    {video.description.substr(
                      0,
                      Math.min(20, video.description.length)
                    )}
                    ....
                  </TableCell>
                  <TableCell align="center">{video.category}</TableCell>
                  <TableCell align="center">
                    <ButtonGroup
                      variant="outlined"
                      style={{ marginBottom: "10px" }}
                    >
                      <PlayArrowIcon
                        color="primary"
                        className={classes.Icon}
                        onClick={() => {
                          setVideoModal(true);
                          setCurrentVideo(video);
                        }}
                      />
                      <EditIcon
                        color="primary"
                        className={classes.Icon}
                        onClick={() => {
                          setEditVideoModal(true);
                          setCurrentVideo(video);
                        }}
                      />
                      <DeleteIcon
                        color="error"
                        onClick={() => deleteVideoHandler(video._id)}
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

      {/* ---------------------video Modal--------------------------- */}
      <Modal
        open={videoModal}
        onClose={closeVideoModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <video controls src={`${URL}/video/${currentVideo?.video}`}></video>
        </Box>
      </Modal>
      {/* ---------------------Edit video details modal---------------- */}
      <Modal
        open={editVideoModal}
        onClose={closeEditVideoModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h5">Edit Video details</Typography>
        </Box>
      </Modal>
      {/* ---------------------Create video details modal---------------- */}
      <Modal
        open={createVideoModal}
        onClose={closeCreateVideoModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h5">Create the new Video</Typography>
        </Box>
      </Modal>
    </Layout>
  );
};

export default VideoTracks;
