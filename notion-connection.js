
const { Client } = require("@notionhq/client");
const env = require("./env.json");

const notion = new Client({
    auth: env.secret
});

const getDatabase = async (databaseId, filter) => {
    const dbItems = await notion.databases.query({
        database_id: databaseId,
        filter
    });
    return dbItems;
}

// page properties
const getPage = async (id) => await notion.pages.retrieve({ page_id: id });

// page children - content
const getPageChildren = async (id) => await notion.blocks.children.list({
    block_id: id,
    page_size: 50
});

const getEBoard = async () => {
    const databaseId = env.eBoardId;
    const filter = {
        "property": "Tags",
        "multi_select": {
            "contains": "EHI"
        }
    }

    const eItems = await getDatabase(databaseId, filter);
    const formattedItems = eItems?.results?.map(t => {
        const title = t.properties.Name.title?.[0]?.plain_text;
        const tags = t.properties.Tags.multi_select?.map(t => t.name).join(' | ');
        const id = t.id;
        const type = t.object;
        const lastUpdated = t.last_edited_time;
        const url = t.url;
        return { title, tags, id, type, lastUpdated, url };
    });
    // console.log(formattedItems);

    const onePage = await getPageChildren(formattedItems[0].id);

    console.log(onePage);
    console.log(`Found ${eItems.results.length} items...`);


}

getEBoard();