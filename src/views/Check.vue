<template>
  <div class="check">
    <h1>XX 审核平台-审核页</h1>
    <!-- 基础信息区 -->
    <el-table
      :data="baseInfo"
      :span-method="baseSpanMethod"
      border
      :show-header="false"
      style="width: 100%"
    >
      <el-table-column prop="column1"  width="180" />
      <el-table-column prop="column2" />
      <el-table-column prop="column3" />
      <el-table-column prop="column4"/>
      <el-table-column prop="column5"/>
      <el-table-column prop="column6"/>
    </el-table>
    <!-- 按钮区 -->
    <el-row class="row-bg btns" justify="space-between">
      <el-col :span="4"><div class="grid-content ep-bg-purple" />
        <el-button type="default" :style="{width: '120px', fontWeight: '600'}">通过所选</el-button>
      </el-col>
      <el-col :span="4"><div class="grid-content ep-bg-purple" />
        <el-button type="default" :style="{width: '120px', fontWeight: '600'}">拒绝所选</el-button>
      </el-col>
      <el-col :span="4"><div class="grid-content ep-bg-purple" />
        <el-button type="default" :style="{width: '120px', fontWeight: '600'}">拒绝账户</el-button>
      </el-col>
      <el-col :span="4"><div class="grid-content ep-bg-purple" />
        <el-button type="default" :style="{width: '120px', fontWeight: '600'}">搁置</el-button>
      </el-col>
      <el-col :span="4"><div class="grid-content ep-bg-purple" />
        <el-button @click="getNextTask" :disabled="hasNext" type="default" :style="{width: '120px', fontWeight: '600'}">下一个任务</el-button>
      </el-col>
    </el-row>
     <!-- 审核信息区 -->
    <el-table
      :data="checkData"
      :span-method="checkSpanMethod"
      border
      style="width: 100%"
    >
      <el-table-column prop="ischeck" width="50">
        <template #header>
          <el-checkbox v-model="ischeckAll" />
        </template>
        <template #default="scope">
          <el-checkbox v-model="scope.ischeck" />
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="title"  width="180" />
      <el-table-column label="描述" prop="desc" />
      <el-table-column label="图片" prop="pic" />
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <el-button
            link
            type="primary"
            size="small"
            @click.prevent="pass(scope.row)"
          >
            通过
          </el-button>
          <el-button
            link
            type="primary"
            size="small"
            @click.prevent="reject(scope.row)"
          >
            拒绝
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="落地页">
        <el-table-column label="State" width="120" />
        <el-table-column label="City" width="120" />
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute,useRouter } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
const route = useRoute()
const router = useRouter()
// 当前任务对象
const currentTask = ref({})
// 当前审核用户信息
const baseInfo = ref([])
// 当前审核数据区
const checkData = ref([])
// 下一任务按钮的禁用
const hasNext = ref(false)
const ischeckAll = ref(false)

const init = () => {
  console.log('sssss', store.state.checkList)
  console.log('当前任务id', route.query.id)
  console.log('当前任务', store.getters.currentTask(route.query.id))
  if(!store.getters.nextTask(route.query.id)) {
    hasNext.value = true
  }
  currentTask.value = store.getters.currentTask(route.query.id)
  const { id, userName,webSite,industryLev1,industryLev2,userType,remark,naturalEwt } = currentTask.value;
  console.log(id, userName)
  baseInfo.value = [
    { 
      column1: '用户名', 
      column2: userName, 
      column3: '用户id',
      column4: id,
      column5: '网址',
      column6: webSite,
    },
    { 
      column1: '资质', 
      column2: naturalEwt, 
      column3: '一级行业',
      column4: industryLev1,
      column5: '二级行业',
      column6: industryLev2,
    },
    { 
      column1: '用户类型', 
      column2: userType, 
      column3: '批注',
      column4: remark
    }
  ]
  // 审核数据
  checkData.value = [
    { title: '2', desc: 'w', pic: '4' },
    { title: '3', desc: 'w', pic: '5' },
    { title: '3', desc: 'w', pic: '32' },
    { title: '4', desc: 'd', pic: 'ew' },
    { title: '4', desc: 'd', pic: 'ewq' },
  ]
}

onMounted(() => {
  init()
})
watch(
  () => route.query.id,
  () => {
  console.log('检测到变化')
  init()
})

// 用户信息区域表格处理
const baseSpanMethod = ({
  row,
  column,
  rowIndex,
  columnIndex,
}) => {
  if (rowIndex == 2) {
    if (columnIndex === 3) {
      return [2, 3]
    }
  }
}
// 审核数据区域表格处理
const checkSpanMethod = ({
  row,
  column,
  rowIndex,
  columnIndex,
}) => {
  if(columnIndex == 5) {
    return [checkData.value.length,1]
  } else if (columnIndex == 6) {
    return [checkData.value.length,1]
  }
  
}

// 下一个任务
const getNextTask = () => {
  let nextTaskId = store.getters.nextTask(route.query.id)
  router.replace({ name: 'check', query: { id: nextTaskId } })
  console.log('下一个任务', nextTaskId)
}

// 通过
const pass = row => {
  console.log(row)
}
// 拒绝
const reject= row => {
  console.log(row)
}
</script>

<style scoped>
.btns {
  margin: 15px 0;
}
.el-table__inner-wrapper .is-group:last-child {
  display: none;
}
</style>

