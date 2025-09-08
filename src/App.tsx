import { ChangeEventHandler, useState } from "react";
import { StudentDisplay } from "./Student.tsx";

import { mimeToXml, parseXML } from "./parser.ts";
import { Grade, Student, StudentReport } from "./types.ts";
import { GradesView } from "./GradesView.tsx";

// Define required quarters globally so it can be used for headers and grade processing
const REQUIRED_QUARTERS = ["Q1", "Q2", "Q3", "Q4", "Y1"];

function TableHeader() {
  return (
    <tr className="grades-table__row grades-table__row--header">
      <th>Class</th>
      {REQUIRED_QUARTERS.map((quarter) => (
        <th key={quarter}>{quarter}</th>
      ))}
    </tr>
  );
}

// yearValues appears to be unset
function YearSelector({
  yearValues,
  onChange,
  selectedYear,
}: {
  yearValues: string[];
  onChange: ChangeEventHandler;
  selectedYear: string;
}): JSX.Element {
  const yearSelectOptions = () => {
    // Create a copy and add default blank value if not present
    const allYears = [...yearValues];
    if (!allYears.includes("-")) {
      allYears.push("-");
    }
    const elements = allYears.sort().map((v) => {
      return (
        <option key={v} value={v}>
          {v}
        </option>
      );
    });
    return elements;
  };
  return (
    <div className="year-selector">
      <select name={"year"} onChange={onChange} value={selectedYear || "—"}>
        {yearSelectOptions()}
      </select>
    </div>
  );
}

function App() {
  const [student, setStudent] = useState<Student>({
    familyName: "",
    givenName: "",
    middleName: "",
  });
  const [allGrades, setAllGrades] = useState<Grade[]>([]);
  const [allYears, setAllYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");

  function processFile(file: File) {
    setUploadedFileName(file.name);
    const r = new FileReader();
    r.readAsText(file);
    r.onloadend = () => {
      if (typeof r.result === "string") {
        const xmlStr = mimeToXml(r.result);
        const data: StudentReport = parseXML(xmlStr);
        setStudent(data.student);
        setAllGrades(data.grades);
        setAllYears(data.years);
        // Set the first available year as default, or empty if no years
        setSelectedYear(data.years.length > 0 ? data.years[0] : "");
      }
    };
  }

  function onNewFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(false);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  }

  //TODO: Find the right type
  function updateSelectedYear(e: React.ChangeEvent<HTMLInputElement>) {
    setSelectedYear(e.target.value);
    e.preventDefault();
  }

  // mame years change. Allow for  update when the year is selected.
  return (
    <>
      <div
        className={`header no-print ${isDragOver ? "header--drag-over" : ""} ${
          allYears.length > 0 ? "header--file-loaded" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <form id="form" className="header__form">
          <h1>Power School Report Card</h1>
          <p>
            Visit your school’s Powerschool website and download the MIME file
            for your student (look for the{" "}
            <span className="material-symbols-outlined">download</span> icon).
          </p>
          <p>
            Drag and drop a .mime file here or{" "}
            <input
              type="file"
              name="gradeReport"
              id="gradeReport"
              onChange={onNewFile}
              className="header__file-input"
              accept=".mime,.xml,.txt"
            />
            <label htmlFor="gradeReport" className="header__file-label">
              select a file
            </label>
          </p>
        </form>
      </div>

      {allYears.length > 0 && (
        <div className="content">
          <div className="student-header">
            {uploadedFileName && (
              <div className="student-header__uploaded-file">
                {uploadedFileName}
              </div>
            )}
            <div className="student-header__info">
              <StudentDisplay student={student} selectedYear={selectedYear} />
              <YearSelector
                yearValues={allYears}
                onChange={updateSelectedYear}
                selectedYear={selectedYear}
              />
            </div>
          </div>

          <table className="grades-table">
            <TableHeader />
            <GradesView
              gg={allGrades}
              selectedYear={selectedYear}
              requiredQuarters={REQUIRED_QUARTERS}
            />
          </table>
        </div>
      )}
    </>
  );
}

export default App;
