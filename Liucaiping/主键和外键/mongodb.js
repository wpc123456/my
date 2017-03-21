//引入mongoose模块
var mongoose = require('mongoose');
//连接数据库
mongoose.connect('mongodb://localhost:27017/waijian');
//创建教师模型骨架
var personSchema = new mongoose.Schema({
    name:String,
    age:Number,
    addr:String
})
//创建模型
var personModel = mongoose.model('person',personSchema);

//创建课程骨架模型
var courseSchema = new mongoose.Schema({
    name:String,
    teacher:{
        type:mongoose.Schema.Types.ObjectId, //id属性的类型
        ref:'person' //代表关联的是person集合
    }
    //主键：唯一确定一条文档记录
    //外键：当前文档中拥有一个其他集合文档的主键（_id）_id
})

//创建课程
var courseModel = mongoose.model(course,courseSchema);

//创建一条课程相关的文档
courseModel.create({name:'chenchao',age:20});
/*personModel.create({name: '陈超', age: 20, addr: '北京'}, function (err, personInfo) {
 +    if (!err){
 +        console.log(personInfo);
 +        courseModel.create({name: 'angular', teacher: personInfo._id}, function (err, courseInfo) {
 +            if (!err){
 +                 console.log(courseInfo);
 +            } else {
 +                console.log(err);
 +            }
 +        });
 +    } else {
 +        console.log(err);
 +    }
 +});*/
+
    +//查找angular这门课讲师的名字
        +/*courseModel.findOne({name: 'angular'}, function (err, courseInfo) {
         +    if (!err){
         +        /!*{ _id: 58cb425cdaaa2606ce0d7ec2,
         +            name: 'angular',
         +            teacher: { _id: 58cb425cdaaa2606ce0d7ec1,
         +                         name: '陈超',
         +                         age: 20,
         +                         addr: '北京',
         +                         __v: 0 },
         +            __v: 0 }*!/
         +
         +        personModel.findById(courseInfo.teacher, function (err, personInfo) {
         +            if (!err){
         +               /!* { _id: 58cb425cdaaa2606ce0d7ec1,
         +                    name: '陈超',
         +                    age: 20,
         +                    addr: '北京',
         +                    __v: 0 }*!/
         +
         +                console.log(personInfo);
         +            } else {
         +                console.log(err);
         +            }
         +        })
         +    } else {
         +        console.log(err);
         +    }
         +});*/
            +
                +/*{ _id: 58cb425cdaaa2606ce0d7ec2,
                 +    name: 'angular',
                 +    teacher:
                 +    { _id: 58cb425cdaaa2606ce0d7ec1,
                 +        name: '陈超',
                 +        age: 20,
                 +        addr: '北京',
                 +        __v: 0 },
                 +    __v: 0 }*/
                    +
                        +courseModel.findOne({name: 'angular'})
    .populate('teacher')
    .exec(function (err, doc) {
           if (!err){
                    console.log(doc);
                } else {
                    console.log(err);
                }
        });



