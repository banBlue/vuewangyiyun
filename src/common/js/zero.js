export function zero(time) {
  let cur = parseInt(time);//秒数
  let temp = cur;
  let minute = parseInt(temp / 60);
  if (cur % 60 < 10) {
    return "" + minute + ":0" + cur % 60 + "";
  } else {
    return "" + minute + ":" + cur % 60 + "";
  }
}
