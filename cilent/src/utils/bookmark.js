const KEYS = {
    internships: "sb_saved_internships",
    courses: "sb_saved_courses"
};

function getSaved(type) {
    try {
        return JSON.parse(localStorage.getItem(KEYS[type]) || "[]");
    } catch { return []; }
}

function isSaved(type, id) {
    return getSaved(type).some((x) => x._id === id || x.id === id);
}

function toggleSave(type, item) {
    const list = getSaved(type);
    const id = item._id || item.id;
    const exists = list.some((x) => (x._id || x.id) === id);
    const next = exists ? list.filter((x) => (x._id || x.id) !== id) : [...list, item];
    localStorage.setItem(KEYS[type], JSON.stringify(next));
    window.dispatchEvent(new Event("sb-bookmarks-updated"));
    return !exists;
}

export { getSaved, isSaved, toggleSave, KEYS };
