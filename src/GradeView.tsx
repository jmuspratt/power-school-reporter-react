import { Grade } from "./types.ts";

export function GradeView({ g }: { g: Grade }) {
  if (g) {
    let quarter = g.quarter.toLowerCase();

    // handle terms (T1) as well aq Querters(Q1)
    // TODO: Find a better way to do this based on the universa of 'quarter' values
    if (quarter.startsWith("t")) {
      quarter = quarter.replace("t", "q");
    }
    return (
      <>
        <td
          className={`grades-table__grade grades-table__grade--${quarter}`}
          data-th={g.quarter}
        >
          <div className="grades-table__grade-values">
            {g.letterGrade && (
              <span className="grades-table__letter-grade">
                {g.letterGrade}
              </span>
            )}
            {g.numberGrade && (
              <span className="grades-table__number-grade">
                ({g.numberGrade})
              </span>
            )}
          </div>
          {g.daysAbsent && (
            <p className="grades-table__absent-count">
              {`Absent ${g.daysAbsent} day${g.daysAbsent == "1" ? "" : "s"}`}
            </p>
          )}
          <p className="grades-table__comments">{g.comments}</p>
        </td>
      </>
    );
  }
}
