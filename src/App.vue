<template>
  <div id="app">
    <light-video
      :videoOptions="{ src: 'https://vjs.zencdn.net/v/oceans.mp4', size: [500, 500] }"
      @hide="vcShow = false"
    >
    </light-video>
  </div>
</template>

<script>
import lightVideo from './components/video';

export default {
  name: 'app',
  components: {
    lightVideo,
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
