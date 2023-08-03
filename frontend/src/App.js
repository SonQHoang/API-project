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
      {isLoaded && <Switch></Switch>}
      <Switch>
        <Route exact path="/spots/new"><CreateSpotForm /></Route>
        <Route exact path="/spots/all"><GetAllSpots /></Route>
        <Route exact path="/spots/manage" component={ManageSpots}></Route>
        <Route exact path="/spots/:spotId/update" component={UpdateSpotForm}></Route>
        <Route exact path="/spots/:spotId" component={SpotDetailsPage}></Route>
      </Switch>
    </>
  );
}

export default App;
