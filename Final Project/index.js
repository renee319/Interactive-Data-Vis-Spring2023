import ColumnChart from "/src/generateColumnChart.js";
import LineChart from "/src/generateLineChart.js";
import PieChart from "/src/generatePieChart.js";

document.querySelector("#app").innerHTML = `
  <div>
    <div class="container">
      <h1>Occupation vs Sex vs Degree</h1>
      <div class="select-container">
        <label for="pie_select_category">Occupation</label>
        <select id="pie_select_category" name="pie_select_category">
          <option value="Marital Status">Marital Status</option>
          <option value="Household Relationship">Household Relationship</option>
          <option value="Nativity">Nativity</option>
          <option value="Citizenship">Citizenship</option>
          <option value="Year of entry">Year of entry</option>
          <option value="Labor Force Status">Labor Force Status</option>
          <option value="Occupation (Employed Civilians Only)" selected>Occupation (Employed Civilians Only)</option>
          <option value="Industry (Employed Civilians Only)">Industry (Employed Civilians Only)</option>
        </select>
        <label for="pie_select_gender">Gender</label>
        <select id="pie_select_gender" name="pie_select_gender">
          <option value="Total" selected>All</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <label for="pie_select_grade">Grade</label>
        <select id="pie_select_grade" name="pie_select_grade">
          <option value="Total" selected>All</option>
          <option value="None - 8th grade">None - 8th grade</option>
          <option value="9th - 11th grade">9th - 11th grade</option>
          <option value="High school graduate">High school graduate</option>
          <option value="Some college - no degree">Some college - no degree</option>
          <option value="Associate's degree">Associate's degree</option>
          <option value="Bachelor's degree">Bachelor's degree</option>
          <option value="Master's degree">Master's degree</option>
          <option value="Professional degree">Professional degree</option>
          <option value="Doctoral degree">Doctoral degree</option>
        </select>
      </div>
      <div class="chart-container" id="pie-chart">
        <svg>
          <g class="container"></g>
        </svg>
      </div>
    </div>
    <div class="container">
      <h1>Education Attainment of Male and Female from 2010 to Present</h1>
      <div class="select-container">
        <label for="column_select">Characteristics</label>
        <select id="column_select" name="column_select">
          <option value="Total" selected>All</option>
          <optgroup label="Marital Status">
            <option value="Married, spouse present">Married, spouse present</option>
            <option value="Married, spouse absent, not separated">Married, spouse absent</option>
            <option value="Separated">Separated</option>
            <option value="Widowed">Widowed</option>
            <option value="Divorced">Divorced</option>
            <option value="Never married">Never married</option>
          </optgroup>
          <optgroup label="Household Relationship">
            <option value="Family householder">Family householder</option>
            <option value="Married, spouse present">Married, spouse present</option>
            <option value="Other family householder">Other family householder</option>
            <option value="Nonfamily householder">Nonfamily householder</option>
            <option value="Living alone">Living alone</option>
            <option value="Living with nonrelatives">Living with nonrelatives</option>
            <option value="Relative of householder">Relative of householder</option>
            <option value="Spouse">Spouse</option>
            <option value="Other">Other</option>
            <option value="Nonrelative">Nonrelative</option>
          </optgroup>
          <optgroup label="Nativity">
            <option value="Native born">Native born</option>
            <option value="Native parentage">Native parentage</option>
            <option value="Other family householder">Other family householder</option>
          </optgroup>
          <optgroup label="Citizenship">
            <option value="Foreign born">Foreign born</option>
            <option value="Naturalized citizen">Naturalized citizen</option>
            <option value="Not a citizen">Not a citizen</option>
          </optgroup>
          <optgroup label="Year of entry">
            <option value="2010 or later">2010 or later</option>
            <option value="2000-2009">2000-2009</option>
            <option value="1990-1999">1990-1999</option>
            <option value="1980-1989">1980-1989</option>
            <option value="1970-1979">1970-1979</option>
            <option value="Before 1970">Before 1970</option>
          </optgroup>
          <optgroup label="Labor Force Status">
            <option value="Employed">Employed</option>
            <option value="Unemployed">Unemployed</option>
            <option value="Not in civilian labor force">Not in civilian labor force</option>
          </optgroup>
          <optgroup label="Occupation (Employed Civilians Only)">
            <option value="Employed Civilians">Employed Civilians</option>
            <option value="Management, business, and financial occupations">Management, business, and financial occupations</option>
            <option value="Professional and related occupations">Professional and related occupations</option>
            <option value="Service occupations">Service occupations</option>
            <option value="Sales and related occupations">Sales and related occupations</option>
            <option value="Office and administrative occupations">Office and administrative occupations</option>
            <option value="Farming, forestry, and fishing occupations">Farming, forestry, and fishing occupations</option>
            <option value="Construction and extraction occupations">Construction and extraction occupations</option>
            <option value="Installation, maintenance, and repair occupations">Installation, maintenance, and repair occupations</option>
            <option value="Production occupations">Production occupations</option>
            <option value="Transportation and material moving occupations">Transportation and material moving occupations</option>
          </optgroup>
          <optgroup label="Industry (Employed Civilians Only)">
            <option value="Employed Civilians">Employed Civilians</option>
            <option value="Agricultural, forestry, fishing, and hunting">Agricultural, forestry, fishing, and hunting</option>
            <option value="Mining">Mining</option>
            <option value="Construction">Construction</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Wholesale and retail trade">Wholesale and retail trade</option>
            <option value="Transportation and utilities">Transportation and utilities</option>
            <option value="Information">Information</option>
            <option value="Financial activities">Financial activities</option>
            <option value="Professional and business services">Professional and business services</option>
            <option value="Educational and health services">Educational and health services</option>
            <option value="Leisure and hospitality">Leisure and hospitality</option>
            <option value="Other services">Other services</option>
            <option value="Public administration">Public administration</option>
          </optgroup>
        </select>
      </div>
      <div class="chart-container" id="bar-chart">
        <svg></svg>
      </div>
    </div>
    <div class="container">
      <h1>Education Attainment across Different Race</h1>
      <div class="select-container">
        <label for="line_select_options">Education Level</label>
        <select id="line_select_options" name="line_select_options">
          <option value="25 Years and Over, Completed 4 Years of High School or more" selected>25 Years and Over, Completed 4 Years of High School or more</option>
          <option value="25 Years and Over, Completed 4 Years of College or more">25 Years and Over, Completed 4 Years of College or more</option>
          <option value="25 to 29 Years, Completed 4 Years of High School or more">25 to 29 Years, Completed 4 Years of High School or more</option>
          <option value="25 to 29 Years, Completed 4 Years of College or more">25 to 29 Years, Completed 4 Years of College or more</option>
        </select>
        <label for="line_select_gender">Gender</label>
        <select id="line_select_gender" name="line_select_gender">
          <option value="Total" selected>All</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>
      <div class="chart-container" id="line-chart">
        <svg></svg>
      </div>
    </div>
  </div>
`;

