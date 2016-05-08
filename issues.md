启动mongodb
sudo mongod --dbpath ~/data/db


##note：
1.require的时候注意，需要首先引入数据库连接模块，再引入数据操作模块，否则会出现
MissingSchemaError: Schema hasn't been registered for model... 类型的错误

2.express升级之后，许多中间件不再与其捆绑，需要引入单独的包
Most middleware (like logger) is no longer bundled with Express and must be installed separately. Please see https://github.com/senchalabs/connect#middleware.
参见express3升级express4指南：http://expressjs.com/zh-cn/guide/migrating-4.html

3.将gruntfile修改为gulp
