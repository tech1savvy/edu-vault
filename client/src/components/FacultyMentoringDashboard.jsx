import React, { useState } from 'react';
import {
    Users,
    GraduationCap,
    TrendingUp,
    Calendar,
    FileText,
    CheckCircle,
    Clock,
    AlertCircle,
    ChevronRight,
    Search,
    Menu,
    X
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for merging tailwind classes
function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// --- Mock Data ---

const MOCK_MENTEES = [
    {
        id: '1',
        name: 'Aditi Sharma',
        rollNo: 'CS21001',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aditi',
        gpa: 8.9,
        attendance: 92,
        placementReadiness: 85,
        validatedAchievements: 12,
        pendingValidations: 2,
        department: 'Computer Science',
        year: '4th Year'
    },
    {
        id: '2',
        name: 'Rohan Gupta',
        rollNo: 'CS21045',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan',
        gpa: 7.5,
        attendance: 78,
        placementReadiness: 65,
        validatedAchievements: 8,
        pendingValidations: 5,
        department: 'Computer Science',
        year: '4th Year'
    },
    {
        id: '3',
        name: 'Sneha Patel',
        rollNo: 'CS21089',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha',
        gpa: 9.2,
        attendance: 96,
        placementReadiness: 94,
        validatedAchievements: 15,
        pendingValidations: 0,
        department: 'Computer Science',
        year: '4th Year'
    },
    {
        id: '4',
        name: 'Karthik Reddy',
        rollNo: 'CS21102',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karthik',
        gpa: 6.8,
        attendance: 65,
        placementReadiness: 55,
        validatedAchievements: 5,
        pendingValidations: 1,
        department: 'Computer Science',
        year: '4th Year'
    }
];

const MOCK_ACTIVITIES = {
    '1': [
        { id: 1, title: 'Internship Offer Letter', type: 'Internship', status: 'pending', date: '2023-10-15', description: 'Summer internship at Google.' },
        { id: 2, title: 'Hackathon Winner', type: 'Achievement', status: 'validated', date: '2023-09-20', description: 'Won 1st place in Smart India Hackathon.' },
        { id: 3, title: 'NPTEL Certification', type: 'Course', status: 'validated', date: '2023-08-10', description: 'Completed Cloud Computing with Elite Silver.' },
        { id: 4, title: 'Research Paper', type: 'Publication', status: 'rejected', date: '2023-07-05', description: 'Paper on AI in Healthcare rejected due to formatting.' },
    ],
    '2': [
        { id: 1, title: 'Workshop Participation', type: 'Workshop', status: 'pending', date: '2023-10-12', description: 'Attended 3-day workshop on Blockchain.' },
        { id: 2, title: 'Mini Project', type: 'Project', status: 'validated', date: '2023-09-15', description: 'Library Management System using MERN stack.' },
    ],
    '3': [
        { id: 1, title: 'Patent Filed', type: 'Innovation', status: 'validated', date: '2023-10-01', description: 'Filed patent for Smart Irrigation System.' },
        { id: 2, title: 'Gate Score Card', type: 'Exam', status: 'validated', date: '2023-03-20', description: 'Qualified GATE with AIR 450.' },
    ],
    '4': [
        { id: 1, title: 'Online Course', type: 'Course', status: 'pending', date: '2023-10-18', description: 'Udemy React Course completion certificate.' },
    ]
};

// --- Sub-Components ---

// eslint-disable-next-line no-unused-vars
const StatsCard = ({ title, value, subtext, icon: Icon, colorClass }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-purple-100 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium text-purple-600/80 mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
            </div>
            <div className={cn("p-2 rounded-lg", colorClass)}>
                <Icon className="w-6 h-6 text-white" />
            </div>
        </div>
        {subtext && <p className="text-xs text-gray-500 mt-2">{subtext}</p>}
    </div>
);

const TimelineItem = ({ activity }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'validated': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'validated': return <CheckCircle className="w-4 h-4" />;
            case 'pending': return <Clock className="w-4 h-4" />;
            case 'rejected': return <AlertCircle className="w-4 h-4" />;
            default: return <FileText className="w-4 h-4" />;
        }
    };

    return (
        <div className="relative pl-8 pb-8 last:pb-0">
            {/* Line */}
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-purple-100 last:hidden"></div>

            {/* Icon Dot */}
            <div className={cn(
                "absolute left-0 top-0 w-6 h-6 rounded-full flex items-center justify-center border-2 bg-white",
                activity.status === 'validated' ? "border-purple-500 text-purple-600" :
                    activity.status === 'pending' ? "border-yellow-500 text-yellow-600" :
                        "border-red-500 text-red-600"
            )}>
                {getStatusIcon(activity.status)}
            </div>

            <div className="bg-white rounded-lg border border-purple-50 p-4 shadow-sm hover:border-purple-200 transition-colors">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                        <span className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-0.5 rounded-full mt-1 inline-block">
                            {activity.type}
                        </span>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">{activity.date}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{activity.description}</p>
                <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border", getStatusColor(activity.status))}>
                    <span>{activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}</span>
                </div>
            </div>
        </div>
    );
};

