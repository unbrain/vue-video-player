<template>
  <div class="progress-wrap" @mousedown="dragProcess($event)" ref="progress">
    <div class="progress" :style="progressStyle" ref="progressWrap">
      <div class="current-progress" :style="progress">
        <div :style="ballStyle" class="ball"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    progressOptions: {
      type: Object,
      required: true,
      default: () => ({
        height: 100,
        borderRadius: 2,
        vertical: true,
        width: 4,
      }),
    },
    percent: {
      type: [String, Number],
      required: false,
      default: 0,
    },
  },
  data() {
    return {
      clientReact: {},
      modifyNum: 0,
      isDragProcess: false,
    };
  },
  mounted() {
    this.handleEvent();
  },
  methods: {
    dragProcess(e) {
      let currentNum;
      if (this.progressOptions.vertical) {
        currentNum = this.$refs.progressWrap.getClientRects()[0].bottom - e.clientY;
        currentNum =
          currentNum > 0
            ? currentNum > this.$refs.progressWrap.clientHeight
              ? this.$refs.progressWrap.clientHeight
              : currentNum
            : 0;
        this.modifyNum = currentNum / this.$refs.progressWrap.clientHeight;
      } else {
        currentNum = e.screenX - this.$refs.progressWrap.getClientRects()[0].x;
        currentNum =
          currentNum > 0
            ? currentNum > this.$refs.progressWrap.clientWidth
              ? this.$refs.progressWrap.clientWidth
              : currentNum
            : 0;
        this.modifyNum = currentNum / this.$refs.progressWrap.clientWidth;
      }
      this.isDragProcess = true;
      this.$emit('drag', this.modifyNum);
    },
    handleEvent() {
      document.addEventListener('mouseup', () => {
        this.isDragProcess = false;
      });
    },
  },
  computed: {
    ballStyle() {
      let styleObj = {
        width: `${this.progressOptions.height * 2}px`,
        height: `${this.progressOptions.height * 2}px`,
        right: `-${this.progressOptions.height}px`,
        top: `-${this.progressOptions.height / 2}px`,
      };
      if (this.progressOptions.vertical) {
        styleObj = {
          width: `${this.progressOptions.width * 2}px`,
          height: `${this.progressOptions.width * 2}px`,
          right: `-${this.progressOptions.width / 2}px`,
          top: `-${this.progressOptions.width / 2}px`,
        };
      }
      return styleObj;
    },
    progress() {
      if (this.percent && this.progressOptions.vertical) {
        return {
          width: `4px`,
          height: `${this.percent * 100}%`,
        };
      } else if (this.percent) {
        return {
          width: `${Number(this.percent) * 100}%`,
        };
      } else {
        return 0;
      }
    },
    progressStyle() {
      let styleObj = {
        width: `${this.progressOptions.width}px`,
        height: `${this.progressOptions.height}px`,
        borderRadius: `${this.progressOptions.borderRadius}px`,
      };
      if (this.progressOptions.vertical) {
        styleObj['justify-content'] = `center`;
        styleObj['align-items'] = `flex-end`;
      }
      return styleObj;
    },
  },
  watch: {
    isDragProcess(v) {
      if (v === true) {
        document.addEventListener('mousemove', this.dragProcess);
      } else if (v === false) {
        document.removeEventListener('mousemove', this.dragProcess);
      }
    },
  },
};
</script>

<style lang="less">
.progress-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  .progress {
    display: flex;
    flex-grow: 1;
    background: rgba(200, 200, 200, 0.3);
    .current-progress {
      position: relative;
      background: #ff9900;
      border-radius: inherit;
      .ball {
        position: absolute;
        border-radius: 50%;
        background: #ff9900;
        opacity: 0;
      }
    }
    &:hover {
      .ball {
        opacity: 1;
        transition: 0.3s;
      }
    }
  }
}
</style>
