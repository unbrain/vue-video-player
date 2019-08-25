<template>
  <div class="video-container" v-if="showVideo" v-on:keyup.esc="cancelFullScreen">
    <div class="controls" ref="videoPlayer" id="player">
      <div class="wc-controls">
        <button class="wc-play" @click="play" v-if="showPlay">播放</button>
        <button class="wc-pause" @click="pause" v-else>暂停</button>
        <button class="wc-full" @click="fullScreen" v-if="showFullScreen">全屏</button>
        <button class="wc-cancelFull" @click="cancelFullScreen" v-else>取消全屏</button>
        <progress-bar
          class="progress-bar"
          :progressOptions="{ height: 4, borderRadius: 2 }"
          :percent="currentTimePercent"
          @drag="modifyTime"
        >
        </progress-bar>
        {{ showTime }}
        <div class="wc-volume">
          <div>音量</div>
          <progress-bar
            class="volume-progress-bar"
            :progressOptions="{ height: 100, borderRadius: 2, vertical: true, width: 4 }"
            :percent="currentVolume"
            @drag="modifyVolume"
          >
          </progress-bar>
        </div>
      </div>
      <video :src="videoOptions.src" ref="videoTag" :style="videoArea"></video>
      <!-- <div
        class="hideBar"
        v-show="showTimeBar"
      >
        <div
          class="hideBarDetail"
          :style="progress"
        ></div>
      </div> -->
    </div>
  </div>
</template>