const lineChart = new LineChart("#line-chart svg");

lineChart.update(
  "./data/race/25 to 29 Years, Completed 4 Years of College or more.csv"
);

const lineSelect = document.querySelector("#line_select_options");

lineSelect.addEventListener("change", (event) => {
  lineChart.update(`./data/race/${event.target.value}.csv`);
});

const genderSelect = document.querySelector("#line_select_gender");

genderSelect.addEventListener("change", (event) => {
  lineChart.updateGender(event.target.value);
});

const columnChart = new ColumnChart("#bar-chart svg");

columnChart.update();

setTimeout(() => {
  columnChart.update();
});

const columnSelect = document.querySelector("#column_select");

columnSelect.addEventListener("change", (event) => {
  columnChart.update(event.target.value);
});

const pieChart = new PieChart("#pie-chart svg");

pieChart.update();

const pieCategorySelect = document.querySelector("#pie_select_category");
const pieGenderSelect = document.querySelector("#pie_select_gender");
const pieGradeSelect = document.querySelector("#pie_select_grade");

pieCategorySelect.addEventListener("change", (event) => {
  pieChart.update(
    event.target.value,
    pieGenderSelect.value,
    pieGradeSelect.value
  );
});

pieGenderSelect.addEventListener("change", (event) => {
  pieChart.update(
    pieCategorySelect.value,
    event.target.value,
    pieGradeSelect.value
  );
});

pieGradeSelect.addEventListener("change", (event) => {
  pieChart.update(
    pieCategorySelect.value,
    pieGenderSelect.value,
    event.target.value
  );
});
