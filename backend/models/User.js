const { type } = require('@testing-library/user-event/dist/type');
const mongoose = require('mongoose');



const EventSchema = new mongoose.Schema({
  title : {type: String, required : true},
  start : {type: Date, required : true},
  end: {type: Date, required:true}
});

const FinishedEventsSchema = new mongoose.Schema({
  taskId : {type: String , required: true} , 
  month : {type: String , required:false} , 
  completedTask_onTime:{type:String , required:false} , 
  completedTask_lateFinished : {type:String , required:false} ,
  
})

const UserSchema = new mongoose.Schema({
  username: {type: String , required: true} , 
  email: {type: String , required: true} , 
  profilePic:{type:String , required:true} , 
  password: String,
  events : [EventSchema], 
  finishedEvents : [FinishedEventsSchema]
}, {timestamps:true} );


const MonthStats = new mongoose.Schema({
  monthNumber:{type: String , required:true} , 
  yearNumber :{type: String , required:true} , 
  numberofCompletedTasksOntime:{type:Number , required:true} , 
  numberofNoneCompletedTasks:{type:Number , required:true} ,
  numberofNoneCompletedLateTasks:{type:Number , required:true} , 
});

const StatSchema = new mongoose.Schema({
  userId:{type: String , required:true} , 
  stats:[MonthStats] 
 
})

module.exports = mongoose.model('User', UserSchema);