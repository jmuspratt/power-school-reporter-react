import { Grade } from "./types.ts";
import { GradeView } from "./GradeView.tsx";

export function SubjectView({ grades }: { grades: Grade[] | undefined }) {
  if (!grades) {
    return <></>;
  }
  const displayGrades = [];
  const displayComments = [];
  let courseTitle = "";
  let teacher = "";
  let courseCode = "";
  let year = "";
  let school = "";
  for (const a of grades) {
    const quarter = a.quarter.toLowerCase();
    courseTitle = a.title;
    courseCode = a.code;
    teacher = a.instructor;
    year = a.year;
    school = a.school;
    const key = a.year + a.quarter + a.code;

    displayGrades.push(<GradeView g={a} key={key} />);
    displayComments.push(
      <div
        key={a.year + a.quarter + a.code + "comments"}
        className={"comments-" + quarter + " comments"}
      >
        {a.comments}
      </div>
    );
  }
  return (
    <>
      <div className={"course-record"}>
        <div className="course-info">
          <h3 className={"course-title course"}>{courseTitle}</h3>
          <p className={"course-teacher teacher"}>{teacher}</p>
          {/* <p>{courseCode}</p> */}
        </div>
        <div className={"grade-container"}>
          {displayGrades}
          {displayComments}
        </div>
      </div>
    </>
  );
}
