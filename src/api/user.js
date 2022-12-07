import http from './index';

export const getUserInfoAPI = () => new Promise((resolve, reject) => {
  http.get('/account/user_info/').then(res => resolve(res), err => reject(err));
});

export const signInAPI = data => new Promise((resolve, reject) => {
  http.post('/account/sign_in/', data).then(res => resolve(res), err => reject(err));
});

export const signUpAPI = data => new Promise((resolve, reject) => {
  http.post('/account/sign_up/', data).then(res => resolve(res), err => reject(err));
});

export const listUserPropertyAPI = () => new Promise((resolve, reject) => {
  http.get('/account/user_property/').then(res => resolve(res), err => reject(err));
});

export const signOutAPI = () => new Promise((resolve, reject) => {
  http.get('/account/sign_out/').then(res => resolve(res), err => reject(err));
});

export const savePropertyAPI = properties => new Promise((resolve, reject) => {
  http.post('/account/user_property/', properties).then(res => resolve(res), err => reject(err));
});

export const searchUserAPI = keyword => new Promise((resolve, reject) => {
  http.get(`/account/user_search/?keyword=${keyword}`).then(res => resolve(res), err => reject(err));
});
