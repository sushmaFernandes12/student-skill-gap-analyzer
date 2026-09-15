/* =========================================================
   STUDENT SKILL-GAP ANALYZER
   COMPLETE JAVASCRIPT
========================================================= */


/* =========================================================
   DATABASE SKILLS
========================================================= */

let databaseSkills = [];


/* =========================================================
   SKILLS REQUIRED FOR DIFFERENT ROLES
========================================================= */

const jobSkills = {

    "web-developer": [
        "HTML",
        "CSS",
        "JavaScript",
        "Git",
        "GitHub"
    ],

    "java-developer": [
        "Java",
        "SQL",
        "DBMS",
        "Git",
        "GitHub"
    ],

    "python-developer": [
        "Python",
        "SQL",
        "Git",
        "GitHub"
    ],

    "data-analyst": [
        "Python",
        "SQL",
        "Excel",
        "DBMS"
    ],

    "software-developer": [
        "Java",
        "Python",
        "SQL",
        "Git",
        "GitHub"
    ],

    "frontend-developer": [
        "HTML",
        "CSS",
        "JavaScript",
        "React",
        "Git"
    ],

    "backend-developer": [
        "Java",
        "Python",
        "SQL",
        "DBMS",
        "Git"
    ]

};


/* =========================================================
   COURSE RECOMMENDATIONS
========================================================= */

const courseRecommendations = {

    "HTML": {
        name: "HTML Tutorial - freeCodeCamp",
        link: "https://www.freecodecamp.org/learn/2022/responsive-web-design/"
    },

    "CSS": {
        name: "CSS Tutorial - freeCodeCamp",
        link: "https://www.freecodecamp.org/learn/2022/responsive-web-design/"
    },

    "JavaScript": {
        name: "JavaScript Algorithms and Data Structures",
        link: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/"
    },

    "Java": {
        name: "Java Tutorial - GeeksforGeeks",
        link: "https://www.geeksforgeeks.org/java/"
    },

    "Python": {
        name: "Python for Everybody",
        link: "https://www.freecodecamp.org/learn/scientific-computing-with-python/"
    },

    "SQL": {
        name: "SQL Tutorial - freeCodeCamp",
        link: "https://www.freecodecamp.org/news/learn-sql-free-course/"
    },

    "DBMS": {
        name: "DBMS Tutorial - GeeksforGeeks",
        link: "https://www.geeksforgeeks.org/dbms/"
    },

    "Git": {
        name: "Git and GitHub - freeCodeCamp",
        link: "https://www.freecodecamp.org/news/git-and-github-for-beginners/"
    },

    "GitHub": {
        name: "GitHub Skills",
        link: "https://skills.github.com/"
    },

    "React": {
        name: "React Course - freeCodeCamp",
        link: "https://www.freecodecamp.org/learn/front-end-development-libraries/"
    },

    "Excel": {
        name: "Excel Tutorial - freeCodeCamp",
        link: "https://www.freecodecamp.org/news/learn-microsoft-excel/"
    }

};


/* =========================================================
   SKILL PRIORITY
========================================================= */

const skillPriority = {

    "HTML": "High",
    "CSS": "High",
    "JavaScript": "High",
    "Java": "High",
    "Python": "High",
    "SQL": "High",
    "DBMS": "High",

    "React": "Medium",
    "Git": "Medium",
    "GitHub": "Medium",
    "Excel": "Medium",

    "C++": "Low"

};


/* =========================================================
   RECOMMENDED PROJECTS
========================================================= */

const recommendedProjects = {

    "web-developer":
        "🌐 Build a responsive portfolio website using HTML, CSS and JavaScript.",

    "java-developer":
        "☕ Build a Java Student Management System using Java, SQL and DBMS.",

    "python-developer":
        "🐍 Build a Python-based data management or automation project.",

    "data-analyst":
        "📊 Build a Student Performance Analysis project using Python, SQL and Excel.",

    "software-developer":
        "💻 Build a complete software project using Java/Python, SQL and Git.",

    "frontend-developer":
        "🎨 Build a modern responsive frontend website using HTML, CSS, JavaScript and React.",

    "backend-developer":
        "⚙️ Build a REST API project using Java/Python, SQL and DBMS."

};


