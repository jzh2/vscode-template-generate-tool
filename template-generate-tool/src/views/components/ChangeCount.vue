<template>
  <div>
    <el-radio-group
      v-if="!simpleMode"
      v-model="count"
      style="margin-right: 20px"
      @change="$emit('changeCount', count)"
    >
      <el-radio-button v-for="n in 8" :key="n" :label="n">
        {{ n }}
      </el-radio-button>
    </el-radio-group>
    <el-input-number
      v-model="count"
      :min="0"
      :max="50"
      style="margin-right: 20px"
      @change="$emit('changeCount', count)"
    />
    <el-button @click="$emit('resetList')">重置</el-button>
  </div>
</template>

<script>
export default {
  name: 'ChangeCount',
  props: {
    itemCount: {
      type: Number,
      default: 0
    },
    simpleMode: Boolean
  },
  data() {
    return {
      count: 0
    }
  },
  watch: {
    itemCount: {
      immediate: true,
      handler() {
        this.count = this.itemCount
      }
    }
  }
}
</script>
