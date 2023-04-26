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
        <el-button type="default" @click="chekItem(true)" :style="{width: '120px', fontWeight: '600'}">通过所选</el-button>
      </el-col>
      <el-col :span="4"><div class="grid-content ep-bg-purple" />
        <el-button type="default" @click="chekItem(false)" :style="{width: '120px', fontWeight: '600'}">拒绝所选</el-button>
      </el-col>
      <el-col :span="4"><div class="grid-content ep-bg-purple" />
        <el-button type="default" @click="rejectuser" :style="{width: '120px', fontWeight: '600'}">拒绝账户</el-button>
      </el-col>
      <el-col :span="4"><div class="grid-content ep-bg-purple" />
        <el-button type="default" @click="shelve" :style="{width: '120px', fontWeight: '600'}">搁置</el-button>
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
      max-height="650"
      class="checklist"
      :row-class-name="'row-item'"
      style="width: 100%"
      @selection-change="SelectChange"
    >
      <el-table-column type="selection" width="50"/>
      <el-table-column label="标题" prop="title"  width="120" />
      <el-table-column label="描述" prop="desc" width="280"/>
      <el-table-column label="图片">
        <template #default="scope">
          <img v-for="item in scope.row.pics" :key="item.taskId" :src="item" style="margin: 0 5px" alt="">
        </template>
      </el-table-column>
      <el-table-column label="操作" width="55" align="'center'">
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
            style="margin-left: 0"
            type="primary"
            size="small"
            @click.prevent="reject(scope.row)"
          >
            拒绝
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="落地页" align="center">
        <el-table-column  width="300">
          <template #default>
            <div style="display: flex; align-items: center">
                <el-image :src="resultPageURL"/>
            </div>
        </template>
        </el-table-column>
        <el-table-column width="66" >
          <template #default>
            <el-button
              link
              type="primary"
              size="small"
              @click.prevent="pass()"
            >
              通过
            </el-button>
            <el-button
              link
              style="margin-left: 0"
              type="primary"
              size="small"
              @click.prevent="reject()"
            >
              拒绝
            </el-button>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <!-- 通过/拒绝/搁置确认弹框 -->
    <el-dialog
      v-model="checkItemDialog"
      :title="checkParams.ispass ? '通过' : '拒绝'"
      width="30%"
      destroy-on-close
      center
    >
      <div>
        {{`${checkParams.ispass ? '通过' : '拒绝'}的任务id分别是：`}}
        <div v-for="item in checkParams.passItems" :key="item">
          <strong>{{ item }}</strong>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="checkItemDialog = false">取消</el-button>
          <el-button type="primary" @click="checkItemDialog = false">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 拒绝账户确认弹框 -->
    <el-dialog
      v-model="rejectAccountDialog"
      :title="'拒绝账户'"
      width="30%"
      destroy-on-close
      center
    >
      <div>
        <div>拒绝账户的任务id分别是：{{currentTask.id}}</div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="rejectAccountDialog = false">取消</el-button>
          <el-button type="primary" @click="rejectAccountDialog = false">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>                                  
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
// 落地页url
const resultPageURL = ref([])
// 下一任务按钮的禁用
const hasNext = ref(false)
const ischeckAll = ref(false)
const checkParams = ref({})
// 每条数据通过/拒绝的弹框
const checkItemDialog = ref(false)
const rejectAccountDialog = ref(false)
// 当前所选数据
const currentSelected = ref([])

const init = () => {
  console.log('sssss', store.state.checkList)
  console.log('当前任务id', route.query.id)
  console.log('当前任务', store.getters.currentTask(route.query.id))
  if(!store.getters.nextTask(route.query.id)) {
    hasNext.value = true
  }
  currentTask.value = store.getters.currentTask(route.query.id)
  const { id,
          userName,
          webSite,
          industryLev1,
          industryLev2,
          userType,
          remark,
          naturalEwt,
          resultPage,
          dataList
        } = currentTask.value

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
  checkData.value = dataList.data
  resultPageURL.value = resultPage
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
  checkItemDialog.value = true
  checkParams.value = {
    ispass: true,
    passItems: [
      {
        taskId: row.taskId
      }
    ]
  }
}
// 拒绝
const reject= row => {
  checkItemDialog.value = true
  checkParams.value = {
    ispass: false,
    passItems: [
      {
        taskId: row.taskId
      }
    ]
  }
}

const SelectChange = val => {
  console.log('当前所选项：', val)
  currentSelected.value = val.map(task => ({ taskId: task.taskId }))
}
// 通过所选/拒绝所选
const chekItem = flag => {
  if(!currentSelected.value.length) {
    return ElMessage({
      message: '请勾选至少一项任务',
      type: 'warning',
    })
  }
  checkParams.value = {
    ispass: flag,
    passItems: currentSelected.value
  }
  checkItemDialog.value = true
}
// 拒绝账户
const rejectuser = () => {
  rejectAccountDialog.value = true
}
// 搁置任务
const shelve = () => {
  
}
</script>

<style scoped>
h1 {
  font-weight: 400;
  margin: 20px 0;
}
.btns {
  margin: 15px 0;
}
.checklist :deep(.is-group) tr:last-child {
  display: none;
}
.checklist tr:hover {
  background-color: blue;
}
</style>

