import React, { useState } from "react";

import { Card, Typography, TextField } from "@mui/material";

import Layout from "../../../UI/Layout/Layout";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import useStyles from "./styles";

function Create() {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    body: "<p></p>",
    image: "",
  });

  const handleSubmit = () => {};

  return (
    <Layout>
      <Card className={classes.Card}>
        <div className={classes.Header}>
          <Typography variant="h5">Add Blog</Typography>
        </div>
        <div className={classes.Body}>
          <div className={classes.Form}>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className={classes.Input}>
                <TextField
                  required
                  label="Blog Title"
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
                  label="Blog Description"
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
                  label="Blog Tags"
                  value={formData.tags}
                  variant="outlined"
                  fullWidth
                  onChange={(e) => {
                    setFormData({ ...formData, tags: e.target.value });
                  }}
                />
              </div>
              <div className={classes.Input}>
                <CKEditor
                  editor={ClassicEditor}
                  data={formData.body}
                  onChange={(event, editor) => {
                    setFormData({ ...formData, body: editor.getData() });
                  }}
                />
              </div>
              <div className={classes.Input}></div>
            </form>
          </div>
        </div>
      </Card>
    </Layout>
  );
}

export default Create;