/* =========================================================
   ROLE DETAILS
========================================================= */

const roleDetails = {

    "web-developer":
        "Web developers create and maintain websites and web applications.",

    "java-developer":
        "Java developers build applications and backend systems using Java.",

    "python-developer":
        "Python developers create applications, automation tools and backend systems.",

    "data-analyst":
        "Data analysts collect, process and analyze data to generate useful insights.",

    "software-developer":
        "Software developers design, develop and maintain software applications.",

    "frontend-developer":
        "Frontend developers build the visual and interactive part of websites.",

    "backend-developer":
        "Backend developers create server-side applications, APIs and database systems."

};


/* =========================================================
   LOAD SKILLS FROM MYSQL DATABASE
========================================================= */

function loadSkillsFromDatabase() {

    fetch("http://localhost:8080/api/skills")

        .then(function(response) {

            if (!response.ok) {

                throw new Error(
                    "Unable to load skills from database."
                );

            }

            return response.json();

        })

        .then(function(skills) {

            const skillsContainer =
                document.getElementById("skillsContainer");

            if (!skillsContainer) {

                console.error(
                    "skillsContainer was not found."
                );

                return;
            }

            databaseSkills = skills;

            const uniqueSkills = [
                ...new Set(
                    skills.map(function(item) {
                        return item.skill_name;
                    })
                )
            ];

            skillsContainer.innerHTML = "";

            uniqueSkills.forEach(function(skill) {

                const label =
                    document.createElement("label");

                label.innerHTML = `

                    <input
                        type="checkbox"
                        value="${skill}"
                    >

                    ${skill}

                `;

                skillsContainer.appendChild(label);

            });

            console.log(
                "Skills loaded successfully:",
                uniqueSkills
            );

        })

        .catch(function(error) {

            console.error(
                "Error loading skills:",
                error
            );

            const skillsContainer =
                document.getElementById("skillsContainer");

            if (skillsContainer) {

                skillsContainer.innerHTML = `

                    <p>
                        ⚠️ Unable to load skills.
                        Please make sure the backend is running.
                    </p>

                `;

            }

        });

}


/* =========================================================
   ANALYZE SKILLS
========================================================= */

