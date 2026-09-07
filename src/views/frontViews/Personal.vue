<script>
import request from '@/utils/request';
import defaultAvatar from '@/img/user.png';

export default {
  name: 'Personal',
  data() {
    return {
      profile: null,
      loading: false,
      defaultAvatar: defaultAvatar,
    };
  },
  computed: {
    // 账号状态映射：1=普通用户, 2=已停用, 3=管理员
    statusLabel() {
      const s = this.profile && this.profile.status;
      if (s === 1) return '普通用户';
      if (s === 2) return '已停用';
      if (s === 3) return '管理员';
      return '未知';
    },
    statusTagType() {
      const s = this.profile && this.profile.status;
      if (s === 3) return 'success';
      if (s === 2) return 'danger';
      return 'info';
    },
  },
  mounted() {
    this.fetchProfile();
  },
  methods: {
    // 走 request.js 实例：自动带 Bearer token，按 {code,msg,data} 约定返回整包
    fetchProfile() {
      this.loading = true;
      request.post('/getMyProfile')
        .then((res) => {
          this.profile = (res && res.data) || null;
        })
        .catch(() => {
          this.profile = null;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    gologin() {
      this.$router.push('/Login');
    },
    goback() {
      this.$router.go(-1);
    },
  },
};
</script>

<template>
  <div>
    <el-row>
      <el-col :span="2"><p>&nbsp;</p></el-col>
      <el-col :span="20">
        <div class="padding_20px card-main min-height">
          <!-- 标题 -->
          <el-row class="padding_20px">
            <div>
              <h2>个人中心</h2>
              <hr>
            </div>
          </el-row>

          <div class="padding_20px">
            <!-- 加载中 -->
            <div v-if="loading" class="dom_in_center" style="padding: 60px 0;">
              <p>加载中喵...</p>
            </div>

            <!-- 未获取到（未登录 / 登录已过期 / 失败） -->
            <div v-else-if="!profile" class="nothingHere dom_in_center">
              <div style="text-align:center;">
                <p style="margin-bottom:16px;">未获取到个人信息喵，可能是未登录或登录已过期</p>
                <el-button type="primary" @click="gologin">去登录</el-button>
              </div>
            </div>

            <!-- 个人信息展示 -->
            <div v-else class="profile-card">
              <div class="profile-head">
                <img :src="profile.avaterURL || defaultAvatar" class="avatar" alt="头像"/>
                <div class="head-info">
                  <h2 class="uname">{{ profile.userName || '未设置' }}</h2>
                  <el-tag size="small" :type="statusTagType">{{ statusLabel }}</el-tag>
                </div>
              </div>

              <div class="profile-rows">
                <div class="row">
                  <span class="label">昵称</span>
                  <span class="value">{{ profile.userName || '未设置' }}</span>
                </div>
                <div class="row">
                  <span class="label">性别</span>
                  <span class="value">{{ profile.gender || '未设置' }}</span>
                </div>
                <div class="row">
                  <span class="label">注册时间</span>
                  <span class="value">{{ profile.registerTime || '未知' }}</span>
                </div>
                <div class="row">
                  <span class="label">个性签名</span>
                  <span class="value">{{ profile.signature || '这个人很懒，什么都没写喵' }}</span>
                </div>
                <div class="row">
                  <span class="label">个人主页</span>
                  <span class="value">
                    <a v-if="profile.PersonalIndexLink" :href="profile.PersonalIndexLink" target="_blank" rel="noopener" class="link">{{ profile.PersonalIndexLink }}</a>
                    <span v-else>未设置</span>
                  </span>
                </div>
              </div>

              <div class="profile-foot">
                <el-button @click="goback">返回</el-button>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="2"><p>&nbsp;</p></el-col>
    </el-row>
  </div>
</template>

<style scoped>
.padding_20px { padding: 20px; }
.card-main {
  background-color: #cff3f3;
  margin: 1vh;
  border-radius: 15px;
}
.min-height { min-height: 500px; }
.dom_in_center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.nothingHere { height: 50vh; }

.profile-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 28px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}
.profile-head {
  display: flex;
  align-items: center;
  gap: 20px;
  padding-bottom: 20px;
  border-bottom: 1px dashed #e0e0e0;
}
.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  background: #f0f0f0;
}
.head-info { display: flex; align-items: center; gap: 12px; }
.uname { color: #1476ea; }

.profile-rows { padding: 12px 0; }
.row {
  display: flex;
  padding: 12px 4px;
  border-bottom: 1px solid #f0f0f0;
}
.row:last-child { border-bottom: none; }
.label {
  width: 100px;
  flex-shrink: 0;
  color: #909399;
  font-size: 14px;
}
.value {
  flex: 1;
  color: #3c4147;
  font-size: 15px;
  word-break: break-all;
}
.link { color: #1476ea; text-decoration: none; }
.link:hover { text-decoration: underline; }

.profile-foot { margin-top: 20px; text-align: right; }
</style>