<script>
import progressBar from './progressBar';
export default {
  components: { progressBar },
  props: {
    videoOptions: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showVideo: false,
      showPlay: true,
      showFullScreen: true,
      FullscreenApi: {},
      full: undefined,
      video: null,
      videoPlayer: null,
      isDragProcess: false,
      showTimeBar: false,
      currentTime: 0,
      videoTime: 0,
      videoVolume: 0,
      showTimeBarTimer: null,
      wrapX: 0,
    };
  },
  computed: {
    currentVolume() {
      return this.videoVolume;
    },
    currentTimePercent() {
      if (this.videoTime) {
        return this.currentTime / this.videoTime;
      } else {
        return 0;
      }
    },
    showTime() {
      return `${this.timeFormate(this.currentTime)} / ${this.timeFormate(this.videoTime)}`;
    },
    videoArea() {
      if (!this.showFullScreen) {
        return false;
      }
      return {
        // height: `${+this.videoOptions.size[0]}px`,
        // width: `${+this.videoOptions.size[1]}px`,
        // paddingBottom: `2px`
      };
    },
  },
  created() {
    this.getFullScreenApi();
  },
  mounted() {
    this.handleEvent();
    this.videoPlayer = this.$refs.videoPlayer;
    this.showVideo = true;
    this.$nextTick(() => {
      this.video = this.$refs.videoTag;
      this.videoVolume = this.video.volume;
      this.video.addEventListener('loadeddata', () => {
        this.videoTime = this.video.duration;
      });
      this.video.addEventListener('timeupdate', () => {
        this.currentTime = this.video.currentTime; //获取当前播放时间
      });
      document.addEventListener(this.FullscreenApi.fullscreenchange, this.exitHandler);
    });
  },
  methods: {
    modifyVolume(newVolume) {
      this.videoVolume = newVolume;
      this.video.volume = newVolume;
    },
    modifyTime(newTimePercent) {
      this.video.currentTime = newTimePercent * this.videoTime;
    },
    handleEvent() {
      document.addEventListener('mouseup', () => {
        this.isDragProcess = false;
      });
      document.addEventListener('mousemove', this.handleHideBar);
    },
    timeFormate(time) {
      let ct = Math.floor(time);
      let s = ct % 60;
      s = s >= 10 ? s : '0' + s;
      let m = Math.floor(ct / 60);
      m = m >= 10 ? m : '0' + m;
      return `${m}:${s}`;
    },
    handleHideBar() {
      this.showTimeBar = true;
      clearTimeout(this.showTimeBarTimer);
      setTimeout(() => {
        this.showTimeBar = false;
      }, 3000);
    },
    getFullScreenApi() {
      let apiMap = [
        [
          'requestFullscreen',
          'exitFullscreen',
          'fullscreenElement',
          'fullscreenEnabled',
          'fullscreenchange',
          'fullscreenerror',
        ],
        // WebKit
        [
          'webkitRequestFullscreen',
          'webkitExitFullscreen',
          'webkitFullscreenElement',
          'webkitFullscreenEnabled',
          'webkitfullscreenchange',
          'webkitfullscreenerror',
        ],
        // Old WebKit (Safari 5.1)
        [
          'webkitRequestFullScreen',
          'webkitCancelFullScreen',
          'webkitCurrentFullScreenElement',
          'webkitCancelFullScreen',
          'webkitfullscreenchange',
          'webkitfullscreenerror',
        ],
        // Mozilla
        [
          'mozRequestFullScreen',
          'mozCancelFullScreen',
          'mozFullScreenElement',
          'mozFullScreenEnabled',
          'mozfullscreenchange',
          'mozfullscreenerror',
        ],
        // Microsoft
        [
          'msRequestFullscreen',
          'msExitFullscreen',
          'msFullscreenElement',
          'msFullscreenEnabled',
          'MSFullscreenChange',
          'MSFullscreenError',
        ],
      ];
      var document_1 = document;
      let specApi = apiMap[0];
      let browserApi = void 0;
      // determine the supported set of functions
      for (let i = 0; i < apiMap.length; i++) {
        // check for exitFullscreen function
        if (apiMap[i][1] in document_1) {
          browserApi = apiMap[i];
          break;
        }
      }
      // map the browser API names to the spec API names
      if (browserApi) {
        for (let _i = 0; _i < browserApi.length; _i++) {
          this.FullscreenApi[specApi[_i]] = browserApi[_i];
        }
      }
    },
    play() {
      let playPromise = this.video.play();
      //播放的 promise 容错处理
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          this.pause();
          return;
        });
      }
      this.showPlay = false;
    },
    pause() {
      this.video.pause();
      this.showPlay = true;
    },
    getfullscreen(option = true) {
      let root = document.documentElement;
      if (option) {
        return root[this.FullscreenApi.requestFullscreen];
      } else {
        root = document;
        return root[this.FullscreenApi.exitFullscreen];
      }
    },
    fullScreen() {
      document.documentElement[this.FullscreenApi.requestFullscreen].call(this.$refs.videoPlayer);
      this.showFullScreen = false;
    },
    cancelFullScreen() {
      document[this.FullscreenApi.exitFullscreen].call(document);
      this.showFullScreen = true;
    },
    exitHandler() {
      if (!document[this.FullscreenApi.fullscreenElement]) {
        this.showFullScreen = true;
      }
    },
  },
};
</script>

<style lang="less" scoped>
html:-ms-fullscreen {
  width: 100%;
}
.video-container {
  ::-webkit-media-controls {
    display: none !important;
  }
  .controls {
    position: relative;
    max-width: 1024px;
    max-height: 670px;
    background-color: black;
    video {
      width: 100%;
      height: 100%;
    }
    .wc-controls {
      display: flex;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 2em;
      visibility: visible;
      color: aliceblue;
    }
    .hideBar {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      visibility: visible;
      width: 100%;
      height: 4px;
    }
    .hideBarDetail {
      width: 0%;
      height: 4px;
      background-color: #ff9900;
    }
    .wc-volume {
      position: relative;
      width: 50px;
      .volume-progress-bar {
        position: absolute;
        left: 0;
        top: -100px;
        width: 10px;
        height: 100px;
      }
    }
    .progress-bar {
      flex-grow: 1;
      height: 100%;
    }
  }
}
</style>