function analyzeSkills() {

    const name =
        document.getElementById("name").value.trim();

    const role =
        document.getElementById("role").value;

    const level =
        document.getElementById("level").value;

    const result =
        document.getElementById("result");

    const dashboard =
        document.getElementById("dashboard");

    const savedAnalysis =
        document.getElementById("savedAnalysis");

    const roadmap =
        document.getElementById("roadmap");

    const skillProgress =
        document.getElementById("skillProgress");


    /* VALIDATION */

    if (name === "") {

        result.innerHTML =
            "<p>⚠️ Please enter your name.</p>";

        return;
    }


    if (role === "") {

        result.innerHTML =
            "<p>⚠️ Please select a target job role.</p>";

        return;
    }


    if (level === "") {

        result.innerHTML =
            "<p>⚠️ Please select your skill level.</p>";

        return;
    }


    /* SELECTED SKILLS */

    const selectedSkills = [];

    document
        .querySelectorAll(".skills input:checked")
        .forEach(function(checkbox) {

            selectedSkills.push(
                checkbox.value
            );

        });


    /* REQUIRED SKILLS */

    let requiredSkills = [];

    const databaseRoleSkills =
        databaseSkills

            .filter(function(item) {

                return item.target_role === role;

            })

            .map(function(item) {

                return item.skill_name;

            });


    if (databaseRoleSkills.length > 0) {

        requiredSkills = [
            ...new Set(databaseRoleSkills)
        ];

    } else {

        requiredSkills =
            jobSkills[role] || [];

    }


    /* MATCHING SKILLS */

    const matchingSkills =
        requiredSkills.filter(function(skill) {

            return selectedSkills.includes(skill);

        });


    /* MISSING SKILLS */

    const missingSkills =
        requiredSkills.filter(function(skill) {

            return !selectedSkills.includes(skill);

        });


    /* SAVE TO DATABASE */

    saveStudentToDatabase(
        name,
        role,
        level,
        missingSkills
    );


    /* SKILL MATCH */

    const skillMatch =
        requiredSkills.length > 0

            ? Math.round(
                (
                    matchingSkills.length /
                    requiredSkills.length
                ) * 100
            )

            : 0;


    /* LEVEL SCORE */

    let levelScore = 0;

    if (level === "beginner") {

        levelScore = 40;

    } else if (level === "intermediate") {

        levelScore = 70;

    } else {

        levelScore = 100;

    }


    /* JOB READINESS */

    const readinessScore =
        Math.round(
            (skillMatch * 0.7) +
            (levelScore * 0.3)
        );


    /* READINESS MESSAGE */

    let readinessMessage = "";

    if (readinessScore >= 80) {

        readinessMessage =
            "🟢 Job Ready";

    } else if (readinessScore >= 50) {

        readinessMessage =
            "🟡 Almost Ready";

    } else {

        readinessMessage =
            "🔴 Needs Improvement";

    }


    /* CAREER STAGE */

    let careerStage = "";

    if (readinessScore >= 80) {

        careerStage =
            "🟢 Job Ready";

    } else if (readinessScore >= 65) {

        careerStage =
            "🔵 Job Preparation";

    } else if (readinessScore >= 40) {

        careerStage =
            "🟡 Developing";

    } else {

        careerStage =
            "🔴 Beginner";

    }


    /* LEVEL SUMMARY */

    let levelSummary = "";

    if (level === "beginner") {

        levelSummary =
            "Beginner level: Focus on fundamentals and beginner-friendly projects.";

    } else if (level === "intermediate") {

        levelSummary =
            "Intermediate level: Improve missing skills and gain practical experience.";

    } else {

        levelSummary =
            "Advanced level: Focus on projects, interviews and job applications.";

    }


    /* NEXT SKILLS */

    const priorityOrder = {

        "High": 1,
        "Medium": 2,
        "Low": 3

    };


    const nextSkills =
        missingSkills

            .slice()

            .sort(function(a, b) {

                const priorityA =
                    skillPriority[a] || "Medium";

                const priorityB =
                    skillPriority[b] || "Medium";

                return (
                    priorityOrder[priorityA] -
                    priorityOrder[priorityB]
                );

            })

            .slice(0, 3);


    /* PROJECT */

    const recommendedProject =
        recommendedProjects[role] ||
        "💻 Build a practical project related to your target role.";


    /* JOB RECOMMENDATIONS */

    const jobRecommendations =
        getJobRecommendations(
            selectedSkills
        );


    let jobRecommendationHTML = "";


    if (jobRecommendations.length > 0) {

        jobRecommendationHTML = `

            <h3>
                💼 Recommended Job Roles
            </h3>

            <div class="dashboard-grid">

                ${
                    jobRecommendations

                        .map(function(item) {

                            const roleName =
                                item.role
                                    .replaceAll("-", " ")
                                    .replace(
                                        /\b\w/g,
                                        function(letter) {
                                            return letter.toUpperCase();
                                        }
                                    );

                            return `

                                <div class="dashboard-card">

                                    <h4>
                                        💼 ${roleName}
                                    </h4>

                                    <strong>
                                        ${item.match}%
                                    </strong>

                                    <p>
                                        Skill Match
                                    </p>

                                </div>

                            `;

                        })

                        .join("")
                }

            </div>

        `;

    } else {

        jobRecommendationHTML = `

            <h3>
                💼 Recommended Job Roles
            </h3>

            <p>
                🔴 Your current skills do not match
                enough with the available job roles.
            </p>

        `;

    }


    /* COURSES */

    let courseList = "";


    missingSkills.forEach(function(skill) {

        const course =
            courseRecommendations[skill];

        const priority =
            skillPriority[skill] || "Medium";


        if (course) {

            courseList += `

                <li>

                    <strong>
                        ${skill}
                    </strong>

                    - ${priority} Priority

                    <br>

                    ${course.name}

                    <br>

                    <a
                        href="${course.link}"
                        target="_blank"
                    >
                        🎓 Learn This Skill
                    </a>

                </li>

            `;

        }

    });


    /* NEXT SKILLS HTML */

    let nextSkillsHTML = "";


    if (nextSkills.length > 0) {

        nextSkillsHTML = `

            <h3>
                🚀 Next Skills to Learn
            </h3>

            <ol>

                ${
                    nextSkills

                        .map(function(skill) {

                            return `

                                <li>

                                    <strong>
                                        ${skill}
                                    </strong>

                                    -
                                    ${skillPriority[skill] || "Medium"}
                                    Priority

                                </li>

                            `;

                        })

                        .join("")
                }

            </ol>

        `;

    } else {

        nextSkillsHTML = `

            <h3>
                🚀 Next Skills to Learn
            </h3>

            <p>
                🎉 You have learned all the required skills!
            </p>

        `;

    }


    /* =====================================================
       RESULT
    ===================================================== */

    result.innerHTML = `

        <h3>
            👋 Hello, ${name}!
        </h3>

        <p>
            <strong>Target Role:</strong>
            ${role.replaceAll("-", " ")}
        </p>

        <p>
            <strong>Skill Level:</strong>
            ${level.charAt(0).toUpperCase() + level.slice(1)}
        </p>

        <p>
            <strong>📊 Skill Match:</strong>
            ${skillMatch}%
        </p>

        <div class="progress-bar">

            <div
                class="progress-fill"
                style="width:${skillMatch}%"
            >
                ${skillMatch}%
            </div>

        </div>

        <p>
            <strong>🎯 Job Readiness Score:</strong>
            ${readinessScore}%
        </p>

        <div class="progress-bar">

            <div
                class="progress-fill"
                style="width:${readinessScore}%"
            >
                ${readinessScore}%
            </div>

        </div>

        <p>
            <strong>📈 Career Progress:</strong>
            ${careerStage}
        </p>

        <p>
            <strong>Status:</strong>
            ${readinessMessage}
        </p>

        <p>

            <strong>
                💡 Career Recommendation:
            </strong>

            ${
                readinessScore >= 80

                    ? "You are ready to start applying for jobs and internships."

                    : readinessScore >= 50

                    ? "You are close to being job ready. Focus on your missing skills and practical projects."

                    : "Focus on strengthening your fundamentals and completing recommended courses."
            }

        </p>

        <p>

            <strong>
                📌 Skill Level Summary:
            </strong>

            ${levelSummary}

        </p>

        <p>

            <strong>
                💼 Recommended Project:
            </strong>

            ${recommendedProject}

        </p>

        ${jobRecommendationHTML}

        <p>

            <strong>
                ✅ Matching Skills:
            </strong>

            ${
                matchingSkills.length > 0

                    ? matchingSkills.join(", ")

                    : "None"
            }

        </p>

        <p>

            <strong>
                ❌ Missing Skills:
            </strong>

            ${
                missingSkills.length > 0

                    ? missingSkills.join(", ")

                    : "None"
            }

        </p>

        ${nextSkillsHTML}

        <h3>
            📚 Recommended Courses
        </h3>

        ${
            courseList !== ""

                ? `<ul>${courseList}</ul>`

                : `
                    <p>
                        🎉 Excellent!
                        You have all the required skills.
                    </p>
                `
        }

    `;


    /* =====================================================
       DASHBOARD
    ===================================================== */

    dashboard.innerHTML = `

        <h3>
            📊 Skill Gap Dashboard
        </h3>

        <p>
            Your overall career-readiness summary
            for the selected job role.
        </p>

        <div class="dashboard-grid">

            <div class="dashboard-card">

                <h4>
                    📊 Skill Match
                </h4>

                <strong>
                    ${skillMatch}%
                </strong>

                <div class="progress-bar">

                    <div
                        class="progress-fill"
                        style="width:${skillMatch}%"
                    >
                        ${skillMatch}%
                    </div>

                </div>

            </div>


            <div class="dashboard-card">

                <h4>
                    🎯 Job Readiness
                </h4>

                <strong>
                    ${readinessScore}%
                </strong>

                <div class="progress-bar">

                    <div
                        class="progress-fill"
                        style="width:${readinessScore}%"
                    >
                        ${readinessScore}%
                    </div>

                </div>

            </div>


            <div class="dashboard-card">

                <h4>
                    ✅ Skills Matched
                </h4>

                <strong>
                    ${matchingSkills.length}
                </strong>

                <p>
                    out of ${requiredSkills.length}
                </p>

            </div>


            <div class="dashboard-card">

                <h4>
                    ❌ Skills Missing
                </h4>

                <strong>
                    ${missingSkills.length}
                </strong>

                <p>
                    skills to improve
                </p>

            </div>

        </div>


        <div class="missing-skills-box">

            <strong>
                ❌ Missing Skills
            </strong>

            ${
                missingSkills.length > 0

                    ? `
                        <ul>

                            ${
                                missingSkills
                                    .map(function(skill) {
                                        return `<li>${skill}</li>`;
                                    })
                                    .join("")
                            }

                        </ul>
                    `

                    : `
                        <p>
                            🎉 No missing skills!
                        </p>
                    `
            }

        </div>


        <p>

            <strong>
                📈 Current Level:
            </strong>

            ${level.charAt(0).toUpperCase() + level.slice(1)}

        </p>


        <p>

            <strong>
                🚀 Career Stage:
            </strong>

            ${careerStage}

        </p>


        <p>

            <strong>
                Status:
            </strong>

            ${readinessMessage}

        </p>

    `;


    /* =====================================================
       ROADMAP
    ===================================================== */

    let roadmapHTML = `

        <h3>
            🗺️ Personalized Learning Roadmap
        </h3>

        <p>
            Follow these steps to improve your skills
            for your target role.
        </p>

    `;


    if (missingSkills.length === 0) {

        roadmapHTML += `

            <div class="roadmap-step">

                <strong>
                    🎉 Step 1: All Required Skills Completed
                </strong>

                <p>
                    You have all the required skills.
                </p>

                <span class="roadmap-priority">
                    Ready for Projects
                </span>

            </div>

            <div class="roadmap-step">

                <strong>
                    💼 Step 2: Build Projects
                </strong>

                <p>
                    Create 2–3 projects related to your target role.
                </p>

                <span class="roadmap-priority">
                    High Priority
                </span>

            </div>

        `;

    } else {

        missingSkills.forEach(function(skill, index) {

            const priority =
                skillPriority[skill] || "Medium";


            roadmapHTML += `

                <div class="roadmap-step">

                    <strong>
                        Step ${index + 1}:
                        Learn ${skill}
                    </strong>

                    <p>
                        Focus on ${skill} to improve
                        your readiness for the
                        ${role.replaceAll("-", " ")} role.
                    </p>

                    <span class="roadmap-priority">
                        ${priority} Priority
                    </span>

                </div>

            `;

        });

    }


    roadmapHTML += `

        <div class="roadmap-step">

            <strong>
                💻 Build a Project
            </strong>

            <p>
                Apply your skills by building a practical
                project for your portfolio.
            </p>

            <span class="roadmap-priority">
                High Priority
            </span>

        </div>


        <div class="roadmap-step">

            <strong>
                📄 Prepare Your Resume
            </strong>

            <p>
                Highlight your skills, projects,
                certificates and education.
            </p>

            <span class="roadmap-priority">
                High Priority
            </span>

        </div>


        <div class="roadmap-step">

            <strong>
                🎤 Prepare for Interviews
            </strong>

            <p>
                Practice technical, coding and HR questions.
            </p>

            <span class="roadmap-priority">
                High Priority
            </span>

        </div>


        <div class="roadmap-step">

            <strong>
                🚀 Start Job Applications
            </strong>

            <p>
                Apply for internships and entry-level jobs
                after preparing your skills and resume.
            </p>

            <span class="roadmap-priority">
                Career Goal
            </span>

        </div>


        <h3>
            📊 Skill Match Breakdown
        </h3>

        <p>
            Detailed comparison of your skills
            with the required skills.
        </p>

    `;


    requiredSkills.forEach(function(skill) {

        const hasSkill =
            selectedSkills.includes(skill);

        let percentage = 0;


        if (hasSkill) {

            if (level === "advanced") {

                percentage = 100;

            } else if (level === "intermediate") {

                percentage = 70;

            } else {

                percentage = 40;

            }

        }


        roadmapHTML += `

            <div class="skill-breakdown">

                <div class="skill-breakdown-header">

                    <strong>
                        ${skill}
                    </strong>

                    <span>
                        ${percentage}%
                    </span>

                </div>

                <div class="progress-bar">

                    <div
                        class="progress-fill"
                        style="width:${percentage}%"
                    >
                        ${percentage}%
                    </div>

                </div>

            </div>

        `;

    });


    roadmap.innerHTML =
        roadmapHTML;
        /* =====================================================
       SKILL PROGRESS
    ===================================================== */

    let progressHTML = `

        <h3>
            📈 Skill Progress
        </h3>

        <p>
            Here is your current skill status
            for the selected job role.
        </p>

    `;


    requiredSkills.forEach(function(skill) {

        const hasSkill =
            selectedSkills.includes(skill);


        if (hasSkill) {

            progressHTML += `

                <div class="skill-progress-item">

                    <strong>
                        ${skill}
                    </strong>

                    <span class="skill-completed skill-status">

                        ✅ Completed

                    </span>

                </div>

            `;

        } else {

            progressHTML += `

                <div class="skill-progress-item">

                    <strong>
                        ${skill}
                    </strong>

                    <span class="skill-missing skill-status">

                        ❌ Missing

                    </span>

                </div>

            `;

        }

    });


    skillProgress.innerHTML =
        progressHTML;


    /* =====================================================
       SAVE ANALYSIS
    ===================================================== */

    localStorage.setItem(
        "skillGapAnalysis",
        result.innerHTML
    );


    savedAnalysis.innerHTML = `

        <h3>
            💾 Analysis Saved
        </h3>

        <p>
            Your latest analysis has been saved.
        </p>

    `;

}


