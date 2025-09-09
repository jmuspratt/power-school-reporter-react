import { Grade } from "./types.ts";
import { SubjectView } from "./SubjectView.tsx";

export function GradesView({
  gg,
  selectedYear,
  requiredQuarters,
}: {
  gg: Grade[];
  selectedYear?: string;
  requiredQuarters: string[];
}) {
  if (gg.length == 0 || selectedYear == "") {
    return null;
  }

  //TODO: Pass in year to filter on as a prop
  const yearGrades = gg.filter((g) => g.year == selectedYear);
  console.log(yearGrades);
  const gradesByClass = new Map<string, Grade[]>();
  yearGrades.forEach((e) => {
    if (!gradesByClass.get(e.code)) {
      gradesByClass.set(e.code, []);
    }
    gradesByClass.get(e.code)?.push(e);
  });

  const buildGradeRows = () => {
    const rows: React.JSX.Element[] = [];

    // Ensure that each row includes a record for all required quarters
    // If a record is missing, add a placeholder Grade object with empty values

    // Fill in missing quarters for each class
    gradesByClass.forEach((grades) => {
      const existingQuarters = new Set(grades.map((g) => g.quarter));

      requiredQuarters.forEach((quarter) => {
        if (!existingQuarters.has(quarter)) {
          // Create a placeholder grade based on the first existing grade for this class
          const templateGrade = grades[0];
          const placeholderGrade: Grade = {
            code: templateGrade.code,
            title: templateGrade.title,
            instructor: templateGrade.instructor,
            school: templateGrade.school,
            year: templateGrade.year,
            grade: "",
            quarter: quarter,
            numberGrade: "",
            letterGrade: "",
            comments: "",
            daysAbsent: "",
          };
          grades.push(placeholderGrade);
        }
      });

      // Sort grades by quarter order based on the required quarters array
      grades.sort((a, b) => {
        const aIndex = requiredQuarters.indexOf(a.quarter);
        const bIndex = requiredQuarters.indexOf(b.quarter);
        // If quarter not found in required quarters, put it at the end
        const aOrder = aIndex === -1 ? 999 : aIndex;
        const bOrder = bIndex === -1 ? 999 : bIndex;
        return aOrder - bOrder;
      });
    });

    function displaySubjectGrade(
      v: Grade[],
      k: string
    ) {
      rows.push(<SubjectView key={k} grades={v} />);
    }

    gradesByClass.forEach(displaySubjectGrade);

    console.log("returning rows >>" + rows.length);
    return rows;
  };

  return <>{buildGradeRows()}</>;
}
