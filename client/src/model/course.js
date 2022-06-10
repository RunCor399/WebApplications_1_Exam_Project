

function Course(code, name, credits, enrolledStudents, maxStudents, preparatoryCourse, incompatibleCourses){
    this.code = code;
    this.name = name;
    this.credits = credits;
    this.enrolledStudents = enrolledStudents;
    this.maxStudents = maxStudents;
    this.preparatoryCourse = preparatoryCourse;
    this.incompatibleCourses = incompatibleCourses;
    
}


export {Course}