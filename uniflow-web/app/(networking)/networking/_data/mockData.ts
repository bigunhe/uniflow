export type Specialization = {
  id: string;
  title: string;
  icon: string;
  description: string;
};

export type JobRole = {
  id: string;
  specializationId: string;
  title: string;
  description: string;
};

export type MentorProfile = {
  id: string;
  name: string;
  roleId: string;
  company: string;
  experience: string;
  image: string;
  online: boolean;
};

export const SPECIALIZATIONS: Specialization[] = [
  { id: "it", title: "Bachelor of Information Technology", icon: "💻", description: "Learn the foundations of computing, software development, and systems administration." },
  { id: "cyber-security", title: "Bachelor of Cyber Security", icon: "🛡️", description: "Protect networks, systems, and data from digital attacks." },
  { id: "computer-science", title: "Bachelor of Computer Science", icon: "🧠", description: "Deep dive into algorithms, computation, and programming languages." },
  { id: "computer-networking", title: "Bachelor of Computer Networking", icon: "🌐", description: "Design, implement, and manage enterprise-grade networks." },
  { id: "data-science", title: "Bachelor of Data Science", icon: "📊", description: "Extract insights from data using statistical and machine learning techniques." },
  { id: "it-engineering", title: "Bachelor of Information Technology Engineering", icon: "⚙️", description: "Bridge the gap between hardware and software systems engineering." },
  { id: "interactive-media", title: "Bachelor of Interactive Media", icon: "🎨", description: "Create engaging digital content, games, and multimedia experiences." },
  { id: "software-engineering", title: "Bachelor of Software Engineering", icon: "🛠️", description: "Apply engineering principles to the design, development, and maintenance of software." },
];

