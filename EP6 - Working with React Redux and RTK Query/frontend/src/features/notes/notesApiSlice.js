import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { buildQueryLifecycleHandler } from "@reduxjs/toolkit/dist/query/core/buildMiddleware/queryLifecycle";

import { apiSlice } from "../../app/api/apiSlice";

const notesAdapter = createEntityAdapter({});

const initialState = notesAdapter.getInitialState();

//Keepunuseddata should be approx 60sec when the app is deployed
export const notesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotes: builder.query({
      query: () => "./notes",
      validateStatus: (response, result) => {
        return response.status === 2000 && !result.isError;
      },
      keepUnusedDataFor: 5,
      transformResponse: (responseData) => {
        const loadedNotes = responseData.map((note) => {
          note.id = note._id;
          return note;
        });
        return notesAdapter.setAll(initialState, loadedNotes);
      },
      providesTags: (result, error, arg) => {
        if (!result?.ids) {
          return [
            { type: "Note", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Note", id })),
          ];
        } else return [{ type: "Note", id: "LIST" }];
      },
    }),
  }),
});

export const { useGetNotesQuery } = notesApiSlice;

//returns the query result object
export const selectNotesResult = notesApiSlice.endpoints.getNotes.select();

//creates memoized selector
const selectNotesData = createSelector(
  selectNotesResult,
  (notesResult) => notesResult.data //normalized state object with ids and entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllNotes,
  selectById: selectNotesById,
  selectIds: selectNoteIds,
} = notesAdapter.getSelectors(
  (state) => selectNotesData(state) ?? initialState
);
