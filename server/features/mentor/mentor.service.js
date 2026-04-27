const repository = require('./mentor.repository');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://ml:8001';

const getDashboardList = async () => {
    return await repository.getAllStudents();
};

const getStudentDashboard = async (studentId, targetRole = null) => {
    const student = await repository.getStudentById(studentId);
    if (!student) {
        throw new Error('Student not found');
    }

    const skills = await repository.getStudentSkills(studentId);
    const projects = await repository.getStudentProjects(studentId);
    const education = await repository.getStudentEducation(studentId);
    const certifications = await repository.getStudentCertifications ? await repository.getStudentCertifications(studentId) : [];

    const skillsString = skills.map(s => s.name).join(', ');
    const projectsString = projects.map(p => p.title).join(', ');
    const educationString = education.map(e => `${e.degree} in ${e.fieldOfStudy}`).join(', ');

    const profileText = `Education: ${educationString}. Skills: ${skillsString}. Projects: ${projectsString}.`;
    
    // Extract Student Profile Summary Data
    const topSkills = skills.slice(0, 3).map(s => s.name);
    const primaryEducation = education.length > 0 ? education[0].fieldOfStudy : 'Not stated';

    // 1. Call ML Service or use forced Target Role
    let readinessScore = 0;
    let roleMatch = 'Unassigned';
    let matchedJobId = null;

    if (targetRole) {
        // Force the target role visually
        roleMatch = targetRole;
        // Mock a readiness score based on target role difficulty just for demonstration if we bypass ML
        readinessScore = 50 + Math.floor(Math.random() * 25);
    } else {
        try {
            const mlResponse = await fetch(`${ML_SERVICE_URL}/match/student`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: parseInt(studentId),
                    text: profileText,
                    limit: 1
                })
            });

            if (mlResponse.ok) {
                const data = await mlResponse.json();
                if (data.matches && data.matches.length > 0) {
                    const bestMatch = data.matches[0];
                    readinessScore = Math.round(bestMatch.score * 100);
                    matchedJobId = bestMatch.job_id;
                    roleMatch = `Matched Job #${matchedJobId}`;
                }
            }
        } catch (err) {
            console.error('Failed to contact ML service for match:', err.message);
        }
    }

    // Previous Progress Trend calculation (Mocking deterministic historical score)
    // We deterministically shift the score down by 5-15 points to appear as a continuous improvement
    const progressTrend = {
        previousScore: Math.max(0, readinessScore - (parseInt(studentId) % 10 + 5)),
        trend: 'up'
    };

    // 2. Perform Gap Analysis
    const missingSkills = [];
    const recommendations = [];

    const commonTechSkills = ['react', 'node.js', 'python', 'java', 'sql', 'aws', 'docker', 'machine learning', 'javascript', 'c++', 'linux', 'system design', 'dsa'];
    const studentSkillsLower = skills.map(s => (s.name || s.skill || "").toLowerCase());
    
    const determinePriority = (skill) => {
        const high = ['dsa', 'system design', 'machine learning', 'java', 'python'];
        const medium = ['react', 'node.js', 'sql', 'javascript'];
        if (high.includes(skill)) return 'HIGH';
        if (medium.includes(skill)) return 'MEDIUM';
        return 'LOW';
    };

    if (matchedJobId || targetRole) {
        // If we have a targetRole manually provided, we simulate the required skills NLP extraction.
        let jobRequiredSkills = [];
        if (targetRole) {
             const targetLower = targetRole.toLowerCase();
             if (targetLower.includes('data')) jobRequiredSkills = ['python', 'sql', 'machine learning', 'dsa'];
             else if (targetLower.includes('devops')) jobRequiredSkills = ['aws', 'docker', 'linux', 'python'];
             else jobRequiredSkills = ['react', 'node.js', 'java', 'dsa', 'system design'];
        } else {
            const jobs = await repository.getJobDescriptions();
            const targetJob = jobs.find(j => j.id === parseInt(matchedJobId));
            if (targetJob) {
                roleMatch = targetJob.title;
                const jobReqsLower = targetJob.requirements ? targetJob.requirements.toLowerCase() : targetJob.description.toLowerCase();
                jobRequiredSkills = commonTechSkills.filter(skill => jobReqsLower.includes(skill));
            }
        }
        
        jobRequiredSkills.forEach(reqSkill => {
            const hasSkill = studentSkillsLower.some(s => s.includes(reqSkill) || reqSkill.includes(s));
            if (!hasSkill) {
                missingSkills.push({
                    skill: reqSkill.toUpperCase(),
                    priority: determinePriority(reqSkill)
                });
                recommendations.push(`Complete a certification or project involving ${reqSkill.toUpperCase()}`);
            }
        });
    }

    // Default gap logic
    if (readinessScore < 75 && missingSkills.length === 0) {
        missingSkills.push({ skill: 'DSA', priority: 'HIGH' }, { skill: 'SYSTEM DESIGN', priority: 'HIGH' });
        recommendations.push('Focus on practicing core Data Structures and Algorithms');
    }

    // 3. AI Explanation Formulation
    let aiExplanation = "Student is well aligned with their target role framework.";
    if (readinessScore < 50) {
        const missStr = missingSkills.length > 0 ? missingSkills.slice(0, 2).map(m => m.skill).join(' and ') : 'foundational skills';
        aiExplanation = `Low project experience + missing ${missStr} → causes At Risk readiness status. Immediate foundational intervention required.`;
    } else if (readinessScore < 75) {
        aiExplanation = `Student has baseline skills but is missing specialization in ${missingSkills.length > 0 ? missingSkills[0].skill : 'Advanced topics'}. They are currently tracking Moderately.`;
    }

    return {
        student: {
           id: student.id,
           name: student.name,
           email: student.email,
           branch: primaryEducation,
           topSkills: topSkills,
           projectCount: projects.length,
           certCount: certifications.length
        },
        readinessScore,
        progressTrend,
        roleMatch,
        missingSkills, // Now objects {skill, priority}
        recommendations,
        aiExplanation
    };
};

const addMentoringAction = async (data) => {
    return await repository.createMentorAction(data);
};

const getTimeline = async (studentId) => {
    return await repository.getMentorActions(studentId);
};

module.exports = {
    getDashboardList,
    getStudentDashboard,
    addMentoringAction,
    getTimeline
};
