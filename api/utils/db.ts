import { pgClient } from "../../deps.ts";

export const db = new pgClient({
    applicationName: "StampyCore",
    database: Deno.env.get("DBNAME"),
    hostname: Deno.env.get("DBHOST"),
    host_type: "tcp",
    password: Deno.env.get("DBPASS"),
    port: Deno.env.get("DBPORT"),
    user: Deno.env.get("DBUSER"),
    tls: {
        caCertificates: [
            Deno.env.get("DBCERT") || ""
        ],
        enforce: true,
    },
});
await db.connect();