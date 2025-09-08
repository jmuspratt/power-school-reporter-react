import { Grade } from "./types.ts";
import { GradeView } from "./GradeView.tsx";

export function SubjectView({ grades }: { grades: Grade[] | undefined }) {
  if (!grades) {
    return <></>;
  }
  const displayGrades = [];
  let courseTitle = "";
  let teacher = "";
  for (const a of grades) {
    courseTitle = a.title;
    teacher = a.instructor;
    const key = a.year + a.quarter + a.code;

    displayGrades.push(<GradeView g={a} key={key} />);
  }
  return (
    <>
      <tr className={"course-record"}>
        <td className="course-info" data-th="Class">
          <h3 className={"course-title course"}>{courseTitle}</h3>
          <p className={"course-teacher teacher"}>{teacher}</p>
        </td>
        {displayGrades}
      </tr>
    </>
  );
}