/* =========================================================
   JOB RECOMMENDATIONS
========================================================= */

function getJobRecommendations(selectedSkills) {

    const recommendations = [];


    Object.keys(jobSkills).forEach(function(role) {

        const required =
            jobSkills[role];

        const matched =
            required.filter(function(skill) {

                return selectedSkills.includes(skill);

            });


        const match =
            required.length > 0

                ? Math.round(
                    (
                        matched.length /
                        required.length
                    ) * 100
                )

                : 0;


        if (match >= 60) {

            recommendations.push({

                role: role,
                match: match

            });

        }

    });


    recommendations.sort(function(a, b) {

        return b.match - a.match;

    });


    return recommendations.slice(0, 3);

}


/* =========================================================
   SAVE STUDENT TO DATABASE
========================================================= */

function saveStudentToDatabase(
    name,
    role,
    level,
    missingSkills
) {

    fetch("http://localhost:8080/api/students", {

        method: "POST",

        headers: {

            "Content-Type":
                "application/json"

        },

        body: JSON.stringify({

            name: name,

            target_role: role,

            skill_level: level,

            missing_skills: missingSkills

        })

    })

        .then(function(response) {

            return response.text();

        })

        .then(function(data) {

            console.log(
                "Database response:",
                data
            );

            loadHistory();

        })

        .catch(function(error) {

            console.error(
                "Error saving student:",
                error
            );

        });

}