export const JOB_ROLES: JobRole[] = [
  // IT
  { id: "it-1", specializationId: "it", title: "Systems Analyst", description: "Analyze and design technology solutions for business problems." },
  { id: "it-2", specializationId: "it", title: "IT Support Specialist", description: "Provide technical assistance to users and maintain systems." },
  { id: "it-3", specializationId: "it", title: "Software Developer", description: "Build and maintain software applications." },
  { id: "it-4", specializationId: "it", title: "Database Administrator", description: "Manage and secure enterprise databases." },
  { id: "it-5", specializationId: "it", title: "IT Project Manager", description: "Lead technology projects from conception to deployment." },
  { id: "it-6", specializationId: "it", title: "Cloud Administrator", description: "Manage cloud infrastructure and deployments." },
  { id: "it-7", specializationId: "it", title: "Business Analyst", description: "Bridge the gap between IT and the business." },
  { id: "it-8", specializationId: "it", title: "Network Administrator", description: "Maintain and configure local and wide area networks." },
  { id: "it-9", specializationId: "it", title: "Quality Assurance Tester", description: "Ensure software meets quality standards." },
  { id: "it-10", specializationId: "it", title: "IT Consultant", description: "Advise organizations on technology strategy." },

  // Cyber Security
  { id: "cs-1", specializationId: "cyber-security", title: "Security Analyst", description: "Monitor networks for security breaches." },
  { id: "cs-2", specializationId: "cyber-security", title: "Penetration Tester", description: "Simulate cyber attacks to find vulnerabilities." },
  { id: "cs-3", specializationId: "cyber-security", title: "Security Engineer", description: "Build and maintain security systems." },
  { id: "cs-4", specializationId: "cyber-security", title: "Incident Responder", description: "Respond to and mitigate security breaches." },
  { id: "cs-5", specializationId: "cyber-security", title: "Security Architect", description: "Design robust security structures for organizations." },
  { id: "cs-6", specializationId: "cyber-security", title: "Cryptographer", description: "Develop algorithms to secure data." },
  { id: "cs-7", specializationId: "cyber-security", title: "Forensic Computer Analyst", description: "Investigate cybercrimes and recover data." },
  { id: "cs-8", specializationId: "cyber-security", title: "Chief Information Security Officer", description: "Lead an organization's security strategy." },
  { id: "cs-9", specializationId: "cyber-security", title: "Vulnerability Assessor", description: "Identify and prioritize security vulnerabilities." },
  { id: "cs-10", specializationId: "cyber-security", title: "Security Consultant", description: "Provide expert security advice to clients." },

  // Computer Science
  { id: "comp-1", specializationId: "computer-science", title: "Software Engineer", description: "Design and develop complex software systems." },
  { id: "comp-2", specializationId: "computer-science", title: "Machine Learning Engineer", description: "Build artificial intelligence models." },
  { id: "comp-3", specializationId: "computer-science", title: "Systems Programmer", description: "Develop operating systems and low-level software." },
  { id: "comp-4", specializationId: "computer-science", title: "Research Scientist", description: "Conduct fundamental research in computing." },
  { id: "comp-5", specializationId: "computer-science", title: "Backend Developer", description: "Build server-side logic and APIs." },
  { id: "comp-6", specializationId: "computer-science", title: "Frontend Developer", description: "Create user interfaces for web applications." },
  { id: "comp-7", specializationId: "computer-science", title: "Full Stack Developer", description: "Work on both frontend and backend systems." },
  { id: "comp-8", specializationId: "computer-science", title: "Algorithm Engineer", description: "Design and optimize complex algorithms." },
  { id: "comp-9", specializationId: "computer-science", title: "Game Developer", description: "Program core mechanics for video games." },
  { id: "comp-10", specializationId: "computer-science", title: "Data Engineer", description: "Build pipelines for large-scale data processing." },

  // Computer Networking
  { id: "cn-1", specializationId: "computer-networking", title: "Network Engineer", description: "Design and implement computer networks." },
  { id: "cn-2", specializationId: "computer-networking", title: "Network Architect", description: "Design enterprise-scale network infrastructure." },
  { id: "cn-3", specializationId: "computer-networking", title: "Systems Administrator", description: "Manage server and network environments." },
  { id: "cn-4", specializationId: "computer-networking", title: "Telecommunications Specialist", description: "Manage voice and data communication systems." },
  { id: "cn-5", specializationId: "computer-networking", title: "Wireless Network Engineer", description: "Design and secure wireless networks." },
  { id: "cn-6", specializationId: "computer-networking", title: "Network Security Engineer", description: "Secure network infrastructure from threats." },
  { id: "cn-7", specializationId: "computer-networking", title: "NOC Technician", description: "Monitor network operations and resolve issues." },
  { id: "cn-8", specializationId: "computer-networking", title: "VoIP Engineer", description: "Manage Voice over IP infrastructure." },
  { id: "cn-9", specializationId: "computer-networking", title: "Cloud Network Engineer", description: "Design network solutions in cloud environments." },
  { id: "cn-10", specializationId: "computer-networking", title: "Data Center Technician", description: "Manage physical network infrastructure in data centers." },

  // Data Science
  { id: "ds-1", specializationId: "data-science", title: "Data Scientist", description: "Analyze complex data to drive business decisions." },
  { id: "ds-2", specializationId: "data-science", title: "Data Analyst", description: "Translate data into actionable insights." },
  { id: "ds-3", specializationId: "data-science", title: "Machine Learning Scientist", description: "Research and develop new machine learning algorithms." },
  { id: "ds-4", specializationId: "data-science", title: "Business Intelligence Analyst", description: "Design dashboards and reports for business performance." },
  { id: "ds-5", specializationId: "data-science", title: "Data Engineer", description: "Build and maintain data architectures." },
  { id: "ds-6", specializationId: "data-science", title: "Statistician", description: "Apply statistical methods to solve real-world problems." },
  { id: "ds-7", specializationId: "data-science", title: "Quantitative Analyst", description: "Apply mathematical models to financial markets." },
  { id: "ds-8", specializationId: "data-science", title: "Data Architect", description: "Design the blueprint for data management systems." },
  { id: "ds-9", specializationId: "data-science", title: "AI Engineer", description: "Deploy AI solutions into production environments." },
  { id: "ds-10", specializationId: "data-science", title: "Marketing Analyst", description: "Analyze customer data to optimize marketing campaigns." },

  // IT Engineering
  { id: "ite-1", specializationId: "it-engineering", title: "Hardware Engineer", description: "Design and test computer hardware components." },
  { id: "ite-2", specializationId: "it-engineering", title: "Embedded Systems Engineer", description: "Develop software for embedded devices." },
  { id: "ite-3", specializationId: "it-engineering", title: "DevOps Engineer", description: "Bridge development and operations for software delivery." },
  { id: "ite-4", specializationId: "it-engineering", title: "Site Reliability Engineer", description: "Ensure software systems are scalable and reliable." },
  { id: "ite-5", specializationId: "it-engineering", title: "Systems Engineer", description: "Manage complex systems over their life cycles." },
  { id: "ite-6", specializationId: "it-engineering", title: "Firmware Engineer", description: "Program low-level software for hardware devices." },
  { id: "ite-7", specializationId: "it-engineering", title: "Automation Engineer", description: "Design automated systems for IT operations." },
  { id: "ite-8", specializationId: "it-engineering", title: "Robotics Engineer", description: "Design and program robotic systems." },
  { id: "ite-9", specializationId: "it-engineering", title: "IoT Solutions Architect", description: "Design Internet of Things infrastructure." },
  { id: "ite-10", specializationId: "it-engineering", title: "Integration Engineer", description: "Ensure different software and hardware systems work together." },

  // Interactive Media
  { id: "im-1", specializationId: "interactive-media", title: "UI/UX Designer", description: "Design intuitive and visually appealing user interfaces." },
  { id: "im-2", specializationId: "interactive-media", title: "Game Designer", description: "Conceptualize and design game mechanics and levels." },
  { id: "im-3", specializationId: "interactive-media", title: "3D Modeler", description: "Create 3D assets for games and animations." },
  { id: "im-4", specializationId: "interactive-media", title: "Multimedia Artist", description: "Create visual effects and animations." },
  { id: "im-5", specializationId: "interactive-media", title: "Web Designer", description: "Design the visual layout and aesthetic of websites." },
  { id: "im-6", specializationId: "interactive-media", title: "AR/VR Developer", description: "Build augmented and virtual reality experiences." },
  { id: "im-7", specializationId: "interactive-media", title: "Interaction Designer", description: "Design how users interact with digital products." },
  { id: "im-8", specializationId: "interactive-media", title: "Digital Content Creator", description: "Produce digital media for various platforms." },
  { id: "im-9", specializationId: "interactive-media", title: "Audio Engineer", description: "Design and mix sound for interactive media." },
  { id: "im-10", specializationId: "interactive-media", title: "Creative Director", description: "Lead the creative vision for multimedia projects." },

  // Software Engineering
  { id: "se-1", specializationId: "software-engineering", title: "Software Engineer", description: "Design and develop software applications and systems." },
  { id: "se-2", specializationId: "software-engineering", title: "Full Stack Developer", description: "Work on both the frontend and backend of web applications." },
  { id: "se-3", specializationId: "software-engineering", title: "Backend Engineer", description: "Build and maintain server-side logic and databases." },
  { id: "se-4", specializationId: "software-engineering", title: "Frontend Engineer", description: "Create interactive user interfaces for applications." },
  { id: "se-5", specializationId: "software-engineering", title: "DevOps Engineer", description: "Streamline software delivery and infrastructure management." },
  { id: "se-6", specializationId: "software-engineering", title: "QA Engineer", description: "Ensure software quality through automated and manual testing." },
  { id: "se-7", specializationId: "software-engineering", title: "Mobile Developer", description: "Develop applications for iOS and Android platforms." },
  { id: "se-8", specializationId: "software-engineering", title: "Software Architect", description: "Design high-level software structures and make architectural choices." },
  { id: "se-9", specializationId: "software-engineering", title: "Release Manager", description: "Manage and coordinate software release lifecycles." },
  { id: "se-10", specializationId: "software-engineering", title: "Cloud Software Engineer", description: "Build software specifically optimized for cloud environments." },
];

