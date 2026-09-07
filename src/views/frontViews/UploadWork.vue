<script setup>
import axios from "axios";
</script>
<script>
export default {
  name:'upload',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false
    };
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  }
}
</script>
<template>
<div>
  <el-row>
    <el-col :span="2">
      <p>&nbsp;</p>
    </el-col>
    <el-col :span="20">
      <!--消息区-->
      <div class="padding_20px card-main min-height" >
        <el-row class="padding_20px">
          <div>
            <h2>上传您的作品，让更多人看到</h2>
            <hr>
          </div>
        </el-row>
        <el-row>
          <div>
            <el-upload
                action="https://jsonplaceholder.typicode.com/posts/"
                list-type="picture-card"
                :limit="5"
                :multiple="true"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </div>
          <el-button size="small" type="primary">点击上传</el-button>
        </el-row>
      </div>
    </el-col>

    <el-col :span="2">
      <p>&nbsp;</p>
    </el-col>

  </el-row>
</div>
</template>

<style scoped>
.padding_20px{
  padding: 20px;
}
.card-main{
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: 0 8px 28px rgba(0, 0, 0, .05);
  margin: 1vh;
  border-radius: 15px;
}
.min-height{
  min-height: 500px;
}
</style>
