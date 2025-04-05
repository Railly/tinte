import { xataDB } from "./src/db/legacy";
import { sql } from "drizzle-orm";

const main = async () => {
  const tokenColors = await xataDB.execute(sql`
    SELECT
      *
    FROM
      "TokenColors"
    LIMIT 1;
  `);

  console.log(tokenColors.rows);
};

await main();
