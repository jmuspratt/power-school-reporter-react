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
        <div className={"grade-" + quarter + " grades"}>
          {/* <p className={quarter + " period"}>{g.quarter}</p> */}
          <p className="grade-values">
            {g.letterGrade && (
              <span className="letter-grade">{g.letterGrade}</span>
            )}
            {g.numberGrade && (
              <span className="number-grade">{g.numberGrade}</span>
            )}
          </p>
          {g.daysAbsent && (
            <p className={"absent-" + quarter + " absent-count"}>
              {`Absent ${g.daysAbsent} days`}
            </p>
          )}
        </div>
      </>
    );
  }
}
