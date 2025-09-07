import { ChangeEventHandler, useState, useEffect } from "react";
import { StudentDisplay } from "./Student.tsx";

import { mimeToXml, parseXML } from "./parser.ts";
import { Grade, Student, StudentReport } from "./types.ts";
import { GradesView } from "./GradesView.tsx";
import { Instructions } from "./Instructions.tsx";

// Define required quarters globally so it can be used for headers and grade processing
const REQUIRED_QUARTERS = ["Q1", "Q2", "Q3", "Q4", "Y1"];

function QuarterHeader() {
  return (
    <div className="quarter-header">
      <div>Term</div>
      {REQUIRED_QUARTERS.map((quarter) => (
        <div key={quarter}>{quarter}</div>
      ))}
    </div>
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
    console.log("OPTIONS");
    console.log(elements);
    return elements;
  };
  return (
    <div className="year-selector">
      <label>
        Year
        <select name={"year"} onChange={onChange} value={selectedYear || "—"}>
          {yearSelectOptions()}
        </select>
      </label>
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

  async function loadTestData() {
    try {
      const response = await fetch(
        "/power-school-reporter-react/data/test.mime"
      );
      const mimeContent = await response.text();
      const xmlStr = mimeToXml(mimeContent);
      const data: StudentReport = parseXML(xmlStr);

      // Debug logging to see exact structure
      console.log("=== PARSED DATA STRUCTURE ===");
      console.log("Student:", JSON.stringify(data.student, null, 2));
      console.log("Years:", JSON.stringify(data.years, null, 2));
      console.log("Total grades count:", data.grades.length);
      console.log(
        "First few grades:",
        JSON.stringify(data.grades.slice(0, 3), null, 2)
      );
      console.log(
        "Sample grade structure:",
        JSON.stringify(data.grades[0], null, 2)
      );
      console.log("================================");

      setStudent(data.student);
      setAllGrades(data.grades);
      setAllYears(data.years);
      // Set the first available year as default, or empty if no years
      setSelectedYear(data.years.length > 0 ? data.years[0] : "");
    } catch (error) {
      console.error("Failed to load test data:", error);
    }
  }

  useEffect(() => {
    loadTestData();
  }, []);

  function processFile(file: File) {
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
        console.log("got years");
        console.log(data.years);
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
      {/* <h1 className={"noPrint"}>Power School Report Card Tool</h1> */}
      {/* <Instructions /> */}
      <div
        className={`main-header noPrint ${isDragOver ? "drag-over" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="main-header__intro">
          <h1>Power School Report Card Tool</h1>
          <p>
            Navigate to the Powerschool Web Portal and download the MIME file
            student using the icon. Then upload it here.
          </p>
        </div>

        <div className="main-header__upload">
          <div className="drop-zone">
            <form id="form">
              <p>Drop Powerschool .mime file here or</p>
              <input
                type="file"
                name="gradeReport"
                id="gradeReport"
                onChange={onNewFile}
                className="file-input"
                accept=".mime,.xml,.txt"
              />
              <label htmlFor="gradeReport" className="file-label">
                select a file
              </label>
            </form>
          </div>
        </div>
      </div>

      {allYears.length > 0 && (
        <div className="main-content">
          <YearSelector
            yearValues={allYears}
            onChange={updateSelectedYear}
            selectedYear={selectedYear}
          />
          <StudentDisplay student={student} selectedYear={selectedYear} />

          <QuarterHeader />
          <GradesView
            gg={allGrades}
            selectedYear={selectedYear}
            requiredQuarters={REQUIRED_QUARTERS}
          />
        </div>
      )}
    </>
  );
}

export default App;
