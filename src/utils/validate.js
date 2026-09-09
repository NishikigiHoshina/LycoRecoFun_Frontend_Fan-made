/**
 * 输入字符校验：当前数据库表为 utf8mb3（旧 utf8，单字符最长 3 字节），
 * 只能存 BMP（码点 <= 0xFFFF）。emoji（>= 0x1F300）等 4 字节字符入库会触发
 * MySQL "Incorrect string value"，故在发出请求前先拦截，给友好提示。
 * 说明：Post 富文本正文（wangEditor -> HTML）属单独审计项，不在这里走相同拦截。
 */

/** 字符串中是否存在无法入库的字符（码点超出 BMP 的 4 字节字符，如 emoji） */
export function hasUnsupportedChar(text) {
  if (!text) return false
  for (const ch of text) {              // for..of 按码点迭代，可正确识别代理对(emoji)
    if (ch.codePointAt(0) > 0xffff) return true
  }
  return false
}

/**
 * 批量校验若干输入字段；若有不支持的字符则弹 warning 并返回 true（调用方据此中止提交）。
 * fields: [{ name: '标题', value: str }]
 */
export function warnIfUnsupported(vm, fields) {
  for (const f of fields) {
    if (hasUnsupportedChar(f.value)) {
      vm.$message.warning(`「${f.name}」含数据库不支持的特殊字符（如 emoji），请移除后重试`)
      return true
    }
  }
  return false
}
