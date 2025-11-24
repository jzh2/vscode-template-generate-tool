<template>
  <div class="preview-schema">
    <iframe v-if="dataReady" id="iframe" :src="website" @load="handleLoad()" />
  </div>
</template>

<script>
export default {
  name: 'PreviewSchema',
  data() {
    return {
      dataReady: true,
      iframe: null,
      website: 'http://172.18.163.52:30000/saas-industry/#/preview-schema'
    }
  },
  destroyed() {
    window.removeEventListener('message', this.handleMessage)
  },
  methods: {
    handleLoad() {
      this.iframe = document.getElementById('iframe')
      window.addEventListener('message', this.handleMessage)
    },
    handleMessage({ data }) {
      switch (data.command) {
        case 'previewSchema':
          this.iframe.contentWindow.postMessage(data, this.website)
          break
        case 'refreshSchema':
          this.refreshIframe()
          break
        default:
          break
      }
    },
    refreshIframe() {
      this.dataReady = false
      this.$nextTick(() => {
        this.dataReady = true
      })
    }
  }
}
</script>

<style>
.light {
  color: #000;
  background-color: #fff;
}
.dark {
  color: #ccc;
  background-color: #1f1f1f;
}
</style>

<style lang="scss" scoped>
.preview-schema {
  height: 100%;
  margin: 0 10px;
  iframe {
    width: 100%;
    height: 850px;
    border-color: transparent;
  }
}
</style>
