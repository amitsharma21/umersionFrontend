import React, { useEffect } from "react";

import { CircularProgress, Button, Card, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import Faq from "./Faq/Faq";
import useStyles from "./styles";
import { fetchAllFaq } from "../../actions/faq";
import Layout from "../../UI/Layout/Layout";

const Faqs = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const isLoading = useSelector((state) => state.loading.loading);
  const faqs = useSelector((state) => state.faqs.faqs);

  useEffect(() => {
    dispatch(fetchAllFaq());
  }, []);
  const addFaq = () => {
    history.push("/dashboard/faq/add");
  };

  return (
    <Layout>
      <Card className={classes.Card}>
        <Typography variant="h5"> Frequently Asked Questions</Typography>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <>
            {faqs.map((faq) => (
              <Faq
                question={faq.question}
                answer={faq.answer}
                key={faq._id}
                id={faq._id}
              />
            ))}
            <div className={classes.ButtonDiv}>
              <Button onClick={addFaq} variant="contained" color="primary">
                Add New FAQ
              </Button>
            </div>
          </>
        )}
      </Card>
    </Layout>
  );
};

export default Faqs;
