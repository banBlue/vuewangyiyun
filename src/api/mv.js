import axios from 'axios';

export function getRmv(page) {       //获取推荐MV
  return axios.get(`http://musicapi.leanapp.cn/mv/first?limit=${page}`)
    .then(function (response) {
      return response.data
    })
    .catch(function (error) {
      return error
    });
}

export function getDetailedsMv (id) {       //获取单条Mv信息
  return axios.get(`http://musicapi.leanapp.cn/mv?mvid=${id}`)
    .then(function (response) {
      return response.data
    })
    .catch(function (error) {
      return error
    });
}

