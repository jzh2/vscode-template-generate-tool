<template>
  <div class="star-website">
    <div class="title">
      <i class="el-icon-back icon" @click="onBack()"></i>
      <i class="el-icon-right icon" @click="onForward()"></i>
      <i
        class="icon"
        :class="isStar ? 'el-icon-star-on' : 'el-icon-star-off'"
        :style="isStar ? 'color:#ffc20d' : ''"
        @click="changeStar()"
      ></i>
      <el-autocomplete
        v-model="website"
        style="width: 100%"
        placeholder="请选择或输入网站"
        :fetch-suggestions="querySearch"
        @select="website2 = website"
        @change="website2 = website"
      />
    </div>
    <iframe id="iframe" :src="website2" />
  </div>
</template>

<script>
export default {
  name: 'StarWebsite',
  data() {
    return {
      website: '',
      website2: '',
      starWebsite: [
        // {
        //   value: '' // el-autocomplete需要，不能是字符串数组
        // }
      ]
    }
  },
  computed: {
    isStar() {
      return this.starWebsite.find(item => item.value === this.website)
    }
  },
  created() {
    const starWebsite = JSON.parse(
      localStorage.getItem('@bs/template-generate-tool/starWebsite')
    )
    if (starWebsite) {
      this.starWebsite = starWebsite
      const length = starWebsite.length
      if (length) {
        this.website = starWebsite[length - 1].value
        this.website2 = this.website
      }
    }
  },
  mounted() {
    const globalSettings = JSON.parse(
      localStorage.getItem('@bs/template-generate-tool/globalSettings')
    )
    if (globalSettings) {
      const element = document.getElementsByClassName('star-website')[0]
      if (globalSettings.darkMode) {
        element.classList.remove('light')
        element.classList.add('dark')
      } else {
        element.classList.remove('dark')
        element.classList.add('light')
      }
    }
  },
  methods: {
    changeStar() {
      const index = this.starWebsite.findIndex(
        item => item.value === this.website
      )
      if (index !== -1) {
        this.starWebsite.splice(index, 1)
        this.$tip.success('取消收藏成功')
      } else {
        this.starWebsite.push({
          value: this.website
        })
        this.$tip.success('收藏成功')
      }
      localStorage.setItem(
        '@bs/template-generate-tool/starWebsite',
        JSON.stringify(this.starWebsite)
      )
    },
    querySearch(queryString, cb) {
      const results = queryString
        ? this.starWebsite.filter(item => {
            return item.value.indexOf(queryString) === 0
          })
        : this.starWebsite
      cb(results)
    },
    onBack() {
      window.history.back()
    },
    onForward() {
      window.history.forward()
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
.star-website {
  height: 100%;
  margin: 0 10px;
  .title {
    display: flex;
    padding: 10px 0;
    .icon {
      line-height: 28px;
      margin-right: 5px;
    }
  }
  iframe {
    width: 100%;
    height: 850px;
    border-color: transparent;
  }
}
</style>
