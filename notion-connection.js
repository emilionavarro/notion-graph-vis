
const { Client } = require("@notionhq/client");
const env = require("./env.json");

const notion = new Client({
    auth: env.secret
});

const getBoard = async () => {
    const boardResponse = await notion.databases.query({
        database_id: env.databaseID,
        filter: {
            property: "Status",
            select: {
                equals: "todo"
            }
        }
    });
    console.log(boardResponse);
}

getBoard();
// ;(async () => {
//     const listUsersResponse = await notion.users.list();
//     console.log(listUsersResponse);
// })()