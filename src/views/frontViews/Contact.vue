<script>
export default {
  name: "Contact",
  data() {
    return {
      // ★ 预留：站长邮箱。在此处填写真实邮箱即可上线，例如 "webmaster@example.com"
      // 留空时页面显示"待配置"占位，不暴露地址。
      ownerEmail: "2013478179@qq.com",
    };
  },
  computed: {
    hasEmail() {
      return this.ownerEmail && this.ownerEmail.trim() !== "";
    },
    mailto() {
      return this.hasEmail ? "mailto:" + this.ownerEmail : "";
    },
  },
  methods: {
    copyEmail() {
      if (!this.hasEmail) {
        this.$message.warning("站长邮箱尚未配置喵");
        return;
      }
      // 兼容旧浏览器的复制写法（http://localhost 下 navigator.clipboard 可能受限）
      const input = document.createElement("textarea");
      input.value = this.ownerEmail;
      document.body.appendChild(input);
      input.select();
      try {
        document.execCommand("copy");
        this.$message.success("邮箱已复制到剪贴板喵");
      } catch (e) {
        this.$message.error("复制失败，请手动复制喵");
      }
      document.body.removeChild(input);
    },
  },
};
</script>

<template>
  <div>
    <el-row>
      <el-col :span="2">
        <p>&nbsp;</p>
      </el-col>
      <el-col :span="20">
        <!-- 主体卡片，沿用 Set.vue 的 .card-main 样式 -->
        <div class="padding_20px card-main min-height">
          <!-- 标题 -->
          <el-row class="padding_20px">
            <div>
              <h2>联系站长</h2>
              <hr>
            </div>
          </el-row>

          <div class="padding_20px contact-body">
            <p class="intro">
              有任何建议、反馈或合作意向，欢迎通过以下方式与站长联系喵～
            </p>

            <!-- 邮箱联系卡（预留位置） -->
            <div class="email-card">
              <div class="email-row">
                <i class="el-icon-message email-icon"></i>
                <div class="email-info">
                  <div class="email-label">站长邮箱</div>
                  <!-- ★ 预留：ownerEmail 为空时显示占位，填入后变为可点击 mailto 链接 -->
                  <a v-if="hasEmail" :href="mailto" class="email-value">{{ ownerEmail }}</a>
                  <span v-else class="email-value email-placeholder">（待配置）</span>
                </div>
                <el-button size="small" type="primary" @click="copyEmail">复制邮箱</el-button>
              </div>
              <p class="email-tip">
                建议在邮件标题中注明来意，例如：【反馈】xxx，以便站长及时处理喵。
              </p>
            </div>

            <!-- 说明区 -->
            <el-divider content-position="left">说明</el-divider>
            <ul class="note-list">
              <li>本站为个人 / 学习项目，回复可能存在延迟，请耐心等待喵。</li>
              <li>请勿通过邮箱发送无关广告或敏感内容。</li>
              <li>如发现站点 bug 或内容侵权，欢迎在邮件中附上截图与链接。</li>
            </ul>
          </div>
        </div>
      </el-col>
      <el-col :span="2">
        <p>&nbsp;</p>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
/* 与 Set.vue 保持一致的卡片样式 */
.padding_20px {
  padding: 20px;
}
.card-main {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: 0 8px 28px rgba(0, 0, 0, .05);
  margin: 1vh;
  border-radius: 15px;
}
.min-height {
  min-height: 500px;
}

.contact-body {
  color: #3c4147;
}
.intro {
  font-size: 15px;
  line-height: 1.8;
  margin-bottom: 24px;
  color: #5a6066;
}

/* 邮箱联系卡 */
.email-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.email-row {
  display: flex;
  align-items: center;
  gap: 16px;
}
.email-icon {
  font-size: 36px;
  color: var(--color-secondary);
}
.email-info {
  flex: 1;
  min-width: 0;
}
.email-label {
  font-size: 13px;
  color: #999;
  margin-bottom: 4px;
}
.email-value {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-secondary);
  text-decoration: none;
  word-break: break-all;
}
.email-value:hover {
  color: var(--color-primary);
  text-decoration: underline;
}
.email-placeholder {
  color: #c0c4cc;
  font-weight: 400;
}
.email-tip {
  font-size: 13px;
  color: #909399;
  margin: 0;
}

.note-list {
  padding-left: 20px;
  line-height: 1.9;
  color: #5a6066;
}
</style>