/* =========================================================
   RESET ANALYZER
========================================================= */

function resetAnalyzer() {

    const name =
        document.getElementById("name");

    const role =
        document.getElementById("role");

    const level =
        document.getElementById("level");

    const result =
        document.getElementById("result");

    const dashboard =
        document.getElementById("dashboard");

    const savedAnalysis =
        document.getElementById("savedAnalysis");

    const roadmap =
        document.getElementById("roadmap");

    const skillProgress =
        document.getElementById("skillProgress");


    if (name) {
        name.value = "";
    }

    if (role) {
        role.value = "";
    }

    if (level) {
        level.value = "";
    }


    document
        .querySelectorAll(".skills input")
        .forEach(function(checkbox) {

            checkbox.checked = false;

        });


    if (result) {
        result.innerHTML = "";
    }

    if (dashboard) {
        dashboard.innerHTML = "";
    }

    if (savedAnalysis) {
        savedAnalysis.innerHTML = "";
    }

    if (roadmap) {
        roadmap.innerHTML = "";
    }

    if (skillProgress) {
        skillProgress.innerHTML = "";
    }


    localStorage.removeItem(
        "skillGapAnalysis"
    );

}


/* =========================================================
   DISPLAY ROLE DETAILS
========================================================= */

function displayRoleDetails() {

    const role =
        document.getElementById("role").value;

    const roleDetailsBox =
        document.getElementById("roleDetails");


    if (!roleDetailsBox) {
        return;
    }


    if (role === "") {

        roleDetailsBox.innerHTML = "";

        return;
    }


    roleDetailsBox.innerHTML = `

        <p>

            <strong>
                💼 ${role.replaceAll("-", " ")}
            </strong>

            <br>

            ${roleDetails[role] || ""}

        </p>

    `;

}


