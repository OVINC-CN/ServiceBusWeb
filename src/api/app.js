import http from './index'

export const listAppAPI = (page, size) => new Promise((resolve, reject) => {
  http.get(`/application/?page=${page}&size=${size}`).then(res => resolve(res), err => reject(err));
});

export const listAllAppAPI = (params) => new Promise((resolve, reject) => {
  http.get(`/application/all/`, {params}).then(res => resolve(res), err => reject(err));
});

export const editAppAPI = (app_code, data) => new Promise((resolve, reject) => {
  http.patch(`/application/${app_code}/`, data).then(res => resolve(res), err => reject(err));
});

export const createAppAPI = data => new Promise((resolve, reject) => {
  http.post(`/application/`, data).then(res => resolve(res), err => reject(err));
});

