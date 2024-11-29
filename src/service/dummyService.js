// src/redux/actions/dataActions.js
import { showLoader, hideLoader } from './loaderActions';

export const fetchData = () => {
  return async (dispatch) => {
    dispatch(showLoader());

    try {
      const response = await fetch('https://api.example.com/data');
      const data = await response.json();

      // Handle the data...
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      dispatch(hideLoader());
    }
  };
};