/* =========================================================
   PRINT / SAVE REPORT
========================================================= */

function printReport() {

    const result =
        document.getElementById("result");

    const dashboard =
        document.getElementById("dashboard");

    const roadmap =
        document.getElementById("roadmap");

    const skillProgress =
        document.getElementById("skillProgress");


    const printWindow =
        window.open("", "_blank");


    printWindow.document.write(`

        <html>

        <head>

            <title>
                Student Skill-Gap Analysis Report
            </title>

            <style>

                body {
                    font-family: Arial, sans-serif;
                    padding: 30px;
                }

                h1, h2, h3 {
                    color: #333;
                }

                .progress-bar {
                    background: #ddd;
                    height: 20px;
                    border-radius: 10px;
                    overflow: hidden;
                }

                .progress-fill {
                    height: 100%;
                    background: #667eea;
                    color: white;
                    text-align: center;
                }

            </style>

        </head>

        <body>

            <h1>
                Student Skill-Gap Analyzer
            </h1>

            ${result ? result.innerHTML : ""}

            ${dashboard ? dashboard.innerHTML : ""}

            ${roadmap ? roadmap.innerHTML : ""}

            ${skillProgress ? skillProgress.innerHTML : ""}

        </body>

        </html>

    `);


    printWindow.document.close();

    printWindow.focus();

    printWindow.print();

}


