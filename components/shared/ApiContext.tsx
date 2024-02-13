"use client";
import React, { createContext, useContext, useReducer } from "react";

// Define initial state and actions (if needed)
const initialState = {
  data: null,
  loading: false,
  error: null,
};

const actionTypes = {
  FETCH_START: "FETCH_START",
  FETCH_SUCCESS: "FETCH_SUCCESS",
  FETCH_ERROR: "FETCH_ERROR",
};

// Create a reducer function to handle state changes
const reducer = (state: any, action: { type: any; payload: any }) => {
  switch (action.type) {
    case actionTypes.FETCH_START:
      return { ...state, loading: true, error: null };
    case actionTypes.FETCH_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case actionTypes.FETCH_ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// Create the context and provider
const ApiContext = createContext<any>(null);

const ApiProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Define a function to make API requests
  const fetchData = async (url: string | URL | any) => {
    dispatch({
      type: actionTypes.FETCH_START,
      payload: undefined,
    });
    try {
      const response = await fetch(url);
      const data = await response.json();
      dispatch({ type: actionTypes.FETCH_SUCCESS, payload: data });
    } catch (error: any) {
      dispatch({ type: actionTypes.FETCH_ERROR, payload: error.message });
    }
  };

  return (
    <ApiContext.Provider value={{ ...state, fetchData }}>
      {children}
    </ApiContext.Provider>
  );
};

export { ApiProvider, ApiContext };
