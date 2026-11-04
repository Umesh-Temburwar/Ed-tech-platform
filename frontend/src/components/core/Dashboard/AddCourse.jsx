import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { getCategories, createCourse, addSection, addLesson, publishCourse } from "../../../services/courseService";
import { uploadThumbnail } from "../../../services/uploadService";
import { useCourseDraftAutosave } from "../../../hooks/useCourseDraftAutosave";
import { markDraftPublished } from "../../../services/courseDraftService";
import { FaCloudUploadAlt, FaYoutube, FaVideo, FaPlus, FaTrash, FaCheck } from "react-icons/fa";
import VideoPreview from "../../common/VideoPreview";

// Simple tag input component
function TagInput({ value, onChange }) {
  const [draft, setDraft] = useState("");
  function addTag(e) {
    e.preventDefault();
    const t = draft.trim();
    if (!t || value.includes(t)) return;
    onChange([...value, t]);
    setDraft("");
  }
  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {value.map(tag => (
          <span key={tag} className="px-2 py-0.5 rounded bg-surface-2 text-xs text-text flex items-center gap-1 border border-border">
            {tag}
            <button type="button" onClick={() => onChange(value.filter(t => t !== tag))} className="text-muted hover:text-text font-bold">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(e); } }}
          placeholder="Add tag and press Enter"
          className="flex-1 px-3 py-2 text-xs rounded-md bg-surface-2 border border-border focus:border-accent outline-none text-text transition-colors"
        />
        <button type="button" onClick={addTag} className="px-3 py-2 text-xs font-semibold rounded-md bg-surface-2 border border-border text-text hover:bg-surface transition-colors">Add</button>
      </div>
    </div>
  );
}

const STEPS = ["Details", "Curriculum", "Pricing", "Publish"];

