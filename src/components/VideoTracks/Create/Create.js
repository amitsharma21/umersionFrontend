import React, { useEffect, useState } from "react";

import {
  Card,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
} from "@mui/material";
import axios from "axios";
import { useHistory } from "react-router-dom";

import Layout from "../../../UI/Layout/Layout";
import useStyles from "./styles";
import { URL } from "../../../constants/url";

function Create() {
  const classes = useStyles();
  const history = useHistory();
  const [videoFileUploadedSuccessfully, setVideoFileUploadedSuccessfully] =
    useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [
    thumbnailFileUploadedSuccessfully,
    setThumbnailFileUploadedSuccessfully,
  ] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoFileLoading, setVideoFileLoading] = useState(false);
  const [thumbnailFileLoading, setThumbnailFileLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [renderLoading, setRenderLoading] = useState(true);
  const [categories, setCategories] = useState(null);
  const [subCategories, setSubCategories] = useState(null);
  const [goodSubCategories, setGoodSubCategories] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    premium: "",
    category: "",
    subCategory: "",
    video: "",
    thumbnail: "",
  });

  useEffect(async () => {
    let result = await axios.get(`${URL}/videocategory/fetchall`);
    setCategories(result.data);
    result = await axios.get(`${URL}/videosubcategory/fetchall`);
    setSubCategories(result.data);
    setRenderLoading(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setVideoLoading(true);
    try {
      await axios.post(`${URL}/video/create`, formData);
      history.replace("/dashboard/videotracks");
      alert("Video Created Successfully");
    } catch (error) {
      alert(error.message);
    }
    setVideoLoading(false);
  };

  const uploadVideoFile = () => {
    setVideoFileLoading(true);
    // const FileData = new FormData();
    // FileData.append("demo file", file, file.name);
    // axios
    //   .post(
    //     "https://71xwinhfsf.execute-api.ap-south-1.amazonaws.com/prod/file-upload",
    //     FormData
    //   )
    //   .then((data) => {
    //     setLoading(false);
    //     console.log(data);

    //   });
    setTimeout(() => {
      setVideoFileLoading(false);
      setVideoFileUploadedSuccessfully(true);
      setVideoFile(null);
    }, 2000);
  };

  const uploadThumbnailFile = () => {
    setThumbnailFileLoading(true);
    // const FileData = new FormData();
    // FileData.append("demo file", file, file.name);
    // axios
    //   .post(
    //     "https://71xwinhfsf.execute-api.ap-south-1.amazonaws.com/prod/file-upload",
    //     FormData
    //   )
    //   .then((data) => {
    //     setLoading(false);
    //     console.log(data);

    //   });
    setTimeout(() => {
      setThumbnailFileLoading(false);
      setThumbnailFileUploadedSuccessfully(true);
      setThumbnailFile(null);
    }, 2000);
  };

  return (
    <Layout>
      <Card className={classes.Card}>
        <div className={classes.Header}>
          <Typography variant="h5">Add Video Track</Typography>
        </div>
        {renderLoading ? (
          <CircularProgress />
        ) : (
          <div className={classes.Body}>
            <div className={classes.Form}>
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className={classes.Input}>
                  <TextField
                    required
                    label="Video Name"
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
                    label="Video Description"
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
                    label="Video Tags"
                    value={formData.tags}
                    variant="outlined"
                    fullWidth
                    onChange={(e) => {
                      setFormData({ ...formData, tags: e.target.value });
                    }}
                  />
                </div>
                <div className={classes.Input}>
                  <FormControl fullWidth>
                    <InputLabel>Video Category</InputLabel>
                    <Select
                      label="Video category"
                      value={formData.category}
                      required
                      onChange={(e) => {
                        setFormData({ ...formData, category: e.target.value });
                        setSelectedCategory(e.target.value);
                        const newArray = subCategories.filter((value) => {
                          if (value.categoryId === e.target.value) return true;
                          else return false;
                        });
                        setGoodSubCategories(newArray);
                      }}
                    >
                      {categories.map((category) => (
                        <MenuItem value={category._id} key={category._id}>
                          {category.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div className={classes.Input}>
                  <FormControl fullWidth>
                    <InputLabel>Video SubCategory</InputLabel>
                    <Select
                      required
                      label="Video Subcategory"
                      value={formData.subCategory}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          subCategory: e.target.value,
                        });
                      }}
                      disabled={selectedCategory === null}
                    >
                      {goodSubCategories?.map((subCategory) => (
                        <MenuItem value={subCategory._id} key={subCategory._id}>
                          {subCategory.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                <div className={classes.FileInput}>
                  <input
                    type="file"
                    accept="video/*"
                    required
                    disabled={videoFileUploadedSuccessfully}
                    onChange={(e) => {
                      setVideoFile({ file: e.target.files[0] });
                      setFormData({
                        ...formData,
                        video: e.target.files[0].name,
                      });
                    }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={
                      videoFile === null ||
                      videoFileUploadedSuccessfully === true
                    }
                    onClick={uploadVideoFile}
                  >
                    {videoFileLoading ? (
                      <CircularProgress color="inherit" />
                    ) : (
                      "Upload Video"
                    )}
                  </Button>
                </div>
                <div className={classes.FileInput}>
                  <input
                    type="file"
                    accept="image/*"
                    required
                    disabled={thumbnailFileUploadedSuccessfully}
                    onChange={(e) => {
                      setThumbnailFile({ file: e.target.files[0] });
                      setFormData({
                        ...formData,
                        thumbnail: e.target.files[0].name,
                      });
                    }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={
                      thumbnailFile === null ||
                      thumbnailFileUploadedSuccessfully === true
                    }
                    onClick={uploadThumbnailFile}
                  >
                    {thumbnailFileLoading ? (
                      <CircularProgress color="inherit" />
                    ) : (
                      "Upload Thumbnail"
                    )}
                  </Button>
                </div>

                <div className={classes.Input}>
                  <FormControl fullWidth>
                    <InputLabel>Video Pricing</InputLabel>
                    <Select
                      required
                      label="Video Pricing"
                      value={formData.premium}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          premium: e.target.value,
                        });
                      }}
                    >
                      <MenuItem value={false}>Free</MenuItem>
                      <MenuItem value={true}>Premium</MenuItem>
                    </Select>
                  </FormControl>
                </div>

                <div className={classes.Button}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={
                      videoFileUploadedSuccessfully === false ||
                      thumbnailFileUploadedSuccessfully === false
                    }
                  >
                    {videoLoading ? (
                      <CircularProgress color="inherit" />
                    ) : (
                      "Add Video"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </Card>
    </Layout>
  );
}

export default Create;
