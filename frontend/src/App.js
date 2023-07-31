import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import CreateSpotForm from './components/Forms/CreateSpotForm'
import ManageSpots from './components/SpotsCRUD/manageSpots'
import GetAllSpots from './components/SpotsCRUD/GetAllSpots'

import { getAllSpots } from '../src/store/spots'

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  const spotsData = useSelector(state => state.spots.allSpots)

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));

    dispatch(getAllSpots())
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Switch></Switch>}
      <Switch>
        <Route exact path="/spots/new">
          <CreateSpotForm />
        </Route>
        <Route path="/spots/manage" component={ManageSpots}>
        </Route>
        <Route exact path="/spots/all">
          <GetAllSpots spots={spotsData}/>
        </Route>
      </Switch>
    </>
  );
}

export default App;
