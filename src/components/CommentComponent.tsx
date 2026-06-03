import { useState, useRef, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
/**
 * @typedef {'initial'|'editing'|'submitted'} CommentState
 * @typedef {{ id: number; author: string; avatar: string; time: string; text: string; file?: { name: string; size: string } }} CommentEntry
 */

// ─── Constants ────────────────────────────────────────────────────────────────
const CURRENT_VALUE = "The quick brown fox jumps over the lazy dog";

const INITIAL_COMMENTS = [
  {
    id: 1,
    author: "Vishwas Gopal Ayyar",
    avatar: "VG",
    avatarColor: "bg-orange-400",
    time: "12:45 pm",
    text: "All values form Scheme 1 and Scheme 4 are breached",
    file: null,
  },

];

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ initials, color }) {
  return (
    <div
      className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
    >
      {initials}
    </div>
  );
}

// ─── File Attachment Row ──────────────────────────────────────────────────────
function FileAttachment({ name, size, onRemove }) {
  return (
    <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-3 shadow-sm">

      {/* File Info */}
      <div className="flex items-center gap-3">

        <div className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">
          {name.split(".").pop()?.toUpperCase() || "FILE"}
        </div>

        <div className="min-w-0 max-w-[180px]">
          <p
            className="text-sm font-medium text-gray-800 truncate"
            title={name}
          >
            {name}
          </p>

          <p className="text-xs text-gray-500">
            {size}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">

        {/* Preview */}
        <button className="text-gray-500 hover:text-blue-600 transition border border-gray-200 rounded-lg p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7S3.732 16.057 2.458 12z"
            />
          </svg>
        </button>

        {/* Download */}
        <button className="text-gray-500 hover:text-green-600 transition border border-gray-200 rounded-lg p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v10m0 0l-4-4m4 4l4-4"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 20h16"
            />
          </svg>
        </button>


      </div>
    </div>
  );
}
// ─── Single Field Comment Panel (first image design) ─────────────────────────
function FieldCommentPanel({ onClose }) {
  const [state, setState] = useState(/** @type {CommentState} */("initial"));
  const [fieldValue, setFieldValue] = useState("");
  const [comment, setComment] = useState("");
  const [file, setFile] = useState(/** @type {File|null} */(null));
  const [submittedData, setSubmittedData] = useState(null);
  const fileInputRef = useRef(null);

  const isEditing = fieldValue.trim() || comment.trim() || file;

  useEffect(() => {
    if (isEditing) setState("editing");
    else if (state === "editing") setState("initial");
  }, [fieldValue, comment, file]);

  function handleSubmit() {
    if (!comment.trim()) return;
    setSubmittedData({
      field: fieldValue,
      comment,
      file: file ? { name: file.name, size: formatSize(file.size) } : null,
    });
    setState("submitted");
  }

  function handleDiscard() {
    setFieldValue("");
    setComment("");
    setFile(null);
    setSubmittedData(null);
    setState("initial");
  }

  function handleEdit() {
    if (!submittedData) return;
    setFieldValue(submittedData.field);
    setComment(submittedData.comment);
    setState("editing");
    setSubmittedData(null);
  }

  function handleDelete() {
    handleDiscard();
  }

  function formatSize(bytes) {
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${bytes}B`;
  }

  // ── Submitted State ────────────────────────────────────────────────────────
  if (state === "submitted" && submittedData) {
    return (
      <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm w-full max-w-sm">
        {/* Current value */}
        <div className="mb-3">
          <p className="text-xs text-gray-400 mb-0.5">Current value</p>
          <p className="text-sm text-gray-700">{CURRENT_VALUE}</p>
        </div>

        {/* Comment */}
        <div className="mb-3">
          <p className="text-xs text-gray-400 mb-0.5">Comment</p>
          <p className="text-sm text-gray-700">{submittedData.comment}</p>
        </div>

        {/* File */}
        {submittedData.file && (
          <div className="mb-4">
            <p className="text-xs text-gray-400 mb-1">Supporting document attached</p>
            <FileAttachment
              name={submittedData.file.name}
              size={submittedData.file.size}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleDelete}
            className="px-4 py-1.5 rounded-full border border-red-500 text-red-500 text-sm font-medium hover:bg-red-50 transition-colors"
          >
            Delete Comment
          </button>
          <button
            onClick={handleEdit}
            className="px-4 py-1.5 rounded-full bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
          >
            Edit Comment
          </button>
        </div>
      </div>
    );
  }

  // ── Initial / Editing State ────────────────────────────────────────────────
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm w-full max-w-sm">
      {/* Current value */}
      <div className="mb-4">
        <p className="text-xs text-gray-400 mb-0.5">Current value</p>
        <p className="text-sm text-gray-700">{CURRENT_VALUE}</p>
      </div>

      {/* Field label */}
      <div className="mb-4">
        <label className="text-xs text-gray-400 block mb-1">Field label</label>
        <input
          type="text"
          value={fieldValue}
          onChange={(e) => setFieldValue(e.target.value)}
          placeholder="Placeholder"
          className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
        />
      </div>

      {/* Comment textarea */}
      <div className="mb-4">
        <label className="text-xs text-gray-400 block mb-1">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Please provide a reason for the change"
          rows={3}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gray-400 resize-none transition-colors"
        />
      </div>

      {/* File upload */}
      <div className="mb-5">
        <label className="text-xs text-gray-400 block mb-1">Upload support document</label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-between border border-gray-300 rounded px-3 py-1.5 cursor-pointer hover:border-gray-400 transition-colors"
        >
          <span className="text-sm text-gray-400">
            {file ? file.name : "Select a file to upload"}
          </span>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <button
          onClick={handleDiscard}
          className="px-4 py-1.5 rounded-full border border-red-500 text-red-500 text-sm font-medium hover:bg-red-50 transition-colors"
        >
          Discard
        </button>
        <button
          onClick={handleSubmit}
          disabled={!comment.trim()}
          className="px-4 py-1.5 rounded-full bg-red-500 text-white text-sm font-medium hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Submit Suggestion
        </button>
      </div>
    </div>
  );
}

// ─── Comments Dialog (second image functionality) ─────────────────────────────
function CommentsDialog({ isOpen, onClose, comments, onAddComment }) {
  const [newComment, setNewComment] = useState("");
  const listRef = useRef(null);

  function handleSubmit() {
    if (!newComment.trim()) return;

    onAddComment({
      id: Date.now(),
      author: "Pratap Aggrawal",
      avatar: "PA",
      avatarColor: "bg-blue-500",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      text: newComment.trim(),
      file: null,
    });

    setNewComment("");
  }

  function handleDiscard() {
    setNewComment("");
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-[#2d3446] text-white rounded-xl shadow-2xl w-full max-w-md mx-4 flex flex-col max-h-[85vh] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 4v-4z" />
            </svg>
            Comment
          </div>
          <button
            onClick={() => {
              setNewComment("");
              onClose();
            }}
            className="text-gray-400 hover:text-white transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Scrollable comments list */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto px-5 py-4 space-y-5 custom-scrollbar"
        >


          {comments.map((c) => (
            <div key={c.id}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Avatar initials={c.avatar} color={c.avatarColor} />
                  <span className="font-medium text-sm">
                    {c.author}
                  </span>
                </div>

                <span className="text-xs text-gray-400">
                  {c.time}
                </span>
              </div>

              <div className="ml-10 text-sm text-gray-200">
                {c.text}
              </div>

              {c.file && (
                <div className="ml-10 mt-2">
                  <FileAttachment
                    name={c.file.name}
                    size={c.file.size}
                  />
                </div>
              )}
            </div>
          ))}

          {/* Input Section */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Avatar initials="PA" color="bg-blue-500" />
              <span className="font-medium text-sm">
                Pratap Aggrawal
              </span>
            </div>

            <div className="shadow-lg rounded-sm bg-[#2d3440] p-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Enter comment"
                rows={3}
                className="w-full bg-white border border-none rounded-lg px-3 py-2 text-sm text-gray-900"
              />
              <div className="flex justify-between mt-3">
                <button
                  onClick={handleDiscard}
                  className="px-5 py-2 rounded-sm bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                >
                  Discard
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={!newComment.trim()}
                  className="px-5 py-2 rounded-sm bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Comment
                </button>
              </div>
            </div>
          </div>


        </div>


      </div>
    </div>
  );
}

// ─── Root Comment Component ───────────────────────────────────────────────────
export default function CommentComponent() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [comments, setComments] = useState(INITIAL_COMMENTS);
  const [showFieldPanel, setShowFieldPanel] = useState(true);

  function handleAddComment(newComment) {
    setComments((prev) => [...prev, newComment]);
  }

  const commentCount = comments.filter((c) => c.text).length;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-8 p-8">

      {/* ── Section 1: Field Comment Panel (Image 1 design) ── */}
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
            Comment Component
          </h2>

          <button
            onClick={() => setDialogOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-sm border border-blue-300 bg-white text-blue-700 text-sm font-semibold shadow-sm hover:shadow-md hover:border-gray-400 transition-all"
          >
            Comments

            {commentCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-[11px] font-bold">
                {commentCount}
              </span>
            )}
          </button>
        </div>
        {showFieldPanel && <FieldCommentPanel onClose={() => setShowFieldPanel(false)} />}
      </div>





      {/* ── Comments Dialog ── */}
      <CommentsDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        comments={comments}
        onAddComment={handleAddComment}
      />
    </div>
  );
}