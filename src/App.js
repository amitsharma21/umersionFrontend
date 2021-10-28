import React from "react";

import { Grid } from "@material-ui/core";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import Auth from "./components/Auth/Auth";
import ToolBar from "./components/Navigation/ToolBar/ToolBar";
import SideBar from "./components/Navigation/SideBar/SideBar";
import TermsConditions from "./components/TermsConditions/TermsConditions";
import PrivacyPolicy from "./components/PrivacyPolicy/PrivacyPolicy";
import Coupons from "./components/Coupons/Coupons";
import Users from "./components/Users/Users";
import User from "./components/Users/User/User";
import Faqs from "./components/Faqs/Faqs";
import AddFaq from "./components/Faqs/AddFaq/AddFaq";
import EditFaq from "./components/Faqs/EditFaq/EditFaq";
import AudioTracks from "./components/AudioTracks/AudioTracks";
import VideoTracks from "./components/VideoTracks/VideoTracks";
import Category from "./components/Category/Category";
import GuidedMeditation from "./components/GuidedMeditation/GuidedMeditation";

function App() {
  const user = JSON.parse(localStorage.getItem("profile"));
  let routes = (
    <Switch>
      <Route path="/" exact component={Auth} />

      <Route component={() => <Redirect to="/" />} />
    </Switch>
  );
  if (user) {
    routes = (
      <>
        <ToolBar />
        <SideBar />

        <Route
          path="/"
          exact
          component={() => <Redirect to="/dashboard/users" />}
        />
        <Switch>
          <Route path="/dashboard/users" exact component={Users} />
          <Route path="/dashboard/user/:id" exact component={User} />
          <Route path="/dashboard/faq" exact component={Faqs} />
          <Route path="/dashboard/faq/add" exact component={AddFaq} />
          <Route path="/dashboard/faq/edit/:id" exact component={EditFaq} />
          <Route path="/dashboard/tac" exact component={TermsConditions} />
          <Route
            path="/dashboard/privacypolicy"
            exact
            component={PrivacyPolicy}
          />
          <Route path="/dashboard/audiotracks" exact component={AudioTracks} />
          <Route path="/dashboard/videotracks" exact component={VideoTracks} />
          <Route path="/dashboard/category" exact component={Category} />
          <Route
            path="/dashboard/guidedmeditation"
            exact
            component={GuidedMeditation}
          />
          <Route path="/dashboard/coupons" exact component={Coupons} />
        </Switch>
      </>
    );
  }
  return (
    <BrowserRouter>
      <Grid container>{routes}</Grid>
      {/* <div style={{ display: "flex", flexDirection: "row" }}>{routes}</div> */}
    </BrowserRouter>
  );
}

export default App;
