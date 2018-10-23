const router = require('koa-router')()
const db = require('monk')('mongodb://yintong:yintong@60.205.231.78:27017/lonelychinaday')
const photos = db.get('photos')
photos.createIndex({'createTime': -1})
photos.createIndex({'createTime': 1})
photos.createIndex({'modifyTime': -1})
photos.createIndex({'modifyTime': 1})

router.get('/api1/photo', async (ctx) => {
  let { pageSize, current, orderBy, order } = ctx.request.query
  if(!orderBy){orderBy="modifyTime"; order=-1}
  let total = await photos.count()
  let st = await photos.find({},{sort: {[orderBy]: parseInt(order)}, skip: (current - 1)*pageSize, limit: parseInt(pageSize) })
  ctx.body = { code: 1, list: st, total };
})

router.post('/api2/photo', async (ctx) => {
  let st = await photos.insert(ctx.request.body);
  if(st){
    ctx.body = { code: 1 };
  }else{
    ctx.body = { code: -1 };
  }   
})

router.put('/api2/photo', async (ctx) => {
  console.log(ctx.request.body)
  let st = await photos.findOneAndUpdate(ctx.request.body._id,{"$set": ctx.request.body});
  console.log(st)
  if(st){
    ctx.body = { code: 1 };
  }else{
    ctx.body = { code: -1 };
  }   
})

router.delete('/api2/photo', async (ctx) => {
  console.log(ctx.request.body)
  let st = await photos.findOneAndDelete(ctx.request.body._id);
  console.log(st)
  if(st){
    ctx.body = { code: 1 };
  }else{
    ctx.body = { code: -1 };
  }   
})

module.exports = router