import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, User, Sparkles, Clock, Award, Briefcase } from 'lucide-react';
import api from '../api/axios';
import Toast from '../components/Toast';

const AboutManagePage = () => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await api.get('/about');
        if (res.data.success) {
          setAbout(res.data.about);
        }
      } catch {
        setToast({ type: 'error', message: 'Failed to load about data' });
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAbout((prev) => ({ ...prev, [name]: value }));
  };

  // Skills helpers
  const handleSkillChange = (idx, field, val) => {
    const newSkills = [...(about.skills || [])];
    newSkills[idx][field] = field === 'level' ? Number(val) : val;
    setAbout((prev) => ({ ...prev, skills: newSkills }));
  };

  const addSkill = () => {
    setAbout((prev) => ({
      ...prev,
      skills: [...(prev.skills || []), { name: 'New Skill', level: 90, category: 'General' }]
    }));
  };

  const removeSkill = (idx) => {
    setAbout((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== idx)
    }));
  };

  // Software helpers
  const handleSoftwareChange = (idx, field, val) => {
    const newSoftware = [...(about.softwareKnowledge || [])];
    newSoftware[idx][field] = val;
    setAbout((prev) => ({ ...prev, softwareKnowledge: newSoftware }));
  };

  const addSoftware = () => {
    setAbout((prev) => ({
      ...prev,
      softwareKnowledge: [
        ...(prev.softwareKnowledge || []),
        { name: 'New Tool', proficiency: 'Expert', icon: '' }
      ]
    }));
  };

  const removeSoftware = (idx) => {
    setAbout((prev) => ({
      ...prev,
      softwareKnowledge: prev.softwareKnowledge.filter((_, i) => i !== idx)
    }));
  };

  // Work Process helpers
  const handleProcessChange = (idx, field, val) => {
    const newProcess = [...(about.workProcess || [])];
    newProcess[idx][field] = field === 'stepNumber' ? Number(val) : val;
    setAbout((prev) => ({ ...prev, workProcess: newProcess }));
  };

  // Statistics helpers
  const handleStatChange = (idx, field, val) => {
    const newStats = [...(about.statistics || [])];
    newStats[idx][field] = val;
    setAbout((prev) => ({ ...prev, statistics: newStats }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/about', about);
      if (res.data.success) {
        setToast({ type: 'success', message: 'About profile & Designer Name updated across all pages!' });
      }
    } catch (err) {
      setToast({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update about data'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse max-w-4xl mx-auto">
        <div className="h-8 bg-slate-200 rounded w-1/3"></div>
        <div className="h-64 bg-slate-200 rounded-3xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">About Story & Profile</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage your biography, core competencies, software toolstack, and workflow.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile & Biography Card */}
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          <h3 className="font-bold text-base text-slate-900">Designer Profile & Biography</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Designer Name <span className="text-indigo-600 font-normal lowercase">(shows on all website headers & footers)</span>
              </label>
              <input
                type="text"
                name="designerName"
                value={about?.designerName || ''}
                onChange={handleChange}
                placeholder="e.g. Gracy Pandya"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-slate-900 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Professional Tagline
              </label>
              <input
                type="text"
                name="tagline"
                value={about?.tagline || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-slate-900 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              About Page Headline
            </label>
            <input
              type="text"
              name="headline"
              value={about?.headline || ''}
              onChange={handleChange}
              placeholder="e.g. Design Built with Rigor, Craft, and Purpose."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-slate-900 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Profile Portrait Image URL
              </label>
              <input
                type="url"
                value={about?.profileImage?.url || ''}
                onChange={(e) =>
                  setAbout((prev) => ({
                    ...prev,
                    profileImage: { ...prev.profileImage, url: e.target.value }
                  }))
                }
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-slate-900 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Years of Experience
              </label>
              <input
                type="number"
                name="experienceYears"
                value={about?.experienceYears || 8}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-slate-900 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Short Bio Intro
            </label>
            <textarea
              rows="2"
              name="bioIntro"
              value={about?.bioIntro || ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-slate-900 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Full Narrative Biography
            </label>
            <textarea
              rows="5"
              name="bioFull"
              value={about?.bioFull || ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-slate-900 focus:bg-white"
            />
          </div>
        </div>

        {/* Core Competencies / Skills Editor */}
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">Skills & Competency Levels</h3>
              <p className="text-xs text-slate-500">Rendered with visual progress bars on the About page</p>
            </div>
            <button
              type="button"
              onClick={addSkill}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Skill</span>
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {(about?.skills || []).map((skill, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200"
              >
                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) => handleSkillChange(idx, 'name', e.target.value)}
                  placeholder="Skill title"
                  className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={skill.level}
                    onChange={(e) => handleSkillChange(idx, 'level', e.target.value)}
                    className="w-16 px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-mono text-center font-bold"
                  />
                  <span className="text-xs font-bold text-slate-400">%</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeSkill(idx)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Software Mastery Editor */}
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">Software & Tools</h3>
              <p className="text-xs text-slate-500">Design software and level of mastery</p>
            </div>
            <button
              type="button"
              onClick={addSoftware}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Tool</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {(about?.softwareKnowledge || []).map((soft, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200"
              >
                <input
                  type="text"
                  value={soft.name}
                  onChange={(e) => handleSoftwareChange(idx, 'name', e.target.value)}
                  placeholder="Tool name (e.g. Adobe Illustrator)"
                  className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold"
                />
                <select
                  value={soft.proficiency}
                  onChange={(e) => handleSoftwareChange(idx, 'proficiency', e.target.value)}
                  className="px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800"
                >
                  <option value="Master">Master</option>
                  <option value="Expert">Expert</option>
                  <option value="Proficient">Proficient</option>
                  <option value="Advanced">Advanced</option>
                </select>
                <button
                  type="button"
                  onClick={() => removeSoftware(idx)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 4-Step Work Process Editor */}
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900">4-Step Creative Workflow</h3>
          <p className="text-xs text-slate-500">Methodology displayed on the public About page</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {(about?.workProcess || []).map((step, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-400">Step {idx + 1}</span>
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => handleProcessChange(idx, 'title', e.target.value)}
                    placeholder="Step Title"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold"
                  />
                </div>
                <textarea
                  rows="2"
                  value={step.description}
                  onChange={(e) => handleProcessChange(idx, 'description', e.target.value)}
                  placeholder="Phase summary..."
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Statistics Counters Editor */}
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900">Key Numerical Statistics</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(about?.statistics || []).map((stat, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                  placeholder="Label (e.g. Completed Projects)"
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                    placeholder="180"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-mono font-bold"
                  />
                  <input
                    type="text"
                    value={stat.suffix}
                    onChange={(e) => handleStatChange(idx, 'suffix', e.target.value)}
                    placeholder="+"
                    className="w-12 px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-mono text-center font-bold"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};

export default AboutManagePage;
