<template>
  <div class="list">
    <h1>XX 审核平台-列表页</h1>
    <el-row class="row-bg" justify="space-between">
      <el-col :span="7">
        <el-form-item label="用户名：">
          <el-input v-model="form.userName" placeholder="请输入用户名" />
        </el-form-item>
      </el-col>
      <el-col :span="7">
        <el-form-item label="产品线：">
          <el-input v-model="form.prodline" placeholder="请输入产品线" />
        </el-form-item>
      </el-col>
      <el-col :span="7">
        <el-form-item label="行业：">
          <el-input v-model="form.industryLev1" placeholder="请输入行业" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row class="row-bg" justify="space-between">
      <el-form-item label="任务创建时间">
        <el-col :span="11">
           <el-date-picker
            v-model="form.date"
            type="daterange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :default-time="defaultTime"
          />
        </el-col>
      </el-form-item>
      <el-button type="primary" @click="searchHandle" class="search">搜索</el-button>
    </el-row>

    <el-table 
      v-loading="loading" 
      element-loading-background="rgba(255, 255, 255, 0.5)" 
      border 
      :data="tableData.value" 
      style="width: 100%"
      >
      <el-table-column prop="userName" label="用户名" width="180" />
      <el-table-column prop="prodline" label="产品线" width="180" />
      <el-table-column prop="industryLev1" label="行业" width="180" />
      <el-table-column label="创建时间">
        <template #default="scope">
          {{scope.row.createTime}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button
            link
            type="primary"
            size="small"
            @click.prevent="checkRow(scope.row)"
          >
            审核
          </el-button>
          <el-button
            link
            type="primary"
            size="small"
            @click.prevent="deleteRow(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
      <template #empty>
        没有数据
      </template>
      <template #append>
        <el-pagination
          class="pagination"
          background 
          layout="total, prev, pager, next" 
          :total="tableData.total"
          v-model:current-page="currentPage"
          @current-change="pageChange"
          />
      </template>
    </el-table>
  </div>
</template>

<script setup>
  import { ref, reactive, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import { useRouter } from 'vue-router'
  import { useStore } from 'vuex'
  import axios from 'axios'

  const router = useRouter()
  const store = useStore()

  let tableData = reactive({ value: [], total: 0, page: 1 })
  const currentPage = ref(1)
  const defaultTime = ref([
    new Date(2000, 1, 1, 0, 0, 0),
    new Date(2000, 2, 1, 23, 59, 59),
  ])
  const loading = ref(true)

  const form = reactive({
    userName: '',
    prodline: '',
    industryLev1: '',
    date: []
  })

  onMounted(() => {
    getData({ page: currentPage.value, pageSize: 10 })
  })

  const getData = async ({page = 1, pageSize = 10, searchParam}) => {
    loading.value = true
    const {data} = await axios.get('/getlist', {
      params: {
        page,
        pageSize,
        ...searchParam
      },
    })
    tableData.value = data.result.list
    loading.value = false
    tableData.total = data.result.pageCount
    currentPage.value = data.result.page
    console.log(data.result)
  }

  const searchHandle = async () => {
    let searchParam = {}
    for (const key in form) {
      if (Object.hasOwnProperty.call(form, key)) {
        if(form.date.length) {
          searchParam['startDate'] = form.date[0]
          searchParam['endDate'] = form.date[1]
        }
        if(form[key] !== '') searchParam[key] = form[key]
      }
    }
    console.log('当前搜索区域',searchParam)
    getData({ page: 1, pageSize: 10, searchParam })
  }

  const pageChange = page => {
    getData({ page: page, pageSize: 10 })
  }

  const checkRow = row => {
    store.commit('checkList', tableData.value)
    router.push({ name: 'check', query: { id: row.id } })
  }
  const deleteRow = async row => {
    loading.value = true
    const { data } = await axios.delete('/delete', { 
      params: {
        id: row.id
      }
    })
    if(data.code !== 200) return
    // 弹框提示
    ElMessage.success({
      message: '删除成功'
    })
    // 重新加载页面
    getData({})
  }

</script>

<style>
h1 {
  font-weight: 400;
  margin: 20px 0;
}
.search {
  width: 100px;
}
.pagination {
  display: flex;
  justify-content: end;
  margin: 15px 0;
}
</style>
