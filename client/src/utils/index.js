import axios from "axios";
import dotenv from "dotenv";
import { setPosts } from "../redux/postSlice";
// const cloudId = process.env.REACT_APP_CLOUDNARY_ID;

const APP_URL = " http://localhost:8008";

export const API = axios.create({
  baseURL: APP_URL,
  responseType: "json",
});

export const apiRequest = async ({ url, token, data, method }) => {
  try {
    const result = await API(url, {
      method: method || "GET",
      data: data || {},
      headers: {
        "content-type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return result?.data;
  } catch (error) {
    // console.log(error);
    // console.log(error.response.data);
    return {
      status: error.response.data.success,
      message: error.response.data.message,
    };
  }
};

export const handleFileUpload = async (uploadFile) => {
  // console.log(uploadFile);
  const formData = new FormData();
  formData.append("file", uploadFile);
  formData.append("upload_preset", "LinkUp");
  // console.log(formData);
  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/dzpmwlc9b/image/upload`,
      formData
    );
    // console.log(response);
    return response.data.secure_url;
  } catch (error) {
    console.log(error);
  }
};

export const fetchPosts = async (token, dispatch, uri, data) => {
  try {
    const res = await apiRequest({
      url: uri || "/posts",
      token: token,
      method: "POST",
      data: data || {},
    });
    dispatch(setPosts(res?.data));
    return;
  } catch (error) {
    console.log(error);
  }
};

export const likePost = async (uri, token) => {
  try {
    // console.log(uri);
    const res = await apiRequest({
      url: uri,
      token: token,
      method: "POST",
    });
    // console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = async (token, id) => {
  try {
    const res = await apiRequest({
      url: "/posts/" + id,
      token: token,
      method: "DELETE",
    });
    return;
  } catch (error) {
    console.log(error);
  }
};

export const getUserInfo = async (token, id) => {
  try {
    const uri = id === undefined ? "/users/get-user/" : "users/get-user/" + id;
    // console.log(uri, token);
    const res = await apiRequest({
      url: uri,
      token: token,
      method: "POST",
    });
    // console.log(res);
    if (res?.message == "Authentication failed") {
      localStorage.removeItem("user");
      window.alert("User Session Expired . Please Login Again");
      window.location.replace("/login");
    }
    return res?.user;
  } catch (error) {
    console.log(error);
  }
};

export const sendFriendRequest = async (token, id) => {
  try {
    const res = await apiRequest({
      url: "/users/friend-request",
      token: token,
      method: "POST",
      data: { requestTo: id },
    });
    return;
  } catch (error) {
    console.log(error);
  }
};

export const viewUserProfile = async (token, id) => {
  try {
    // console.log(token, id);
    const res = await apiRequest({
      url: "/users/profile-view",
      token: token,
      method: "POST",
      data: { id },
    });
    return;
  } catch (error) {
    console.log(error);
  }
};
