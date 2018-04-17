import axios from 'axios';
import jsonp from 'jsonp'

export function getBanner() {       //获取首页banner
  return axios.get('http://musicapi.leanapp.cn/banner')
    .then(function (response) {
      return response.data
    })
    .catch(function (error) {
      return error
    });
}

export function getRecList() {       //获取推荐歌单
  return axios.get('http://musicapi.leanapp.cn/personalized')
    .then(function (response) {
      return response.data
    })
    .catch(function (error) {
      return error
    });
}

