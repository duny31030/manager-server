/**
 * 用户管理模块
 */

const router = require("koa-router")();
const User = require("./../models/userSchema");
const util = require("./../utils/util");
const jwt = require("jsonwebtoken");

router.prefix("/users");

// router.get("/leave/count", (ctx) => {
//   // const token = ctx.request.headers.authorization.split(' ')[1];
//   // const payload = jwt.verify(token, 'duningyuan');
//   ctx.body = 'body';
// })

router.post("/login", async (ctx) => {
  try {
    const { userName, userPwd } = ctx.request.body;
    /**
     * 返回数据库指定字段，三种方式
     * 1. 'userId userName userEmail state role deptId roleList'
     * 2. {userId:1, _id:0}
     * 3. .select('userId')   // 加在最后
     */ 
    const res = await User.findOne({
      userName,
      userPwd,
    }, 'userId userName userEmail state role deptId roleList');
    
    const data = res._doc;

    const token = jwt.sign({
        data
      },
      "duningyuan",
      { expiresIn: "1h" });

    if (res) {
      data.token = token;
      ctx.body = util.success(data);
    } else {
      ctx.body = util.fail("账号或者密码不正确");
    }
  } catch (error) {
    ctx.body = util.fail(error.msg);
  }
});

module.exports = router;
