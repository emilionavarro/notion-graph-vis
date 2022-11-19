
const { Client } = require("@notionhq/client");
const env = require("./env.json");

const notion = new Client({
    auth: env.secret
});

const getDatabase = async (databaseId, filter) => {
    const dbItems = await notion.databases.query({
        database_id: databaseId,
        body: {
            filter
        }
    });
    return dbItems;
}

const getEBoard = async () => {
    const databaseId = env.eBoardId;
    const filter = {
        and: [
            {
                property: "Tags",
                "multi_select": {
                    contains: "EHI"
                }
            }
        ]

    }
    const eItems = await getDatabase(databaseId, filter);
    const formattedItems = eItems?.results?.map(t => {
        const title = t.properties.Name.title?.[0]?.plain_text;
        const tags = t.properties.Tags.multi_select?.map(t => t.name).join(' | ')
        return { title, tags };
    });
    console.log(formattedItems);

    console.log(`Found ${eItems.results.length} items...`);


}

getEBoard();