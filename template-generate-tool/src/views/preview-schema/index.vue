<template>
  <div class="preview-schema">
    <iframe v-if="website" id="previewSchemaIframe" :src="website" />
  </div>
</template>

<script>
const DEFAULT_WEBSITE =
  'http://172.18.163.52:30000/saas-industry/#/preview-schema'

export default {
  name: 'PreviewSchema',
  data() {
    return {
      website: DEFAULT_WEBSITE
    }
  },
  created() {
    window.addEventListener('message', this.handleMessage)
  },
  destroyed() {
    window.removeEventListener('message', this.handleMessage)
  },
  methods: {
    handleMessage({ data }) {
      switch (data.command) {
        case 'previewSchema': {
          this.website = data.website || DEFAULT_WEBSITE
          const iframeElement = document.getElementById('previewSchemaIframe')
          iframeElement.contentWindow.postMessage(data, this.website)
          break
        }
        case 'refreshSchema':
          this.refreshIframe()
          break
        case 'saveSchema': {
          const iframeElement = document.getElementById('previewSchemaIframe')
          iframeElement.contentWindow.postMessage(data, this.website)
          break
        }
        default:
          break
      }
    },
    refreshIframe() {
      const website = this.website
      this.website = ''
      this.$nextTick(() => {
        this.website = website
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