/* =========================================================
   DOWNLOAD TEXT REPORT
========================================================= */

function downloadReport() {

    const result =
        document.getElementById("result");

    const dashboard =
        document.getElementById("dashboard");

    const roadmap =
        document.getElementById("roadmap");


    if (!result || result.innerText.trim() === "") {

        alert(
            "Please analyze your skills first."
        );

        return;

    }


    const report = `

STUDENT SKILL-GAP ANALYZER
==========================

${result.innerText}


==========================
DASHBOARD
==========================

${dashboard ? dashboard.innerText : ""}


==========================
PERSONALIZED ROADMAP
==========================

${roadmap ? roadmap.innerText : ""}

`;


    const blob =
        new Blob(
            [report],
            {
                type: "text/plain"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download =
        "Skill-Gap-Analysis-Report.txt";


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

}
/* =========================================================
   LOAD HISTORY
========================================================= */

function loadHistory() {

    fetch("http://localhost:8080/api/history")

        .then(function(response) {

            if (!response.ok) {

                throw new Error(
                    "Unable to load history."
                );

            }

            return response.json();

        })

        .then(function(history) {

            const historyContainer =
                document.getElementById("history");


            if (!historyContainer) {
                return;
            }


            if (!history || history.length === 0) {

                historyContainer.innerHTML = `

                    <p>
                        No analysis history available.
                    </p>

                `;

                return;

            }


            /* GROUP RECORDS BY STUDENT ID */

            const grouped = {};


            history.forEach(function(item) {

                if (
                    item.name === "Test Student" ||
                    item.skill_name === "Test Skill"
                ) {
                    return;
                }


                if (!grouped[item.id]) {

                    grouped[item.id] = {

                        name: item.name,

                        target_role:
                            item.target_role,

                        skill_level:
                            item.skill_level,

                        skills: []

                    };

                }


                if (item.skill_name) {

                    grouped[item.id]
                        .skills
                        .push({

                            skill:
                                item.skill_name,

                            status:
                                item.skill_status

                        });

                }

            });


            const students =
                Object.values(grouped);


            if (students.length === 0) {

                historyContainer.innerHTML = `

                    <p>
                        No analysis history available.
                    </p>

                `;

                return;

            }


            historyContainer.innerHTML = "";


            students.forEach(function(student) {

                const card =
                    document.createElement("div");


                card.className =
                    "history-card";


                const missingSkills =
                    student.skills

                        .filter(function(item) {

                            return item.status === "Missing";

                        })

                        .map(function(item) {

                            return item.skill;

                        });


                card.innerHTML = `

                    <h4>
                        👤 ${student.name}
                    </h4>

                    <p>

                        <strong>
                            Target Role:
                        </strong>

                        ${student.target_role}

                    </p>

                    <p>

                        <strong>
                            Skill Level:
                        </strong>

                        ${student.skill_level}

                    </p>

                    <p>

                        <strong>
                            ❌ Missing Skills:
                        </strong>

                        ${
                            missingSkills.length > 0

                                ? missingSkills.join(", ")

                                : "None"
                        }

                    </p>

                `;


                historyContainer.appendChild(card);

            });

        })

        .catch(function(error) {

            console.error(
                "History error:",
                error
            );

        });

}


/* =========================================================
   CLEAR HISTORY
========================================================= */

function clearHistory() {

    const confirmClear =
        confirm(
            "Are you sure you want to clear all analysis history?"
        );


    if (!confirmClear) {
        return;
    }


    fetch(
        "http://localhost:8080/api/history",
        {
            method: "DELETE"
        }
    )

        .then(function(response) {

            return response.json();

        })

        .then(function(data) {

            alert(
                data.message ||
                "History cleared successfully."
            );


            const historyContainer =
                document.getElementById("history");


            if (historyContainer) {

                historyContainer.innerHTML = `

                    <p>
                        No analysis history available.
                    </p>

                `;

            }


            localStorage.removeItem(
                "skillGapAnalysis"
            );

        })

        .catch(function(error) {

            console.error(
                "Clear history error:",
                error
            );

            alert(
                "Unable to clear history."
            );

        });

}


/* =========================================================
   ROLE CHANGE EVENT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const role =
            document.getElementById("role");


        if (role) {

            role.addEventListener(
                "change",
                displayRoleDetails
            );

        }


        loadSkillsFromDatabase();

        loadHistory();


        /* LOAD SAVED ANALYSIS */

        const savedAnalysis =
            document.getElementById("savedAnalysis");


        const saved =
            localStorage.getItem(
                "skillGapAnalysis"
            );


        if (
            saved &&
            savedAnalysis
        ) {

            savedAnalysis.innerHTML = `

                <h3>
                    💾 Previous Analysis
                </h3>

                <p>
                    Your previous analysis is available below.
                </p>

            `;

        }

    }
);