export const MENTORS: MentorProfile[] = [
  // A few sample mentors for demonstration purposes. In a real app, there would be mentors for every role.
  { id: "alex-rivers", name: "Alex Rivers", roleId: "comp-1", company: "Google", experience: "8 years", image: "https://i.pravatar.cc/150?u=alex", online: true },
  { id: "elena-vance", name: "Elena Vance", roleId: "cs-1", company: "Stripe", experience: "5 years", image: "https://i.pravatar.cc/150?u=elena", online: false },
  { id: "marcus-chen", name: "Marcus Chen", roleId: "cn-1", company: "Microsoft", experience: "10 years", image: "https://i.pravatar.cc/150?u=marcus", online: false },
  { id: "sarah-jenkins", name: "Sarah Jenkins", roleId: "ds-1", company: "Meta", experience: "6 years", image: "https://i.pravatar.cc/150?u=sarah", online: true },
  { id: "david-kim", name: "David Kim", roleId: "im-1", company: "Adobe", experience: "7 years", image: "https://i.pravatar.cc/150?u=david", online: true },
  { id: "priya-patel", name: "Priya Patel", roleId: "it-1", company: "Accenture", experience: "4 years", image: "https://i.pravatar.cc/150?u=priya", online: false },
  { id: "michael-scott", name: "Michael Scott", roleId: "ite-1", company: "Intel", experience: "12 years", image: "https://i.pravatar.cc/150?u=michael", online: true },
  
  // Adding mentors so every specialization has at least one
  { id: "jane-doe", name: "Jane Doe", roleId: "it-5", company: "IBM", experience: "9 years", image: "https://i.pravatar.cc/150?u=jane", online: true },
  { id: "john-smith", name: "John Smith", roleId: "cs-2", company: "CrowdStrike", experience: "3 years", image: "https://i.pravatar.cc/150?u=john", online: true },
  { id: "alice-wong", name: "Alice Wong", roleId: "comp-2", company: "OpenAI", experience: "5 years", image: "https://i.pravatar.cc/150?u=alice", online: true },
  { id: "bob-jones", name: "Bob Jones", roleId: "cn-2", company: "Cisco", experience: "15 years", image: "https://i.pravatar.cc/150?u=bob", online: false },
  { id: "clara-oswald", name: "Clara Oswald", roleId: "ds-2", company: "Netflix", experience: "4 years", image: "https://i.pravatar.cc/150?u=clara", online: true },
  { id: "dan-brown", name: "Dan Brown", roleId: "ite-2", company: "Tesla", experience: "6 years", image: "https://i.pravatar.cc/150?u=dan", online: true },
  { id: "eve-adams", name: "Eve Adams", roleId: "im-2", company: "Epic Games", experience: "8 years", image: "https://i.pravatar.cc/150?u=eve", online: true },
  { id: "tom-hardy", name: "Tom Hardy", roleId: "se-1", company: "Amazon", experience: "7 years", image: "https://i.pravatar.cc/150?u=tom", online: true },
];
