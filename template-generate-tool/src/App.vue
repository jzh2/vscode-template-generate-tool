<template>
  <div id="app" class="dark">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="表单" name="form">
        <FormGenerator ref="formGenerator" @changeTemplate="changeTemplate" />
      </el-tab-pane>
      <el-tab-pane label="表格" name="table">
        <TableGenerator ref="tableGenerator" @changeTemplate="changeTemplate" />
      </el-tab-pane>
      <el-tab-pane label="API" name="api">
        <ApiGenerator ref="apiGenerator" />
      </el-tab-pane>
      <el-tab-pane label="设置" name="settings">
        <GlobalSettings
          ref="globalSettings"
          @changeGlobalSettings="changeGlobalSettings"
          @changeTemplate="changeTemplate"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import FormGenerator from './views/FormGenerator.vue'
import TableGenerator from './views/TableGenerator.vue'
import ApiGenerator from './views/ApiGenerator.vue'
import GlobalSettings from './views/GlobalSettings.vue'

export default {
  components: {
    FormGenerator,
    TableGenerator,
    ApiGenerator,
    GlobalSettings
  },
  data() {
    return {
      activeName: 'settings'
    }
  },
  created() {
    window.addEventListener('message', e => {
      if (e?.data?.activeName) {
        this.activeName = e.data.activeName
      }
    })
  },
  methods: {
    changeGlobalSettings() {
      this.$refs.formGenerator.getSettings()
      this.$refs.tableGenerator.getSettings()
      this.$refs.apiGenerator.getSettings()
    },
    changeTemplate() {
      this.$refs.formGenerator.getTemplate()
      this.$refs.tableGenerator.getTemplate()
      this.$refs.globalSettings.getTemplate()
    }
  }
}
</script>

<style>
#app {
  height: 100%;
}

.light {
  color: #000;
  background-color: #fff;
}

.dark {
  color: #ccc;
  background-color: #1f1f1f;
}

nav {
  padding: 30px;
  text-align: center;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.el-tab-pane {
  padding: 0 10px;
}

.el-cascader-menu__wrap {
  height: 300px;
}
</style>
