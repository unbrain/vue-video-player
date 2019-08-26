<template>
  <div class="video-container" v-if="showVideo" v-on:keyup.esc="cancelFullScreen">
    <div class="controls" ref="videoPlayer" id="player">
      <video
        :src="videoOptions.src"
        ref="videoTag"
        :style="videoArea"
        @click="handleClickPlay"
      ></video>
      <div class="wc-controls" v-show="showControls">
        <div @click.stop="handleClickPlay">
          <hover-item :name="playButton"></hover-item>
        </div>
        <progress-bar
          class="progress-bar"
          :progressOptions="{ height: 4, borderRadius: 2 }"
          :percent="currentTimePercent"
          @drag="modifyTime"
        >
        </progress-bar>
        <div class="show-time">{{ showTime }}</div>
        <div class="wc-volume" ref="volumeButton">
          <div @click.stop="handleClickVolume">
            <hover-item :name="volumeButton"></hover-item>
          </div>
          <progress-bar
            class="volume-progress-bar"
            :progressOptions="{ height: 100, borderRadius: 2, vertical: true, width: 4 }"
            :percent="currentVolume"
            @drag="modifyVolume"
            v-show="volumeHover"
          >
          </progress-bar>
        </div>
        <div @click.stop="handleClickFullscreen">
          <hover-item :name="fullScreenButton"></hover-item>
        </div>
      </div>
      <div class="hideBar" v-show="!showControls">
        <div class="hideBarDetail" :style="hideProgressBar"></div>
      </div>
    </div>
  </div>
</template>

<script>
import hoverItem from './hover-item';
import progressBar from './progressBar';
export default {
  components: { progressBar, hoverItem },
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
      showControls: false,
      currentTime: 0,
      videoTime: 0,
      videoVolume: 0,
      videoMemoryVolume: 0,
      volumeHover: false,
      hideVolumeBarTimer: null,
      showTimeBarTimer: null,
      wrapX: 0,
      volumeButton: 'volume',
      playButton: 'play',
      fullScreenButton: 'fullscreen',
    };
  },
  computed: {
    hideProgressBar() {
      return {
        width: `${this.currentTimePercent * 100}%`,
      };
    },
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
      this.videoHandle();
    });
  },
  methods: {
    videoHandle() {
      this.$refs.videoPlayer.addEventListener('mousemove', () => {
        this.showControls = true;
        clearTimeout(this.showControlsTimer);
        this.showControlsTimer = setTimeout(() => {
          this.showControls = false;
        }, 3000);
      });
      this.video.addEventListener('loadeddata', () => {
        this.videoTime = this.video.duration;
      });
      this.video.addEventListener('timeupdate', () => {
        this.currentTime = this.video.currentTime; //获取当前播放时间
      });
      this.video.addEventListener('volumechange', () => {
        this.videoVolume = this.video.volume;
      });
      this.video.addEventListener('ended', () => {
        this.video.currentTime = this.video.duration;
        this.playButton = 'replay';
      });
      // this.video.addEventListener('error', e => {});
      this.$refs.volumeButton.addEventListener('mouseenter', () => {
        this.volumeHover = true;
      });
      this.$refs.volumeButton.addEventListener('mouseleave', () => {
        if (this.volumeHover) {
          clearTimeout(this.hideVolumeBarTimer);
          this.hideVolumeBarTimer = setTimeout(() => {
            this.volumeHover = false;
          }, 500);
        }
      });
      document.addEventListener(this.FullscreenApi.fullscreenchange, this.exitHandler);
    },
    handleClickVolume() {
      if (this.video.volume !== 0) {
        this.videoMemoryVolume = this.video.volume;
        this.video.volume = 0;
        this.volumeButton = 'volume-x';
      } else {
        this.video.volume = this.videoMemoryVolume;
        this.volumeButton = 'volume';
      }
    },
    handleClickPlay() {
      if (this.playButton === 'play' || this.playButton === 'replay') {
        let playPromise = this.video.play();
        //播放的 promise 容错处理
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            this.video.pause();
            return;
          });
        }
        this.playButton = 'stop';
      } else {
        this.video.pause();
        this.playButton = 'play';
      }
    },
    handleClickFullscreen() {
      if (this.fullScreenButton === 'fullscreen') {
        this.fullScreen();
        this.fullScreenButton = 'fullscreenexit';
      } else {
        this.cancelFullScreen();
        this.fullScreenButton = 'fullscreen';
      }
    },
    modifyVolume(newVolume) {
      this.videoVolume = newVolume;
      this.video.volume = newVolume;
    },
    modifyTime(newTimePercent) {
      this.currentTime = newTimePercent * this.videoTime;
      this.video.currentTime = newTimePercent * this.videoTime;
    },
    handleEvent() {
      document.addEventListener('mouseup', () => {
        this.isDragProcess = false;
      });
      document.addEventListener('mousemove', this.handleMouseMove);
    },
    timeFormate(time) {
      let ct = Math.floor(time);
      let s = ct % 60;
      s = s >= 10 ? s : '0' + s;
      let m = Math.floor(ct / 60);
      m = m >= 10 ? m : '0' + m;
      return `${m}:${s}`;
    },
    handleMouseMove() {
      this.showTimeBar = true;
      clearTimeout(this.showTimeBarTimer);
      this.showTimeBarTimer = setTimeout(() => {
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
    background-color: rgb(197, 195, 195);
    video {
      width: 100%;
      height: 100%;
    }
    .show-time {
      display: flex;
      align-items: center;
      padding: 0 20px 0 10px;
    }
    .wc-controls {
      display: flex;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 2em;
      background-color: #000;
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
      min-width: 0;
      min-height: 0;
      .volume-progress-bar {
        position: absolute;
        left: 50%;
        top: -110px;
        padding: 5px;
        background-color: #000;
        transform: translateX(-50%);
      }
    }
    .progress-bar {
      flex-grow: 1;
      height: 100%;
      padding: 0 10px;
    }
  }
}
</style>
