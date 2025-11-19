import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { notesService } from "@/services/api/notesService";

const NotesEditor = () => {
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const savedNotes = await notesService.getNotes();
      setNotes(savedNotes.content || "");
      setLastSaved(savedNotes.lastUpdated);
    } catch (error) {
      console.error("Failed to load notes:", error);
    }
  };

  const saveNotes = async () => {
    setIsSaving(true);
    try {
      const updatedNotes = await notesService.saveNotes(notes);
      setLastSaved(updatedNotes.lastUpdated);
      toast.success("Notes saved successfully");
    } catch (error) {
      console.error("Failed to save notes:", error);
      toast.error("Failed to save notes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTextChange = (e) => {
    setNotes(e.target.value);
  };

  const insertText = (before, after = "") => {
    const textarea = document.getElementById("notes-textarea");
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = notes.substring(start, end);
    const newText = notes.substring(0, start) + before + selectedText + after + notes.substring(end);
    
    setNotes(newText);
    
    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const formatLastSaved = () => {
    if (!lastSaved) return "Never saved";
    const date = new Date(lastSaved);
    return `Last saved: ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Daily Notes</h3>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">{formatLastSaved()}</span>
            <Button
              onClick={saveNotes}
              loading={isSaving}
              size="sm"
              icon="Save"
            >
              Save
            </Button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertText("**", "**")}
            title="Bold"
          >
            <ApperIcon name="Bold" size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertText("*", "*")}
            title="Italic"
          >
            <ApperIcon name="Italic" size={14} />
          </Button>
          <div className="w-px h-4 bg-gray-300"></div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertText("- ")}
            title="Bullet List"
          >
            <ApperIcon name="List" size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertText("1. ")}
            title="Numbered List"
          >
            <ApperIcon name="ListOrdered" size={14} />
          </Button>
          <div className="w-px h-4 bg-gray-300"></div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertText("[", "](url)")}
            title="Link"
          >
            <ApperIcon name="Link" size={14} />
          </Button>
        </div>

        {/* Editor */}
        <textarea
          id="notes-textarea"
          value={notes}
          onChange={handleTextChange}
          placeholder="Enter your daily notes here... Use **bold** and *italic* formatting."
          className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
        />

        {/* Preview */}
        {notes && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
            <div className="p-4 bg-gray-50 rounded-lg text-sm">
              <div
                dangerouslySetInnerHTML={{
                  __html: notes
                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                    .replace(/\*(.*?)\*/g, "<em>$1</em>")
                    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-amber-600 underline">$1</a>')
                    .replace(/^- (.+)$/gm, "• $1")
                    .replace(/^\d+\. (.+)$/gm, "<ol><li>$1</li></ol>")
                    .replace(/\n/g, "<br>")
                }}
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default NotesEditor;