# Project development





- Server
  - Integrity checks (Add new course to study plan)
    - total credits fo study plan + new course > max?
    - study plan contains incompatible course wrt new one?
    - check on prep courses (it must be already in the plan)
    - check on max students of the course 

 - Integrity checks (Remove course from study plan)
   - Check if the course is the preparatory course for another one already inside the study plan
  

- APIs
  
- Homepage
  - Show credits count

- Study Plan
  - Add new courses to study plan
  - Implement checks for the new courses

- EditMode
  - Add + button to course accordion (to be visualized only in edit)
  - Add remove button to study plan course table row











pass the study plan
for each course
  get incompatible 
    for each incompatible
      -> check if in study plan
        yes: cannot be added
        no: can be added
  
  get prep
    -> check if in study plan
      yes: can be added
      no: cannot be added

  -> enrolled == max
    yes: cannot be added
    no: can be added


return same courses with an additional dict
{canBeAdded: true}
{canBeAdded: false, reason: [{"incompatibility": ["course1", "course2"]}, "preparation": "courseX", "maxStudents":true]}
  