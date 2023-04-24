 <!-- 审核信息区 -->
    <el-table
      :data="checkData"
      :span-method="checkSpanMethod"
      border
      :fit="false"
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