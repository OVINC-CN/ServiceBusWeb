import http from './index'

export const checkPermissionAPI = data => new Promise((resolve, reject) => {
  http.post('/iam/check/', data).then(res => resolve(res), err => reject(err));
});

export const checkSuperPermissionAPI = () => new Promise((resolve, reject) => {
  http.get('/iam/check/is_superuser/').then(res => resolve(res), err => reject(err));
});
