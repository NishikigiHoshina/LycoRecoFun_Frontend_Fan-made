import request from '@/utils/request'


/* 1. 主题帖 */
export const getPost = id =>
    request.post('/getPostByid', null, { params: { postid: id } })
        .then(res => res.data)          // 直接给实体

/* 2. 某 parent_id 下所有评论（后端一次返回全部，不分页） */
export const getReply = parentId =>
    request.post('/getReply', null, { params: { parent_id: parentId } })
        .then(res => (res && res.replylist) ? res.replylist : [])

/* 3. 发表评论 / 回复 */
export const addComment = data =>
    request.post('/writecomment', data)