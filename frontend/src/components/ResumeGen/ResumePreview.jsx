import React from 'react';
import { useResume } from './ResumeContext';

const ResumePreview = () => {
    const { resumeData } = useResume();
    const { personalInfo, education, experience, skills, additional } = resumeData;
    const { hard = [], soft = [] } = skills;
    const { projects = [], languages = [], awards = [], interests = [] } = additional;

    return (
        <div className="w-[210mm] h-[297mm] bg-white shadow-2xl mx-auto p-[15mm] text-gray-800 font-serif leading-relaxed overflow-hidden relative box-border" id="resume-preview">

            {/* Header */}
            <div className="text-center mb-6">
                <h1 className="text-4xl font-bold text-gray-900 mb-2 uppercase tracking-wider">
                    {personalInfo.fullName || "Your Name"}
                </h1>
                <p className="text-sm font-bold tracking-[0.2em] text-gray-600 uppercase">
                    {personalInfo.role || "Professional Role"}
                </p>
                <div className="w-16 h-0.5 bg-gray-900 mx-auto mt-4"></div>
            </div>

            {/* Professional Summary */}
            {personalInfo.summary && (
                <div className="mb-6 text-center">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest mb-2 text-gray-900">Professional Summary</h3>
                    <p className="text-xs text-center text-gray-700 max-w-xl mx-auto leading-relaxed">
                        {personalInfo.summary}
                    </p>
                </div>
            )}

            {/* Contact Info */}
            <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 border-t border-b border-gray-200 py-3 mb-8 text-[9px] uppercase tracking-wider text-gray-500 font-bold">
                {personalInfo.phone && (
                    <div>
                        <span className="text-green-700 mr-1">Phone:</span>
                        {personalInfo.phone}
                    </div>
                )}
                {personalInfo.email && (
                    <div>
                        <span className="text-green-700 mr-1">Email:</span>
                        {personalInfo.email}
                    </div>
                )}
                {personalInfo.address && (
                    <div>
                        <span className="text-green-700 mr-1">Location:</span>
                        {personalInfo.address}
                    </div>
                )}
            </div>

            {/* Main Content Info */}
            <div className="space-y-6 text-sm">

                {/* Education */}
                {education.length > 0 && (
                    <section>
                        <h3 className="text-xs font-bold text-green-700 uppercase tracking-widest mb-3 border-b border-gray-100 pb-1">Education</h3>
                        <div className="space-y-4">
                            {education.map(edu => (
                                <div key={edu.id}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h4 className="font-bold text-gray-900 text-sm">
                                            {edu.degree}
                                        </h4>
                                        <span className="text-xs font-semibold text-gray-600">{edu.year}</span>
                                    </div>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <p className="text-xs italic text-gray-700">{edu.school}</p>
                                        {edu.gpa && <p className="text-[10px] text-gray-500 font-medium">GPA: {edu.gpa}</p>}
                                    </div>
                                    {edu.description && <p className="text-xs text-gray-600 mt-1">{edu.description}</p>}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Experience / Internship */}
                {experience.length > 0 && (
                    <section>
                        <h3 className="text-xs font-bold text-green-700 uppercase tracking-widest mb-3 border-b border-gray-100 pb-1 mt-6">Work Experience</h3>
                        <div className="space-y-4">
                            {experience.map(exp => (
                                <div key={exp.id}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h4 className="font-bold text-gray-900 text-sm">
                                            {exp.role}
                                        </h4>
                                        <span className="text-xs font-semibold text-gray-600">{exp.duration}</span>
                                    </div>
                                    <p className="text-xs italic text-green-700 font-medium mb-1">{exp.company}</p>
                                    <p className="text-xs text-gray-600 leading-relaxed max-w-[95%] text-justify">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects */}
                {projects.length > 0 && (
                    <section>
                        <h3 className="text-xs font-bold text-green-700 uppercase tracking-widest mb-3 border-b border-gray-100 pb-1 mt-6">Projects</h3>
                        <div className="space-y-4">
                            {projects.map(proj => (
                                <div key={proj.id}>
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <h4 className="font-bold text-gray-900 text-sm">{proj.title}</h4>
                                        {proj.link && <a href={proj.link} className="text-[9px] text-blue-500 hover:text-blue-700 underline" target="_blank" rel="noreferrer">Link</a>}
                                    </div>
                                    <p className="text-xs text-gray-600 leading-relaxed text-justify">{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Skills */}
                {(hard.length > 0 || soft.length > 0) && (
                    <section className="mt-6 page-break-inside-avoid">
                        <h3 className="text-xs font-bold text-green-700 uppercase tracking-widest mb-3 border-b border-gray-100 pb-1">Skills</h3>
                        <div className="grid grid-cols-2 gap-8">
                            {hard.length > 0 && (
                                <div>
                                    <h4 className="text-[10px] font-bold text-gray-900 uppercase mb-2">Hard Skills</h4>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                                        {hard.map((skill, idx) => (
                                            <span key={idx} className="text-xs text-gray-700 relative pl-3 before:content-['•'] before:absolute before:left-0 before:text-gray-400">{skill}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {soft.length > 0 && (
                                <div>
                                    <h4 className="text-[10px] font-bold text-gray-900 uppercase mb-2">Soft Skills</h4>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                                        {soft.map((skill, idx) => (
                                            <span key={idx} className="text-xs text-gray-700 relative pl-3 before:content-['•'] before:absolute before:left-0 before:text-gray-400">{skill}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* Awards & Languages */}
                {(awards.length > 0 || languages.length > 0) && (
                    <section className="mt-6 page-break-inside-avoid">
                        <div className="grid grid-cols-2 gap-8">
                            {awards.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-bold text-green-700 uppercase tracking-widest mb-3 border-b border-gray-100 pb-1">Awards</h3>
                                    <ul className="list-none space-y-1">
                                        {awards.map((award, idx) => (
                                            <li key={idx} className="text-xs text-gray-700 relative pl-3 before:content-['•'] before:absolute before:left-0 before:text-gray-400">
                                                {award}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {languages.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-bold text-green-700 uppercase tracking-widest mb-3 border-b border-gray-100 pb-1">Languages</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {languages.map((lang, idx) => (
                                            <span key={idx} className="text-xs text-gray-800 bg-gray-100 px-2 py-1 rounded-sm border border-gray-200">{lang}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                )}

            </div>
        </div>
    );
};

export default ResumePreview;
