var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/waijian');

var personSchema = new mongoose.Schema({
    name: String,
    age: Number,
    addr: String
});

var personModel = mongoose.model('person', personSchema);

var courseSchema = new mongoose.Schema({
    name: String,
    teacher: {  //_id
        type: mongoose.Schema.Types.ObjectId,  //是_id属性的类型
        ref: 'person'
    }
    //主键：唯一确定一条文档记录(_id)
    //外健：当前文档中拥有一个其他集合文档的主键(_id) _id
});

var courseModel = mongoose.model('course', courseSchema);


courseModel.findOne({name: 'angular'})
    .populate('teacher')
    .exec(function (err, doc) {
        if (!err){
            console.log(doc);
        } else {
            console.log(err);
        }
    });




