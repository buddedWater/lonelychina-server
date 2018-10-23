const router = require('koa-router')()
const secret = 'lonely yintong'
const jwt = require('jsonwebtoken')
const db = require('monk')('mongodb://yintong:yintong@60.205.231.78:27017/lonelychinaday')
const users = db.get('users')
const { encrypt, validate } = require('../utils/bcryptPassword')

router.get('/api1', async (ctx, next) => {
  let { pwd } = ctx.request.query
  let password = await encrypt(pwd)
  let flag = await validate(pwd,password)
  ctx.body = {
    password,flag
  }
})

router.post('/api1/login', async (ctx, next) => { 
  const user = ctx.request.body
  let st = await users.findOne({name:user.name});
  if(st){
    let flag = await validate(user.password,st.password)
    if(flag) {
      let userToken = {
          name: user.name
      }
      const token = jwt.sign(userToken, secret, {expiresIn: '1h'})  //token签名 有效期为1小时
      ctx.body = {
          code: 1,
          token
      }
    } else {
      ctx.body = {
          message: '参数错误',
          code: -1
      }
    } 
  }else {
    ctx.body = {
        message: '参数错误',
        code: -1
    }
  }   
})

module.exports = router
