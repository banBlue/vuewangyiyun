<template>
    <canvas width="30" height="30" ref="canvas" class="can"></canvas>
</template>

<script>
  const len = 30;
  const r = 15;
  export default {
    props: {
      pcurrentTime: {
        default: 0
      },
      pduration: {
        default: 0
      }
    },
    watch:{
      pcurrentTime() {
        this.drap()
      }
    },
    methods: {
      drap() {
        let content = this.$refs.canvas.getContext('2d');

        //首先清空画布
        content.clearRect(0, 0, len, len);
        content.save();

        content.beginPath();

        //偏移坐标系,旋转起始坐标点为12点钟
        content.translate(r,r);
        content.rotate( -90 / 180 * Math.PI);

        content.fillStyle = "#d43c33";

        //偏转的角度数,绘制扇形
        let endDeg = parseInt(this.pcurrentTime) * 360 / parseInt(this.pduration) / 180 * Math.PI;

        content.arc(0, 0, r, 0, endDeg);
        content.lineTo(0, 0);
        content.closePath();
        content.fill();
        content.restore()
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
</style>
