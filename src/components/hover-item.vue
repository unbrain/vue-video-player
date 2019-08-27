<template>
  <div>
    <svg class="icon hover-item" :class="name" :aria-hidden="true">
      <use :xlink:href="'#icon-' + name"></use>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'hover-item',
  props: ['name'],
  mounted() {
    if (document.getElementById('my-icon')) return;
    var scriptTag = document.createElement('script');
    scriptTag.src = '//at.alicdn.com/t/font_1369087_oodq4p7irro.js';
    scriptTag.id = 'my-icon';
    document.getElementsByTagName('head')[0].appendChild(scriptTag);
  },
};
</script>

<style scoped="scoped" lang="less">
.icon {
  width: 2em;
  height: 2em;
  vertical-align: -0.15em;
  fill: #fff;
  overflow: hidden;
}
.hover-item {
  &:hover {
    cursor: pointer;
  }
  &.play {
    &:hover {
      fill: #ff9900;
    }
  }
  &.stop {
    &:hover {
      fill: #ff9900;
    }
  }
  &.fullscreen {
    &:hover {
      fill: #ff9900;
    }
  }
  &.fullscreenexit {
    &:hover {
      fill: #ff9900;
    }
  }
  &.volume-x {
    &:hover {
      fill: #ff9900;
    }
  }
  &.volume {
    &:hover {
      fill: #ff9900;
    }
  }
  &.replay {
    &:hover {
      fill: #ff9900;
    }
  }
}
</style>
