import { ChangeEventHandler, useState } from "react";
import { StudentDisplay } from "./Student.tsx";

import { mimeToXml, parseXML } from "./parser.ts";
import { Grade, Student, StudentReport } from "./types.ts";
import { GradesView } from "./GradesView.tsx";

function GradesHeader({ quarters }: { quarters: string[] }) {
  return (
    <thead>
      <tr className="grades-table__row grades-table__row--header">
        <th scope="col" id="class-column">
          Class
        </th>
        {quarters.map((quarter) => (
          <th key={quarter} scope="col" id={`quarter-${quarter.toLowerCase()}`}>
            {quarter}
          </th>
        ))}
      </tr>
    </thead>
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
      <label htmlFor="year-select" className="sr-only">
        Select school year
      </label>
      <select
        id="year-select"
        name="year"
        onChange={onChange}
        value={selectedYear || "—"}
        aria-label="Select school year for grade report"
      >
        {yearSelectOptions()}
      </select>
    </div>
  );
}

// Extract unique quarters from grades data and sort them alphabetically
function getUniqueQuarters(grades: Grade[]): string[] {
  const quarters = new Set(grades.map(grade => grade.quarter));
  return Array.from(quarters).sort();
}

function App() {
  const [student, setStudent] = useState<Student>({
    familyName: "",
    givenName: "",
    middleName: "",
  });
  const [allGrades, setAllGrades] = useState<Grade[]>([]);
  const [allYears, setAllYears] = useState<string[]>([]);
  const [availableQuarters, setAvailableQuarters] = useState<string[]>([]);
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
        setAvailableQuarters(getUniqueQuarters(data.grades));
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

  function handleKeyDown(e: React.KeyboardEvent<HTMLElement>) {
    // Allow spacebar and Enter to trigger file selection
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      const fileInput = document.getElementById(
        "gradeReport"
      ) as HTMLInputElement;
      fileInput?.click();
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
      <header
        className={`header no-print ${isDragOver ? "header--drag-over" : ""} ${
          allYears.length > 0 ? "header--file-loaded" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="banner"
        aria-label="File upload area"
      >
        <form
          id="form"
          className="header__form"
          role="form"
          aria-labelledby="app-title"
        >
          <h1 id="app-title">PowerSchool Report Card</h1>
          <p>
            Visit your school's Powerschool website and download the .mime file
            for your student (look for the{" "}
            <span className="material-symbols-outlined" aria-hidden="true">
              download
            </span>{" "}
            icon).
          </p>
          <div
            className="file-upload-zone"
            tabIndex={0}
            role="button"
            aria-label="Drag and drop file here, or press space/enter to select file"
            onKeyDown={handleKeyDown}
          >
            <p>
              Drag and drop the .mime file here or{" "}
              <input
                type="file"
                name="gradeReport"
                id="gradeReport"
                onChange={onNewFile}
                className="header__file-input"
                accept=".mime,.xml,.txt"
                aria-describedby="file-instructions"
              />
              <label htmlFor="gradeReport" className="header__file-label">
                select a file
              </label>
            </p>
          </div>
          <div id="file-instructions" className="sr-only">
            Upload a PowerSchool MIME, XML, or text file containing grade data
          </div>
        </form>
      </header>

      {allYears.length > 0 && (
        <main
          id="main-content"
          className="content"
          role="main"
          aria-labelledby="student-name"
        >
          <section className="student-header" aria-labelledby="student-name">
            {uploadedFileName && (
              <div
                className="student-header__uploaded-file"
                role="status"
                aria-live="polite"
              >
                <span className="sr-only">Loaded file: </span>
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
          </section>

          <section aria-labelledby="grades-heading">
            <h2 id="grades-heading" className="sr-only">
              Grade Report
            </h2>
            <table
              className="grades-table"
              role="table"
              aria-labelledby="grades-heading"
            >
              <GradesHeader quarters={availableQuarters} />
              <tbody>
                <GradesView
                  gg={allGrades}
                  selectedYear={selectedYear}
                  requiredQuarters={availableQuarters}
                />
              </tbody>
            </table>
          </section>

          <footer className="footer">
            <p>PowerSchool Report Card - All Rights Reserved</p>
          </footer>
        </main>
      )}
    </>
  );
}

export default App;
