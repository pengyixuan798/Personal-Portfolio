const noteForm = document.getElementById('notion-note-form');
const noteStatus = document.getElementById('note-status');

if (noteForm && noteStatus) {
    noteForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        noteStatus.textContent = 'Saving...';

        const formData = new FormData(noteForm);
        const title = formData.get('title')?.toString().trim();
        const content = formData.get('content')?.toString().trim() || '';
        const tags = (formData.get('tags')?.toString() || '')
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean);

        try {
            const response = await fetch('/api/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, content, tags })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to save note.');
            }

            noteStatus.textContent = 'Saved to Notion successfully.';
            noteForm.reset();
        } catch (error) {
            noteStatus.textContent = error.message || 'Failed to save note.';
        }
    });
}
