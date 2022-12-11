import http from './index'

export const checkPermissionAPI = data => new Promise((resolve, reject) => {
  http.post('/iam/check/', data).then(res => resolve(res), err => reject(err));
});

export const checkSuperPermissionAPI = () => new Promise((resolve, reject) => {
  http.get('/iam/check/is_superuser/').then(res => resolve(res), err => reject(err));
});

export const listActionAPI = (appCode, page, size) => new Promise((resolve, reject) => {
  http.get('/iam/action/', {params: {page, size, application_id: appCode}}).then(res => resolve(res), err => reject(err));
});

export const listActionAllAPI = (appCode) => new Promise((resolve, reject) => {
  http.get('/iam/action/all/', {params: {application_id: appCode}}).then(res => resolve(res), err => reject(err));
});

export const deleteActionAPI = (id) => new Promise((resolve, reject) => {
  http.delete(`/iam/action/${id}/`).then(res => resolve(res), err => reject(err));
});

export const editActionAPI = (data) => new Promise((resolve, reject) => {
  http.patch(`/iam/action/${data.id}/`, data).then(res => resolve(res), err => reject(err));
});

export const createActionAPI = (data) => new Promise((resolve, reject) => {
  http.post('/iam/action/', data).then(res => resolve(res), err => reject(err));
});

export const listInstanceAPI = (actionId, page, size) => new Promise((resolve, reject) => {
  http.get('/iam/instance/', {params: {action_id: actionId, page, size}}).then(res => resolve(res), err => reject(err));
});

export const listInstanceAllAPI = (actionId) => new Promise((resolve, reject) => {
  http.get('/iam/instance/all/', {params: {action_id: actionId}}).then(res => resolve(res), err => reject(err));
});

export const getUserPermissionAPI = (appCode, actionId, page, size) => new Promise((resolve, reject) => {
  http.get('/iam/user/', {params: {action_id: actionId, application_id: appCode, page, size}}).then(res => resolve(res), err => reject(err));
});

export const applyPermissionAPI = (data) => new Promise((resolve, reject) => {
  http.post('/iam/user/', data).then(res => resolve(res), err => reject(err));
});

export const editPermissionAPI = (permissionId, data) => new Promise((resolve, reject) => {
  http.patch(`/iam/user/${permissionId}/`, data).then(res => resolve(res), err => reject(err));
});

export const getManagePermissionAPI = (appCode, page, size) => new Promise((resolve, reject) => {
  http.get('/iam/manage/', {params: {application_id: appCode, page, size}}).then(res => resolve(res), err => reject(err));
});

export const dealManagePermissionAPI = (id, status) => new Promise((resolve, reject) => {
  http.post('/iam/manage/', {permission_id: id, status}).then(res => resolve(res), err => reject(err));
});