const StudentListItem = ({ student, isSelected, onClick }) => (
    <button
        onClick={() => onClick(student)}
        className={cn(
            "w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 text-left group",
            isSelected
                ? "bg-purple-600 text-white shadow-lg shadow-purple-200"
                : "hover:bg-purple-50 text-gray-700 bg-white"
        )}
    >
        <img
            src={student.avatar}
            alt={student.name}
            className={cn("w-12 h-12 rounded-full border-2", isSelected ? "border-white/30" : "border-purple-100")}
        />
        <div className="flex-1 min-w-0">
            <h4 className={cn("font-bold truncate", isSelected ? "text-white" : "text-gray-900")}>
                {student.name}
            </h4>
            <p className={cn("text-xs truncate", isSelected ? "text-purple-200" : "text-gray-500")}>
                {student.rollNo} • {student.department}
            </p>
        </div>
        <ChevronRight className={cn("w-5 h-5 transition-transform", isSelected ? "text-purple-200" : "text-gray-400 group-hover:translate-x-1")} />
    </button>
);

// --- Main Component ---

const FacultyMentoringDashboard = () => {
    const [selectedStudent, setSelectedStudent] = useState(MOCK_MENTEES[0]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredMentees = MOCK_MENTEES.filter(mentee =>
        mentee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentee.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const studentActivities = MOCK_ACTIVITIES[selectedStudent.id] || [];

    return (
        <div className="min-h-screen bg-purple-50 flex font-sans text-gray-800">

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed lg:sticky top-0 h-screen w-80 bg-white border-r border-purple-100 flex flex-col z-50 transition-transform duration-300 ease-in-out lg:translate-x-0",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-6 border-b border-purple-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white">
                            <GraduationCap className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 leading-tight">EduVault</h1>
                            <p className="text-xs text-purple-600 font-medium">Faculty Portal</p>
                        </div>
                        <button
                            className="ml-auto lg:hidden text-gray-500"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search mentees..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-purple-50 border border-transparent focus:bg-white focus:border-purple-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all placeholder:text-gray-400"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">Assigned Mentees ({filteredMentees.length})</h3>
                    {filteredMentees.map(student => (
                        <StudentListItem
                            key={student.id}
                            student={student}
                            isSelected={selectedStudent.id === student.id}
                            onClick={(s) => {
                                setSelectedStudent(s);
                                setIsSidebarOpen(false);
                            }}
                        />
                    ))}
                </div>

                <div className="p-4 border-t border-purple-100 bg-purple-50/50">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold text-xs">
                            JD
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">Prof. John Doe</p>
                            <p className="text-xs text-gray-500">Sr. Mentor</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 overflow-y-auto h-screen">
                <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-purple-100 px-6 py-4 flex items-center justify-between lg:hidden">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -ml-2 text-gray-600 hover:bg-purple-50 rounded-lg"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="font-semibold text-gray-900">{selectedStudent.name}</span>
                    <div className="w-8"></div> {/* Spacer for centering */}
                </header>

                <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">

                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Holistic Overview</h2>
                            <p className="text-gray-500">Tracking progress for <span className="font-semibold text-purple-700">{selectedStudent.name}</span> ({selectedStudent.rollNo})</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="px-4 py-2 bg-white border border-purple-200 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors shadow-sm">
                                Download Report
                            </button>
                            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors shadow-sm shadow-purple-200">
                                Contact Student
                            </button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatsCard
                            title="Verified Achievements"
                            value={selectedStudent.validatedAchievements}
                            subtext={`${selectedStudent.pendingValidations} pending validation`}
                            icon={CheckCircle}
                            colorClass="bg-emerald-500"
                        />
                        <StatsCard
                            title="Current GPA"
                            value={selectedStudent.gpa}
                            subtext="Top 15% of class"
                            icon={TrendingUp}
                            colorClass="bg-blue-500"
                        />
                        <StatsCard
                            title="Placement Readiness"
                            value={`${selectedStudent.placementReadiness}%`}
                            subtext="AI-driven score based on activity"
                            icon={GraduationCap}
                            colorClass="bg-purple-600"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Timeline Column */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-purple-600" />
                                    Activity Timeline
                                </h3>
                                <select className="text-sm border border-purple-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-purple-400 bg-white text-gray-600">
                                    <option>All Activities</option>
                                    <option>Pending</option>
                                    <option>Validated</option>
                                </select>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
                                {studentActivities.length > 0 ? (
                                    <div className="space-y-0">
                                        {studentActivities.map(activity => (
                                            <TimelineItem key={activity.id} activity={activity} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 text-gray-500">
                                        <p>No activities found for this student.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Side Details Column */}
                        <div className="space-y-6">
                            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-purple-200">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5" />
                                    Action Items
                                </h3>
                                <div className="space-y-3">
                                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                                        <p className="text-sm font-medium">Verify Internship Offer</p>
                                        <p className="text-xs text-purple-100 mt-1">Pending since 2 days ago</p>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                                        <p className="text-sm font-medium">Approve Leave Request</p>
                                        <p className="text-xs text-purple-100 mt-1">For Hackathon participation</p>
                                    </div>
                                </div>
                                <button className="w-full mt-4 py-2 bg-white text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors">
                                    View All Tasks
                                </button>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Student Details</h3>
                                <div className="space-y-4 text-sm">
                                    <div className="flex justify-between py-2 border-b border-purple-50">
                                        <span className="text-gray-500">Department</span>
                                        <span className="font-medium text-gray-900">{selectedStudent.department}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-purple-50">
                                        <span className="text-gray-500">Year</span>
                                        <span className="font-medium text-gray-900">{selectedStudent.year}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-purple-50">
                                        <span className="text-gray-500">Roll Number</span>
                                        <span className="font-medium text-gray-900">{selectedStudent.rollNo}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-purple-50">
                                        <span className="text-gray-500">Attendance</span>
                                        <span className={cn(
                                            "font-bold",
                                            selectedStudent.attendance >= 75 ? "text-emerald-600" : "text-red-500"
                                        )}>
                                            {selectedStudent.attendance}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default FacultyMentoringDashboard;