export default function AddCourse({ setActiveSection, initialStep = 0 }) {
  const navigate = useNavigate();
  const { user }  = useSelector((state) => state.profile);
  const [step, setStep] = useState(initialStep);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [courseCategories, setCourseCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [isCustomThumbnail, setIsCustomThumbnail] = useState(false);

  // Generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      + '-' + Date.now().toString(36);
  };

  const [data, setData] = useState({
    title: "",
    subtitle: "",
    category: "",
    level: "Beginner",
    language: "English",
    tags: [],
    prerequisites: "",
    description: "",
    coverImage: null,
    videoType: "youtube",
    videoUrl: "",
    videoFile: null,
    sections: [
      { id: Date.now(), title: "Introduction", lectures: [{ id: Date.now() + 1, title: "Welcome", duration: 0 }] }
    ],
    price: "",
    isFree: false,
    visibility: "private",
    duration: "",
    outcomes: [],
    requirements: [],
    preview_video_url: "",
    preview_video_id: null,
    preview_thumbnail: null,
    video_provider: "youtube",
    video_duration: null,
  });

  const {
    isHydrating,
    saveState,
    saveError,
    lastSavedAt,
    draftMeta,
    forceSave,
  } = useCourseDraftAutosave({
    instructorId: user?.id,
    data,
    step,
    setData,
    setStep,
  });

  useEffect(() => {
    let isMounted = true;
    (async () => {
      setCategoriesLoading(true);
      const categoriesData = await getCategories();
      if (isMounted) {
        if (!categoriesData.error) setCourseCategories(categoriesData.data);
        setCategoriesLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  function update(field, value) {
    setData(d => ({ ...d, [field]: value }));
    if (field === 'coverImage' && value) {
      setIsCustomThumbnail(true);
      const reader = new FileReader();
      reader.onloadend = () => setThumbnailPreview(reader.result);
      reader.readAsDataURL(value);
    }
    if (field === 'videoFile' && value) {
      const reader = new FileReader();
      reader.onloadend = () => setVideoPreview(reader.result);
      reader.readAsDataURL(value);
    }
  }

  function updateSection(idx, patch) {
    setData(d => ({
      ...d,
      sections: d.sections.map((s, i) => i === idx ? { ...s, ...patch } : s)
    }));
  }

  function appendBlankSection() {
    setData(d => ({ ...d, sections: [...d.sections, { id: Date.now(), title: "New Section", lectures: [] }] }));
  }

  function addLecture(sectionIdx) {
    setData(d => ({
      ...d,
      sections: d.sections.map((s, i) => i === sectionIdx ? { ...s, lectures: [...s.lectures, { id: Date.now(), title: "New Lecture", duration: 0 }] } : s)
    }));
  }

  function addOutcome() {
    setData(d => ({ ...d, outcomes: [...d.outcomes, ""] }));
  }

  function updateOutcome(idx, text) {
    setData(d => ({
      ...d,
      outcomes: d.outcomes.map((o, i) => i === idx ? text : o)
    }));
  }

  function removeOutcome(idx) {
    setData(d => ({
      ...d,
      outcomes: d.outcomes.filter((_, i) => i !== idx)
    }));
  }

  function addRequirement() {
    setData(d => ({ ...d, requirements: [...d.requirements, ""] }));
  }

  function updateRequirement(idx, text) {
    setData(d => ({
      ...d,
      requirements: d.requirements.map((r, i) => i === idx ? text : r)
    }));
  }

  function removeRequirement(idx) {
    setData(d => ({
      ...d,
      requirements: d.requirements.filter((_, i) => i !== idx)
    }));
  }

  const handleVideoDataChange = useCallback(({ videoId, thumbnail, isValid }) => {
    setData(d => ({
      ...d,
      preview_video_id: videoId,
      preview_thumbnail: thumbnail,
      video_provider: isValid ? "youtube" : null,
    }));
    if (!isCustomThumbnail) {
      setThumbnailPreview(thumbnail || null);
    }
  }, [isCustomThumbnail]);

  function validateCurrentStep() {
    if (step === 0) {
      if (!data.title.trim()) return "Title is required";
      if (!data.category) return "Category is required";
      if (!data.description.trim()) return "Description is required";
      if (data.videoType === 'upload' && !data.coverImage && !thumbnailPreview) return "Thumbnail is required";
      if (data.videoType === 'youtube' && !data.preview_video_url.trim()) return "YouTube URL is required";
      if (data.videoType === 'upload' && !data.videoFile) return "Video file is required";
    } else if (step === 1) {
      if (!data.sections.length) return "At least one section required";
    } else if (step === 2) {
      if (!data.isFree && !data.price) return "Price is required for paid courses";
    }
    return null;
  }

  async function handleNext() {
    const v = validateCurrentStep();
    if (v) { setError(v); toast.error(v); return; }
    setError(null);
    if (step < STEPS.length - 1) setStep(step + 1);
  }

  function handlePrev() { if (step > 0) setStep(step - 1); }

  async function handlePublish() {
    const v = validateCurrentStep();
    if (v) { setError(v); toast.error(v); return; }
    setError(null);
    setSaving(true);
    const toastId = toast.loading("Saving your course...");
    try {
      const instructorId = user?.id;
      if (!instructorId) throw new Error("Not authenticated");
      await forceSave();

      const { data: course, error: courseErr } = await createCourse(instructorId, {
        title:               data.title,
        slug:                generateSlug(data.title),
        course_description:  data.description,
        price:               data.isFree ? 0 : Number(data.price),
        category_id:         data.category || null,
        tags:                Array.isArray(data.tags) ? data.tags : [],
        learning_outcomes:   Array.isArray(data.outcomes) ? data.outcomes : [],
        requirements:        Array.isArray(data.requirements) ? data.requirements : [],
        is_free:             data.isFree,
        preview_video_url:   data.preview_video_url,
        preview_video_id:    data.preview_video_id,
        preview_thumbnail:   data.preview_thumbnail,
        video_provider:      data.video_provider,
        video_duration:      data.video_duration,
      }, "draft");

      if (courseErr) {
        console.error("Course creation failed:", courseErr);
        throw new Error(courseErr.message || "Failed to create course");
      }

      if (!course) {
        throw new Error("No course returned from createCourse");
      }

      if (data.coverImage) {
        toast.loading("Uploading thumbnail...", { id: toastId });
        const { url, error: upErr } = await uploadThumbnail(instructorId, course.id, data.coverImage);
        if (upErr) {
          toast.error(`Thumbnail upload failed: ${upErr}`, { id: toastId });
        } else if (url) {
          const { updateCourse } = await import("../../../services/courseService");
          await updateCourse(course.id, { thumbnail: url });
        }
      } else if (!isCustomThumbnail && thumbnailPreview) {
        const { updateCourse } = await import("../../../services/courseService");
        await updateCourse(course.id, { thumbnail: thumbnailPreview });
      }

      toast.loading("Building curriculum...", { id: toastId });
      for (let si = 0; si < data.sections.length; si++) {
        const sec = data.sections[si];
        const { data: sectionRow, error: secErr } = await addSection(course.id, sec.title, si);
        if (secErr || !sectionRow) continue;
        for (let li = 0; li < sec.lectures.length; li++) {
          const lec = sec.lectures[li];
          await addLesson(sectionRow.id, {
            title:         lec.title,
            video_url:     data.videoType === "youtube" ? data.preview_video_url : "",
            time_duration: String(lec.duration ?? 0),
            order_index:   li,
          });
        }
      }

      toast.loading("Publishing your course...", { id: toastId });
      const { error: publishErr } = await publishCourse(course.id);
      if (publishErr) {
        throw new Error(
          publishErr.message ||
            "Course was saved but publishing failed. Open My Courses and try publishing again."
        );
      }

      if (draftMeta?.id) {
        await markDraftPublished(draftMeta.id, course.id);
      }

      toast.success("Course published successfully!", { id: toastId, duration: 5000 });
      navigate("/dashboard/instructor/my-courses");
    } catch (e) {
      console.error("handlePublish error:", e);
      setError(e.message || "Failed to save course. Please try again.");
      toast.error(e.message || "Failed to save course.", { id: toastId });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-surface p-6 rounded-xl border border-border">
        <div>
          <h1 className="text-2xl font-bold text-text">Add New Course</h1>
          <p className="text-xs text-muted mt-1">Configure curriculum, metadata, and pricing.</p>
          <p className="text-xs mt-1.5 text-muted">
            {isHydrating && "Loading draft..."}
            {!isHydrating && saveState === "saving" && "Saving draft..."}
            {!isHydrating && saveState === "saved" && `Autosaved${lastSavedAt ? ` · ${new Date(lastSavedAt).toLocaleTimeString()}` : ""}`}
            {!isHydrating && saveState === "error" && (saveError || "Failed to save draft.")}
          </p>
        </div>
        <div className="flex gap-2">
          {step > 0 && (
            <button onClick={handlePrev} className="px-4 py-2 text-xs rounded-md bg-surface-2 hover:bg-surface border border-border text-text font-medium transition-colors">
              Back
            </button>
          )}
          {step < STEPS.length - 1 && (
            <button onClick={handleNext} className="px-4 py-2 text-xs font-semibold rounded-md bg-accent text-white hover:opacity-90 transition-opacity">
              Next Step
            </button>
          )}
          {step === STEPS.length - 1 && (
            <button disabled={saving} onClick={handlePublish} className="px-5 py-2 text-xs font-semibold rounded-md bg-hot text-white hover:bg-[#e5482a] disabled:opacity-50 transition-colors">
              {saving ? "Publishing..." : "Publish Course"}
            </button>
          )}
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex justify-between items-center px-4 max-w-2xl mx-auto">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center gap-1.5 relative">
              <div className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold border transition-colors ${
                i < step
                  ? "bg-success text-white border-success"
                  : i === step
                    ? "bg-hot text-white border-hot"
                    : "bg-surface-2 text-muted border-border"
              }`}>
                {i < step ? <FaCheck className="text-[10px]" /> : i + 1}
              </div>
              <span className={`text-xs font-medium ${i <= step ? "text-text" : "text-muted"}`}>{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-3 -mt-5 transition-colors ${i < step ? "bg-success" : "bg-border"}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {error && (
        <div className="px-4 py-3 rounded-lg bg-danger/10 border border-danger/30 text-danger text-xs font-medium">
          {error}
        </div>
      )}

      {/* Step Content */}
      <div className="bg-surface p-6 rounded-xl border border-border">
        {step === 0 && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-5 lg:col-span-2">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-text">Course Title <span className="text-danger">*</span></label>
                <input
                  value={data.title || ""}
                  onChange={e => update('title', e.target.value)}
                  placeholder="e.g. Distributed Systems & Algorithms"
                  className="w-full px-3.5 py-2.5 text-xs rounded-md bg-surface-2 border border-border focus:border-accent outline-none text-text transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-text">Course Description <span className="text-danger">*</span></label>
                <textarea
                  rows={5}
                  value={data.description || ""}
                  onChange={e => update('description', e.target.value)}
                  placeholder="Provide a thorough overview of course objectives, prerequisites, and concepts taught..."
                  className="w-full resize-none px-3.5 py-2.5 text-xs rounded-md bg-surface-2 border border-border focus:border-accent outline-none text-text transition-colors"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-text">Category <span className="text-danger">*</span></label>
                  <select
                    value={data.category || ""}
                    onChange={e => update('category', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-md bg-surface-2 border border-border focus:border-accent outline-none text-text cursor-pointer"
                    disabled={categoriesLoading}
                  >
                    <option value="">
                      {categoriesLoading ? "Loading categories..." : "Select Category"}
                    </option>
                    {courseCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-text">Level <span className="text-danger">*</span></label>
                  <select
                    value={data.level}
                    onChange={e => update('level', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-md bg-surface-2 border border-border focus:border-accent outline-none text-text cursor-pointer"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-semibold text-text">Estimated Duration</label>
                  <input
                    value={data.duration || ""}
                    onChange={e => update('duration', e.target.value)}
                    placeholder="e.g. 12 Weeks (40 Hours)"
                    className="w-full px-3 py-2 text-xs rounded-md bg-surface-2 border border-border focus:border-accent outline-none text-text"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-semibold text-text">Tags</label>
                  <TagInput value={data.tags} onChange={v => update('tags', v)} />
                </div>
              </div>

              {/* Outcomes & Requirements */}
              <div className="grid gap-6 md:grid-cols-2 pt-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-text">What You'll Learn</label>
                    <button type="button" onClick={addOutcome} className="text-xs font-medium text-accent hover:underline flex items-center gap-1">
                      <FaPlus className="text-[10px]" /> Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {data.outcomes.map((outcome, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          value={outcome || ""}
                          onChange={e => updateOutcome(idx, e.target.value)}
                          placeholder="Outcome concept..."
                          className="flex-1 px-3 py-1.5 text-xs rounded-md bg-surface-2 border border-border focus:border-accent outline-none text-text"
                        />
                        <button type="button" onClick={() => removeOutcome(idx)} className="px-2 text-muted hover:text-danger text-xs">✕</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-text">Requirements</label>
                    <button type="button" onClick={addRequirement} className="text-xs font-medium text-accent hover:underline flex items-center gap-1">
                      <FaPlus className="text-[10px]" /> Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {data.requirements.map((req, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          value={req || ""}
                          onChange={e => updateRequirement(idx, e.target.value)}
                          placeholder="Prerequisite..."
                          className="flex-1 px-3 py-1.5 text-xs rounded-md bg-surface-2 border border-border focus:border-accent outline-none text-text"
                        />
                        <button type="button" onClick={() => removeRequirement(idx)} className="px-2 text-muted hover:text-danger text-xs">✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Media & Preview */}
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-text">Intro Preview Video</label>
                <div className="flex gap-2 bg-surface-2 p-1 rounded-md border border-border">
                  <button
                    type="button"
                    onClick={() => update('videoType', 'youtube')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded flex items-center justify-center gap-1.5 transition-colors ${
                      data.videoType === 'youtube' ? 'bg-surface text-text shadow-sm' : 'text-muted hover:text-text'
                    }`}
                  >
                    <FaYoutube className="text-danger" /> YouTube
                  </button>
                  <button
                    type="button"
                    onClick={() => update('videoType', 'upload')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded flex items-center justify-center gap-1.5 transition-colors ${
                      data.videoType === 'upload' ? 'bg-surface text-text shadow-sm' : 'text-muted hover:text-text'
                    }`}
                  >
                    <FaVideo className="text-muted" /> MP4 Upload
                  </button>
                </div>
              </div>

              {data.videoType === 'youtube' ? (
                <div className="space-y-3">
                  <VideoPreview
                    url={data.preview_video_url}
                    onChange={(url) => update('preview_video_url', url)}
                    onVideoDataChange={handleVideoDataChange}
                  />
                  {thumbnailPreview && (
                    <div className="space-y-1">
                      <p className="text-[11px] text-muted font-medium">Auto-fetched Thumbnail</p>
                      <div className="aspect-video rounded-md overflow-hidden border border-border bg-surface-2">
                        <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-text">Course Thumbnail <span className="text-danger">*</span></label>
                    <div className="aspect-video rounded-md border border-dashed border-border bg-surface-2 flex flex-col items-center justify-center relative overflow-hidden">
                      {thumbnailPreview ? (
                        <img src={thumbnailPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-muted">
                          <FaCloudUploadAlt className="text-2xl" />
                          <p className="text-[11px]">Upload cover image</p>
                        </div>
                      )}
                      <input type="file" accept="image/*" onChange={e => update('coverImage', e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-text">Video File <span className="text-danger">*</span></label>
                    <div className="aspect-video rounded-md border border-dashed border-border bg-surface-2 flex flex-col items-center justify-center relative overflow-hidden">
                      {videoPreview ? (
                        <div className="text-center p-3">
                          <FaVideo className="text-xl text-accent mx-auto mb-1" />
                          <p className="text-xs text-text font-medium truncate max-w-[180px]">{data.videoFile?.name}</p>
                          <p className="text-[10px] text-muted">{(data.videoFile?.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-muted">
                          <FaCloudUploadAlt className="text-2xl" />
                          <p className="text-[11px]">Upload MP4 preview</p>
                        </div>
                      )}
                      <input type="file" accept="video/mp4" onChange={e => update('videoFile', e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h2 className="text-sm font-semibold text-text">Curriculum Modules</h2>
                <p className="text-xs text-muted">Group lessons into sequential learning sections.</p>
              </div>
              <button
                onClick={appendBlankSection}
                className="px-3 py-1.5 text-xs rounded-md bg-surface-2 border border-border text-text font-medium hover:bg-surface transition-colors"
              >
                + Add Section
              </button>
            </div>

            <div className="space-y-4">
              {data.sections.map((s, idx) => (
                <div key={s.id} className="rounded-lg border border-border bg-surface-2 p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded bg-surface border border-border flex items-center justify-center text-xs font-semibold text-text shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      value={s.title || ""}
                      onChange={e => updateSection(idx, { title: e.target.value })}
                      className="flex-1 bg-surface border border-border rounded px-3 py-1.5 text-xs text-text font-medium outline-none focus:border-accent"
                      placeholder="Section Title (e.g. Fundamentals of Memory Management)"
                    />
                  </div>

                  <div className="pl-9 space-y-2">
                    {s.lectures.map((l, lIdx) => (
                      <div key={l.id} className="flex items-center gap-2 bg-surface border border-border rounded px-3 py-2">
                        <span className="text-[10px] text-muted font-mono">{lIdx + 1}.</span>
                        <input
                          value={l.title || ""}
                          onChange={e => {
                            setData(d => ({
                              ...d,
                              sections: d.sections.map((sec, i) => i === idx ? {
                                ...sec,
                                lectures: sec.lectures.map(ll => ll.id === l.id ? { ...ll, title: e.target.value } : ll)
                              } : sec)
                            }));
                          }}
                          className="flex-1 bg-transparent outline-none text-xs text-text"
                          placeholder="Lecture title"
                        />
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            value={String(l.duration ?? "")}
                            onChange={e => {
                              const val = e.target.value === "" ? "" : Number(e.target.value);
                              setData(d => ({
                                ...d,
                                sections: d.sections.map((sec, i) => i === idx ? {
                                  ...sec,
                                  lectures: sec.lectures.map(ll => ll.id === l.id ? { ...ll, duration: val } : ll)
                                } : sec)
                              }));
                            }}
                            className="w-12 bg-surface-2 border border-border rounded px-1.5 py-0.5 text-center text-xs text-text outline-none"
                            placeholder="Min"
                          />
                          <span className="text-[10px] text-muted font-medium">min</span>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => addLecture(idx)}
                      className="text-xs text-accent font-medium hover:underline flex items-center gap-1 pt-1"
                    >
                      <FaPlus className="text-[9px]" /> Add Lecture
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-2xl mx-auto py-2 space-y-6">
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-text">Course Pricing Structure</label>
              <div className="flex items-center gap-6 p-4 rounded-lg bg-surface-2 border border-border">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-text">
                  <input
                    type="radio"
                    checked={data.isFree}
                    onChange={() => update('isFree', true)}
                    className="accent-hot cursor-pointer"
                  />
                  <span>Free Course</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-text">
                  <input
                    type="radio"
                    checked={!data.isFree}
                    onChange={() => update('isFree', false)}
                    className="accent-hot cursor-pointer"
                  />
                  <span>Paid Course</span>
                </label>
              </div>
            </div>

            {!data.isFree && (
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-text">Price in INR (₹) <span className="text-danger">*</span></label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted font-semibold text-xs">₹</span>
                  <input
                    type="number"
                    value={data.price ?? ""}
                    onChange={e => update('price', e.target.value)}
                    placeholder="e.g. 1499"
                    className="w-full pl-8 pr-4 py-2.5 text-xs rounded-md bg-surface-2 border border-border focus:border-accent outline-none text-text font-medium"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-text">Publish Visibility</label>
              <select
                value={data.visibility}
                onChange={e => update('visibility', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-md bg-surface-2 border border-border focus:border-accent outline-none text-text cursor-pointer"
              >
                <option value="private">Private (Only you can access)</option>
                <option value="public">Public (Visible to students in catalog)</option>
              </select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="pb-3 border-b border-border">
              <h2 className="text-base font-bold text-text">Review Course Details</h2>
              <p className="text-xs text-muted">Verify before publishing to the platform catalog.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="aspect-video rounded-lg overflow-hidden border border-border bg-surface-2">
                {thumbnailPreview ? (
                  <img src={thumbnailPreview} alt="Course Thumbnail" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted text-xs">No thumbnail</div>
                )}
              </div>
              <div className="space-y-2.5">
                <h3 className="text-base font-bold text-text line-clamp-2">{data.title}</h3>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-surface-2 text-muted text-[10px] font-medium border border-border uppercase">{data.level}</span>
                  <span className="px-2 py-0.5 rounded bg-surface-2 text-muted text-[10px] font-medium border border-border uppercase">
                    {courseCategories.find(c => c.id === data.category)?.name || 'General'}
                  </span>
                </div>
                <p className="text-xl font-bold text-text">{data.isFree ? "Free" : `₹${data.price}`}</p>
                <p className="text-xs text-muted">Visibility: <span className="font-medium text-text uppercase">{data.visibility}</span></p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-surface-2 border border-border">
              <h4 className="text-xs font-semibold text-text uppercase tracking-wider mb-3">Curriculum Structure</h4>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-2.5 rounded bg-surface border border-border">
                  <p className="text-[10px] text-muted uppercase font-medium">Sections</p>
                  <p className="text-sm font-bold text-text">{data.sections.length}</p>
                </div>
                <div className="p-2.5 rounded bg-surface border border-border">
                  <p className="text-[10px] text-muted uppercase font-medium">Lectures</p>
                  <p className="text-sm font-bold text-text">{data.sections.reduce((a, s) => a + s.lectures.length, 0)}</p>
                </div>
                <div className="p-2.5 rounded bg-surface border border-border">
                  <p className="text-[10px] text-muted uppercase font-medium">Video Source</p>
                  <p className="text-sm font-bold text-text uppercase">{data.videoType}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
