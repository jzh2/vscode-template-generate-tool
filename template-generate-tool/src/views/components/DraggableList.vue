<template>
  <div class="draggable-list">
    <div style="display: flex">
      <i
        class="el-icon-circle-plus-outline add-item-icon icon"
        @click="$emit('addItem', 0)"
      ></i>
      <el-divider />
    </div>
    <draggable :list="dataList" handle=".handle" item-key="index">
      <div v-for="(item, index) in dataList" :key="index">
        <div style="display: flex">
          <slot :item="item" :index="index"></slot>
          <i class="el-icon-rank handle icon"></i>
          <i
            class="el-icon-circle-close icon"
            @click="$emit('removeItem', index)"
          ></i>
        </div>
        <div style="display: flex">
          <i
            class="el-icon-circle-plus-outline add-item-icon icon"
            @click="$emit('addItem', index + 1)"
          ></i>
          <el-divider />
        </div>
      </div>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  name: 'DraggableList',
  props: {
    dataList: Array
  },
  components: {
    draggable
  }
}
</script>

<style lang="scss" scoped>
.draggable-list {
  .icon {
    margin-left: 5px;
    font-size: 20px;
    cursor: pointer;
  }

  .add-item-icon {
    margin: auto;
    padding-right: 10px;
  }
}
</style>
