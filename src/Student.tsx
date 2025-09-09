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
      <div>
        <h2 id="student-name">
          {student.givenName} {student.middleName} {student.familyName}
        </h2>
        <p className="sr-only">
          Viewing grade report for {selectedYear || "all years"}
        </p>
      </div>
    );
  } else {
    return (
      <div role="status" aria-live="polite">
        No data for specified student/year
      </div>
    );
  }
}
