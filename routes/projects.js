const router = require('koa-router')()
const db = require('monk')('mongodb://yintong:yintong@60.205.231.78:27017/lonelychinaday')
const projects = db.get('projects')
projects.createIndex({'createTime': -1})
projects.createIndex({'createTime': 1})
projects.createIndex({'modifyTime': -1})
projects.createIndex({'modifyTime': 1})


router.get('/api1/project', async (ctx) => {
  let { pageSize, current, orderBy, order } = ctx.request.query
  if(!orderBy){orderBy="modifyTime"; order=-1}
  let total = await projects.count()
  let st = await projects.find({},{sort: {[orderBy]: parseInt(order)}, skip: (current - 1)*pageSize, limit: parseInt(pageSize) })
  ctx.body = { code: 1, list: st, total };
})

router.post('/api2/project', async (ctx) => {
  let st = await projects.insert(ctx.request.body);
  if(st){
    ctx.body = { code: 1 };
  }else{
    ctx.body = { code: -1 };
  }   
})

router.put('/api2/project', async (ctx) => {
  console.log(ctx.request.body)
  let st = await projects.findOneAndUpdate(ctx.request.body._id,{"$set": ctx.request.body});
  console.log(st)
  if(st){
    ctx.body = { code: 1 };
  }else{
    ctx.body = { code: -1 };
  }   
})

router.delete('/api2/project', async (ctx) => {
  console.log(ctx.request.body)
  let st = await projects.findOneAndDelete(ctx.request.body._id);
  console.log(st)
  if(st){
    ctx.body = { code: 1 };
  }else{
    ctx.body = { code: -1 };
  }   
})

module.exports = router