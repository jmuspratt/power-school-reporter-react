import { Grade } from "./types.ts";

export function GradeView({ g }: { g: Grade }) {
  if (g) {
    let quarter = g.quarter.toLowerCase();

    // handle terms (T1) as well aq Querters(Q1)
    // TODO: Find a better way to do this based on the universa of 'quarter' values
    if (quarter.startsWith("t")) {
      quarter = quarter.replace("t", "q");
    }

    const gradeLabel = [
      g.letterGrade,
      g.numberGrade && `(${g.numberGrade})`,
    ].filter(Boolean).join(" ");

    return (
      <td
        className={`grades-table__grade grades-table__grade--${quarter}`}
        data-th={g.quarter}
        headers={`class-column quarter-${quarter}`}
      >
        <div className="grades-table__grade-values">
          {g.letterGrade && (
            <span className="grades-table__letter-grade" aria-label={`Grade: ${gradeLabel}`}>
              {g.letterGrade}
            </span>
          )}
          {g.numberGrade && (
            <span className="grades-table__number-grade" aria-hidden="true">
              ({g.numberGrade})
            </span>
          )}
        </div>
        {g.daysAbsent && (
          <p className="grades-table__absent-count" role="status">
            {`Absent ${g.daysAbsent} day${g.daysAbsent == "1" ? "" : "s"}`}
          </p>
        )}
        {g.comments && (
          <p className="grades-table__comments" aria-label={`Comments: ${g.comments}`}>
            {g.comments}
          </p>
        )}
      </td>
    );
  }
  return null;
}
