import { Student } from "./types.ts";

export function StudentDisplay({
  student,
  selectedYear,
}: {
  student: Student;
  selectedYear: string;
}) {
  if (student) {
    return (
      <>
        <div>
          <h1>
            {student.givenName} {student.middleName} {student.familyName}
          </h1>
        </div>
      </>
    );
  } else {
    return <>No data for specified student/year</>;
  }
}
