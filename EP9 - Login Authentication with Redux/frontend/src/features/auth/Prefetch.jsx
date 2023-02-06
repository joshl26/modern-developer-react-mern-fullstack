import { store } from "../../app/store";
import { notesApiSlice } from "../notes/notesApiSlice";
import { usersApiSlice } from "../users/usersApiSlice";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import React from "react";

const Prefetch = () => {
  const notes = store.dispatch(notesApiSlice.endpoints.getNotes.initiate());
  const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate());

  useEffect(() => {
    console.log("subscribing");

    return () => {
      console.log("unsubscribing");
      notes.unsubscribe();
      users.unsubscribe();
    };
  }, [notes, users]);

  return <Outlet />;
};

export default Prefetch;
