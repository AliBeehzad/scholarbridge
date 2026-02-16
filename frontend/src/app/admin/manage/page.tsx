"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const API_URL = "https://scholarbridge-backend-nvn2.onrender.com";

interface Scholarship {
  _id: string;
  title: string;
  country: string;
  degree: string;
  deadline: string;
  description: string;
  benefits: string;
  requirements: string;
  officialLink: string;
  youtubeLink?: string;
  image?: string;
  createdAt: string;
}

interface Template {
  _id: string;
  name: string;
  description: string;
  fileUrl: string;
  createdAt: string;
}

export default function ManagePage() {
  const [activeTab, setActiveTab] = useState<"scholarships" | "templates">("scholarships");
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  // Edit states
  const [editingScholarship, setEditingScholarship] = useState<Scholarship | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  
  // Delete confirmation
  const [deleteModal, setDeleteModal] = useState<{ type: string; id: string; name: string } | null>(null);

  // Fetch data on load
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch scholarships
      const schRes = await fetch(`${API_URL}/api/scholarships`);
      const schData = await schRes.json();
      setScholarships(schData);

      // Fetch templates
      const tempRes = await fetch(`${API_URL}/api/templates`);
      const tempData = await tempRes.json();
      setTemplates(tempData);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to fetch data" });
    } finally {
      setLoading(false);
    }
  };

  // DELETE Scholarship
  const deleteScholarship = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/scholarships/${id}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        setScholarships(scholarships.filter(s => s._id !== id));
        setMessage({ type: "success", text: "Scholarship deleted successfully!" });
        setDeleteModal(null);
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to delete scholarship" });
    }
  };

  // DELETE Template
  const deleteTemplate = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/templates/${id}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        setTemplates(templates.filter(t => t._id !== id));
        setMessage({ type: "success", text: "Template deleted successfully!" });
        setDeleteModal(null);
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to delete template" });
    }
  };

  // UPDATE Scholarship
  const updateScholarship = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingScholarship) return;

    try {
      const res = await fetch(`${API_URL}/api/scholarships/${editingScholarship._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingScholarship),
      });

      if (res.ok) {
        const updated = await res.json();
        setScholarships(scholarships.map(s => 
          s._id === updated._id ? updated : s
        ));
        setMessage({ type: "success", text: "Scholarship updated successfully!" });
        setEditingScholarship(null);
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update scholarship" });
    }
  };

  // UPDATE Template
  const updateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate) return;

    try {
      const res = await fetch(`${API_URL}/api/templates/${editingTemplate._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingTemplate),
      });

      if (res.ok) {
        const updated = await res.json();
        setTemplates(templates.map(t => 
          t._id === updated._id ? updated : t
        ));
        setMessage({ type: "success", text: "Template updated successfully!" });
        setEditingTemplate(null);
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update template" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Manage Content</h1>
            <Link 
              href="/admin" 
              className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl ${
            message.type === 'success' ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'
          }`}>
            <p className={message.type === 'success' ? 'text-green-700' : 'text-red-700'}>{message.text}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("scholarships")}
            className={`px-6 py-3 rounded-xl font-semibold transition ${
              activeTab === "scholarships"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Scholarships ({scholarships.length})
          </button>
          <button
            onClick={() => setActiveTab("templates")}
            className={`px-6 py-3 rounded-xl font-semibold transition ${
              activeTab === "templates"
                ? "bg-green-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Templates ({templates.length})
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : (
          <>
            {/* SCHOLARSHIPS LIST */}
            {activeTab === "scholarships" && (
              <div className="space-y-4">
                {scholarships.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center">
                    <p className="text-gray-500 text-lg">No scholarships added yet.</p>
                    <Link href="/admin" className="text-blue-600 font-semibold mt-4 inline-block">
                      Add your first scholarship →
                    </Link>
                  </div>
                ) : (
                  scholarships.map((sch) => (
                    <div key={sch._id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900">{sch.title}</h3>
                          <div className="flex flex-wrap gap-3 mt-2 text-sm">
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">🌍 {sch.country}</span>
                            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">📚 {sch.degree}</span>
                            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full">📅 {new Date(sch.deadline).toLocaleDateString()}</span>
                          </div>
                          <p className="text-gray-600 mt-3 line-clamp-2">{sch.description}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => setEditingScholarship(sch)}
                            className="bg-yellow-500 text-white p-3 rounded-xl hover:bg-yellow-600 transition"
                            title="Edit"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeleteModal({ type: "scholarship", id: sch._id, name: sch.title })}
                            className="bg-red-500 text-white p-3 rounded-xl hover:bg-red-600 transition"
                            title="Delete"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TEMPLATES LIST */}
            {activeTab === "templates" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {templates.length === 0 ? (
                  <div className="col-span-2 bg-white rounded-2xl p-12 text-center">
                    <p className="text-gray-500 text-lg">No templates added yet.</p>
                    <Link href="/admin" className="text-green-600 font-semibold mt-4 inline-block">
                      Add your first template →
                    </Link>
                  </div>
                ) : (
                  templates.map((temp) => (
                    <div key={temp._id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900">{temp.name}</h3>
                          <p className="text-gray-600 text-sm mt-2 line-clamp-2">{temp.description}</p>
                          <a 
                            href={temp.fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-green-600 text-sm font-semibold mt-3 inline-block hover:underline"
                          >
                            View File →
                          </a>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => setEditingTemplate(temp)}
                            className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600 transition"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeleteModal({ type: "template", id: temp._id, name: temp.name })}
                            className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* EDIT SCHOLARSHIP MODAL */}
      {editingScholarship && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-4 sticky top-0">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Scholarship
              </h2>
            </div>
            
            <form onSubmit={updateScholarship} className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input 
                  type="text"
                  value={editingScholarship.title}
                  onChange={(e) => setEditingScholarship({...editingScholarship, title: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 outline-none"
                  placeholder="Title"
                  required
                />
                <input 
                  type="text"
                  value={editingScholarship.country}
                  onChange={(e) => setEditingScholarship({...editingScholarship, country: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 outline-none"
                  placeholder="Country"
                  required
                />
                <input 
                  type="text"
                  value={editingScholarship.degree}
                  onChange={(e) => setEditingScholarship({...editingScholarship, degree: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 outline-none"
                  placeholder="Degree"
                  required
                />
                <input 
                  type="date"
                  value={editingScholarship.deadline.split('T')[0]}
                  onChange={(e) => setEditingScholarship({...editingScholarship, deadline: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 outline-none"
                  required
                />
              </div>
              
              <input 
                type="url"
                value={editingScholarship.officialLink}
                onChange={(e) => setEditingScholarship({...editingScholarship, officialLink: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 outline-none"
                placeholder="Official Link"
                required
              />
              
              <input 
                type="url"
                value={editingScholarship.youtubeLink || ''}
                onChange={(e) => setEditingScholarship({...editingScholarship, youtubeLink: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 outline-none"
                placeholder="YouTube Link (Optional)"
              />
              
              <input 
                type="url"
                value={editingScholarship.image || ''}
                onChange={(e) => setEditingScholarship({...editingScholarship, image: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 outline-none"
                placeholder="Image URL (Optional)"
              />
              
              <textarea 
                value={editingScholarship.description}
                onChange={(e) => setEditingScholarship({...editingScholarship, description: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 outline-none"
                placeholder="Description"
                rows={3}
                required
              />
              
              <textarea 
                value={editingScholarship.benefits}
                onChange={(e) => setEditingScholarship({...editingScholarship, benefits: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 outline-none"
                placeholder="Benefits"
                rows={2}
              />
              
              <textarea 
                value={editingScholarship.requirements}
                onChange={(e) => setEditingScholarship({...editingScholarship, requirements: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 outline-none"
                placeholder="Requirements"
                rows={2}
              />
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-xl font-bold hover:opacity-90 transition"
                >
                  Update Scholarship
                </button>
                <button
                  type="button"
                  onClick={() => setEditingScholarship(null)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT TEMPLATE MODAL */}
      {editingTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Edit Template</h2>
            </div>
            
            <form onSubmit={updateTemplate} className="p-6 space-y-4">
              <input 
                type="text"
                value={editingTemplate.name}
                onChange={(e) => setEditingTemplate({...editingTemplate, name: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 outline-none"
                placeholder="Template Name"
                required
              />
              
              <textarea 
                value={editingTemplate.description}
                onChange={(e) => setEditingTemplate({...editingTemplate, description: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 outline-none"
                placeholder="Description"
                rows={3}
                required
              />
              
              <input 
                type="url"
                value={editingTemplate.fileUrl}
                onChange={(e) => setEditingTemplate({...editingTemplate, fileUrl: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 outline-none"
                placeholder="File URL"
                required
              />
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-xl font-bold hover:opacity-90 transition"
                >
                  Update Template
                </button>
                <button
                  type="button"
                  onClick={() => setEditingTemplate(null)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{deleteModal.name}"? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => deleteModal.type === "scholarship" 
                    ? deleteScholarship(deleteModal.id)
                    : deleteTemplate(deleteModal.id)
                  }
                  className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setDeleteModal(null)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}