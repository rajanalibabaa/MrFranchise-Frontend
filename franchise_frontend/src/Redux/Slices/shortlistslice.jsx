import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../Api/api';
import { userId,token } from '../../Utils/autherId';

export const fetchShortlist = createAsyncThunk(
  'shortlist/fetchShortlist',
  async () => {
    const response = await axios.get(`${API_BASE_URL}/shortList/getShortListedById`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
);