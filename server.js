require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/notes', async (req, res) => {
    const notionToken = process.env.NOTION_TOKEN;
    const notionDatabaseId = process.env.NOTION_DATABASE_ID;

    if (!notionToken || !notionDatabaseId) {
        return res.status(500).json({
            error: 'Missing NOTION_TOKEN or NOTION_DATABASE_ID.'
        });
    }

    const title = typeof req.body.title === 'string' ? req.body.title.trim() : '';
    const content = typeof req.body.content === 'string' ? req.body.content.trim() : '';
    const tags = Array.isArray(req.body.tags)
        ? req.body.tags.map((tag) => String(tag).trim()).filter(Boolean)
        : [];

    if (!title) {
        return res.status(400).json({ error: 'Title is required.' });
    }

    const properties = {
        Title: {
            title: [
                {
                    text: { content: title }
                }
            ]
        },
        Content: {
            rich_text: content
                ? [
                    {
                        text: { content }
                    }
                ]
                : []
        },
        Date: {
            date: { start: new Date().toISOString() }
        }
    };

    if (tags.length > 0) {
        properties.Tags = {
            multi_select: tags.map((tag) => ({ name: tag }))
        };
    }

    try {
        const notionResponse = await fetch('https://api.notion.com/v1/pages', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + notionToken,
                'Content-Type': 'application/json',
                'Notion-Version': '2022-06-28'
            },
            body: JSON.stringify({
                parent: { database_id: notionDatabaseId },
                properties
            })
        });

        const notionData = await notionResponse.json();

        if (!notionResponse.ok) {
            return res.status(502).json({
                error: notionData.message || 'Notion API request failed.'
            });
        }

        return res.status(201).json({
            message: 'Note created in Notion.',
            pageId: notionData.id
        });
    } catch (error) {
        return res.status(500).json({
            error: 'Unexpected server error while creating Notion note.'
        });
    }
});

app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
