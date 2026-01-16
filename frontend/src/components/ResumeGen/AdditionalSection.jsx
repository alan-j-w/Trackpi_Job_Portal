import React, { useState } from 'react';
import { useResume } from './ResumeContext';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const AdditionalSection = () => {
    const { resumeData, setResumeData } = useResume();
    const { additional = {} } = resumeData;
    const { projects = [], languages = [], awards = [], interests = [] } = additional;

    const [newProject, setNewProject] = useState({ title: '', description: '', link: '' });
    const [newItem, setNewItem] = useState('');
    const [activeTab, setActiveTab] = useState('projects');

    const handleAddProject = () => {
        if (!newProject.title) return;
        setResumeData(prev => ({
            ...prev,
            additional: {
                ...prev.additional,
                projects: [...(prev.additional.projects || []), { ...newProject, id: Date.now() }]
            }
        }));
        setNewProject({ title: '', description: '', link: '' });
    };

    const handleAddItem = (type) => {
        if (!newItem) return;
        setResumeData(prev => ({
            ...prev,
            additional: {
                ...prev.additional,
                [type]: [...(prev.additional[type] || []), newItem]
            }
        }));
        setNewItem('');
    };

    const handleRemoveProject = (id) => {
        setResumeData(prev => ({
            ...prev,
            additional: {
                ...prev.additional,
                projects: prev.additional.projects.filter(p => p.id !== id)
            }
        }));
    };

    const handleRemoveItem = (type, index) => {
        setResumeData(prev => ({
            ...prev,
            additional: {
                ...prev.additional,
                [type]: prev.additional[type].filter((_, i) => i !== index)
            }
        }));
    };

    return (
        <div className="space-y-8 animate-fadeIn">

            {/* Projects Section */}
            <div>
                <h4 className="text-lg font-bold text-gray-800 mb-3">Projects (Title, Description, Link)</h4>

                {projects.length > 0 && (
                    <div className="space-y-3 mb-4">
                        {projects.map(proj => (
                            <div key={proj.id} className="p-3 bg-white border rounded-lg flex justify-between items-start">
                                <div>
                                    <div className="font-bold">{proj.title}</div>
                                    <div className="text-sm text-gray-600 truncate max-w-xs">{proj.description}</div>
                                </div>
                                <button onClick={() => handleRemoveProject(proj.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="space-y-3 border p-4 rounded-xl bg-gray-50/50">
                    <input type="text" placeholder="Project Title" value={newProject.title} onChange={e => setNewProject({ ...newProject, title: e.target.value })} className="w-full border p-2 rounded outline-none focus:border-[#FFB300]" />
                    <textarea placeholder="Description" value={newProject.description} onChange={e => setNewProject({ ...newProject, description: e.target.value })} className="w-full border p-2 rounded outline-none focus:border-[#FFB300] resize-none" rows="2" />
                    <input type="text" placeholder="Link (Optional)" value={newProject.link} onChange={e => setNewProject({ ...newProject, link: e.target.value })} className="w-full border p-2 rounded outline-none focus:border-[#FFB300]" />
                    <button onClick={handleAddProject} className="w-full bg-[#FFB300] text-white font-bold py-2 rounded-lg hover:bg-[#faa300]">Add Project</button>
                </div>
            </div>

            {/* Language Section */}
            <div>
                <h4 className="text-lg font-bold text-gray-800 mb-3">Language</h4>
                <div className="flex gap-2 flex-wrap mb-2">
                    {languages.map((lang, idx) => (
                        <span key={idx} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2">{lang} <button onClick={() => handleRemoveItem('languages', idx)}>&times;</button></span>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input type="text" placeholder="Choose language" value={activeTab === 'languages' ? newItem : ''}
                        onChange={e => { setNewItem(e.target.value); setActiveTab('languages'); }}
                        className="flex-1 border p-3 rounded-lg outline-none focus:border-[#FFB300]"
                    />
                    <button onClick={() => handleAddItem('languages')} className="bg-gray-100 p-3 rounded-lg hover:bg-gray-200"><Plus size={20} /></button>
                </div>
            </div>

            {/* Awards Section */}
            <div>
                <h4 className="text-lg font-bold text-gray-800 mb-3">Awards and Achievements</h4>
                <div className="space-y-2 mb-2">
                    {awards.map((award, idx) => (
                        <div key={idx} className="bg-gray-50 px-3 py-2 rounded border text-sm flex justify-between">{award} <button onClick={() => handleRemoveItem('awards', idx)} className="text-red-400">&times;</button></div>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input type="text" placeholder="Add awards and achievements" value={activeTab === 'awards' ? newItem : ''}
                        onChange={e => { setNewItem(e.target.value); setActiveTab('awards'); }}
                        className="flex-1 border p-3 rounded-lg outline-none focus:border-[#FFB300]"
                    />
                    <button onClick={() => handleAddItem('awards')} className="bg-gray-100 p-3 rounded-lg hover:bg-gray-200"><Plus size={20} /></button>
                </div>
            </div>

        </div>
    );
};

export default AdditionalSection;
