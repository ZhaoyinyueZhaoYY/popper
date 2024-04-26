<template>
  <div class="ui-popper" v-if="visible">
    <div class="ui-popper-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { createPopper } from '@popperjs/core';
// import { getScrollParents } from '@/lib/util';
import { addScrollListener, removeScrollListener} from './scroll-event.js';
const defaultMaxHeight = 300;
const defaultMaxWidth = document.body.getBoundingClientRect().width;

const sameWidth = {
  name: 'sameWidth',
  enabled: true,
  phase: 'beforeRead',
  requires: ['computeStyles'],
  fn: ({ state, name, options }) => {
    const referenceRect = state.elements.reference.getBoundingClientRect();
    const bodyRect = document.body.getBoundingClientRect();

    let maxHeight = defaultMaxHeight;

    const referenceBottom = bodyRect.height - referenceRect.bottom;
    if (referenceBottom >= defaultMaxHeight) {
      maxHeight = defaultMaxHeight;
    } else {
      if (referenceRect.top >= defaultMaxHeight) {
        maxHeight = defaultMaxHeight;
      } else {
        maxHeight = Math.max(referenceRect.top, referenceBottom);
      }
    }

    state.options.vueNode.maxHeight = maxHeight;
    state.styles.popper.maxHeight = `${maxHeight}px`;
    state.elements.popper.style.maxHeight = `${maxHeight}px`;
    state.rects.popper.height = state.elements.popper.getBoundingClientRect().height;

    if (!state.options.vueNode.isOpen) {
      state.styles.popper.visibility = 'visible';
      state.options.vueNode.isOpen = true;
      state.options.vueNode.$emit('opened');
    }
    state.options.vueNode.$emit('resize');
  },
  effect: ({ state }) => {
    state.elements.popper.style.minWidth = `${state.elements.reference.offsetWidth}px`;
    let maxWidth = defaultMaxWidth;
    // let curWidth = state.elements.popper.offsetWidth;
    let refWidth = state.elements.reference.offsetWidth;
    const referenceRect = state.elements.reference.getBoundingClientRect();
    const bodyRect = document.body.getBoundingClientRect();

    let rightWidth = document.body.clientWidth - referenceRect.left - bodyRect.left;

    if (refWidth > defaultMaxWidth) {
      maxWidth = refWidth;
    }
    state.elements.popper.style.maxWidth = `${maxWidth}px`;
  }
};

export default {
  name: 'Cap4Popper',
  componentName: 'Cap4Popper',
  props: {
    // popper 显示的依赖dom
    reference: {},
    // 显示位置
    placement: {
      // 'auto'
      // 'auto-start'
      // 'auto-end'
      // 'top'
      // 'top-start'
      // 'top-end'
      // 'bottom'
      // 'bottom-start'
      // 'bottom-end'
      // 'right'
      // 'right-start'
      // 'right-end'
      // 'left'
      // 'left-start'
      // 'left-end';
      type: String,
      default: 'bottom'
    },
    visible: Boolean
  },
  computed: {},
  data() {
    return {
      maxHeight: defaultMaxHeight,
      isOpen: false
    };
  },
  watch: {
    visible() {
      if (this.visible) {
        // this.scrollParents = getScrollParents(this.reference);
        // this.scrollFun = () => {
        //   this.updatePopper();
        // };
        // this.scrollParents.forEach((ele) => {
        //   ele.addEventListener('scroll', this.scrollFun);
        // });
        this.$el && document.body.appendChild(this.$el);
        this.$nextTick(() => {
          this.createPopper();
        });
        addScrollListener(this.scrollFun);
      } else {
        this.$emit('beforeClose');
        this.isOpen = false;
        // this.scrollParents.forEach((ele) => {
        //   ele.removeEventListener('scroll', this.scrollFun);
        // });
        if (this.$el && this.$el.parentNode) {
          this.$el.parentNode.removeChild(this.$el);
        }
        this.maxHeight = defaultMaxHeight;
        this.destroyPopper();
        this.$nextTick(() => {
          this.$emit('closed');
        });
        removeScrollListener(this.scrollFun);
      }
    }
  },
  methods: {
    scrollFun () {
      this.updatePopper();
    },
    createPopper() {
      this.$emit('beforeOpen');
      this.popper = createPopper(this.reference, this.$el, {
        placement: this.placement,
        strategy: 'fixed',
        vueNode: this,
        modifiers: [
          // maxSize,
          // applyMaxSize,

          {
            name: 'eventListeners',
            options: {
              resize: true,
              scroll: false
            }
          },
          {
            name: 'offset',
            options: {
              offset: [0, 0]
            }
          },
          {
            name: 'preventOverflow',
            options: {
              rootBoundary: 'viewport'
            }
          },
          {
            name: 'flip',
            options: {
              fallbackPlacements: ['bottom-start', 'top-start'],
              rootBoundary: 'viewport'
            }
          },
          sameWidth
        ]
      });
    },
    updatePopper() {
      this.popper && this.popper.update();
    },
    destroyPopper() {
      this.popper && this.popper.destroy();
    }
  },
  created() {},
  mounted() {
    if (this.visible) {
      this.scrollParents = getScrollParents(this.reference);
      this.scrollFun = () => {
        this.updatePopper();
      };
      this.scrollParents.forEach((ele) => {
        ele.addEventListener('scroll', this.scrollFun);
      });
      this.$el && document.body.appendChild(this.$el);
      this.createPopper();
    }
  },
  beforeDestroy() {},
  destroyed() {
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
    this.destroyPopper();
  }
};
</script>

<style lang="scss" scoped>
.ui-popper {
  z-index: 9999;
  padding-top: 4px;
  left: 0;
  top: 0;
  position: fixed;
  max-height: 300px;
  overflow: visible !important;
  background: #f3f3f3;
  .ui-popper-content {
    overflow: auto;
    width: 100%;
    height: 100%;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    background: #ffffff;
    border-radius: 2px;
    overscroll-behavior: contain;
  }
}
</style>
