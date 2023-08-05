import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import GetAllSpots from './components/SpotsCRUD/GetAllSpots'
import CreateSpotForm from './components/Forms/CreateSpotForm'
import UpdateSpotForm from "./components/Forms/UpdateSpotForm";
import ManageSpots from './components/SpotsCRUD/manageSpots'
import SpotDetailsPage from "./components/SpotsCRUD/SpotDetails";
import GetAllUserSpots from "./components/SpotsCRUD/GetAllUserSpots";
import SpotsLandingPage from "./components/SpotsCRUD/SpotLandingPage";
// import CreateReview from "./components/Forms/CreateReviewForm";


function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  // const spotsData = useSelector(state => state.spots.allSpots)

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
    <Navigation isLoaded={isLoaded} />
    {isLoaded && (
      <Switch>
        <Route exact path="/">
          <SpotsLandingPage />
        </Route>
        <Route exact path="/spots/new">
          <CreateSpotForm />
        </Route>
        <Route exact path="/spots/all">
          <GetAllSpots />
        </Route>
        <Route exact path="/spots/current">
          <GetAllUserSpots />
        </Route>
        <Route exact path="/spots/manage"></Route>
        <Route exact path="/spots/:spotId/update" component={UpdateSpotForm} />
        <Route exact path="/spots/:spotId" component={SpotDetailsPage} />
      </Switch>
    )}
  </>
);
}

export default App;
