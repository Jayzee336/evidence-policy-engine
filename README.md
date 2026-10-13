Evidence-Based Policy Rule Engine

1. Project Overview

The Evidence-Based Policy Rule Engine is a web application developed for Laboratory Activity 1: Evidence-Based Policy Rule Engine.

The application validates custom meal plans against a documented dietary guideline. It calculates the total sodium from user-entered meals and determines whether the daily total is below the configured policy threshold.

2. Project Objectives

- Convert a documented dietary guideline into a programmatic rule.
- Accept custom meal plans from users.
- Calculate the total daily sodium intake.
- Evaluate meal plans against the configured threshold.
- Display a clear compliance result.
- Demonstrate how evidence-based policies can be implemented using a backend validation engine.

3. Dietary Policy

Policy: WHO adult sodium guideline

Configured threshold: Less than 2,000 mg of sodium per day.

Policy source: https://www.who.int/publications/i/item/9789241504836

The application uses the documented threshold as a rule in the backend. A daily total below 2,000 mg returns PASS. A total equal to or above 2,000 mg returns FLAG.

The threshold is configured in "server.js". The application does not automatically retrieve policy updates from the WHO website.

4. Technologies Used

- HTML — application structure
- CSS — user interface styling
- JavaScript — frontend interaction and calculations submitted to the backend
- Node.js — JavaScript runtime
- Express.js — backend API
- Git and GitHub — version control and project hosting

5. Main Features

- Add and remove meal entries.
- Enter a meal name and sodium value in milligrams.
- Validate submitted meal data.
- Calculate total daily sodium.
- Compare the total with the configured policy threshold.
- Display PASS or FLAG results.
- Provide a link to the policy source.
- Reject invalid meal data.

6. Project Structure

evidence-policy-engine/
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── server.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md

7. Installation and Setup

Requirements

- Node.js
- npm
- Visual Studio Code or another code editor

Instructions

1. Clone the repository or open the project folder.

2. Open a terminal in the project directory.

3. Install the dependencies:
   
   npm install

4. Start the application:
   
   npm start

5. Open the application in a browser:
   
   http://localhost:3000

Health Check

Open the following URL to verify that the backend is running:

http://localhost:3000/api/health

A successful response should contain:

{"status":"ok"}

8. Test Cases

Test Case| Total Sodium| Expected Result
Below threshold| 1,850 mg| PASS
Above threshold| 2,200 mg| FLAG
Equal to threshold| 2,000 mg| FLAG
Empty meal submission| No meal data| Rejected
Invalid meal data| Missing name or negative value| Rejected

9. How the Engine Works

1. The user enters meal names and sodium values.
2. The frontend submits the meal data to the Express API.
3. The backend checks whether the submitted data is valid.
4. The backend calculates the total sodium from all meals.
5. The total is compared with the configured threshold.
6. The API returns the policy name, source, threshold, calculated total, and compliance result.
7. The frontend displays the result to the user.

10. Limitations

- The sodium threshold is configured manually in the source code.
- Policy changes are not automatically detected.
- Sodium values are entered by the user and are not independently verified.
- The application is an educational prototype, not a clinical decision-support system.
- Individual medical or hospital dietary requirements may differ from the general adult guideline.

11. Laboratory Activity

Course activity: Lab 1 — Evidence-Based Policy Rule Engine

Topic: Public Policy & Program Outcomes

Project artifact: Compliance validation engine for institutional or policy-driven diet plans.