import { InfluxDB, Point } from "@influxdata/influxdb-client";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.INFLUX_URL;
const token = process.env.INFLUX_TOKEN;
const org = process.env.INFLUX_ORG;
const bucket = process.env.INFLUX_BUCKET;

console.log("--- InfluxDB Connection Test ---");
console.log(`URL: ${url}`);
console.log(`Org: ${org}`);
console.log(`Bucket: ${bucket}`);
console.log(`Token: ${token ? "********" : "MISSING"}`);

if (!url || !token || !org || !bucket) {
    console.error("❌ Error: Missing environment variables. Please check .env file.");
    process.exit(1);
}

const client = new InfluxDB({ url, token });
const writeApi = client.getWriteApi(org, bucket);

const testPoint = new Point("test_measurement")
    .tag("source", "test_script")
    .floatField("test_value", Math.random() * 100);

console.log("\nWRITING test point...");

try {
    writeApi.writePoint(testPoint);
    await writeApi.close();
    console.log("✅ Write Successful!");

    console.log("\nQUERYING test point...");
    const queryApi = client.getQueryApi(org);
    const fluxQuery = `
        from(bucket: "${bucket}")
        |> range(start: -5m)
        |> filter(fn: (r) => r["_measurement"] == "32x32 Grid")
        |> limit(n: 5)
    `;

    const rows = [];
    queryApi.queryRows(fluxQuery, {
        next(row, tableMeta) {
            const o = tableMeta.toObject(row);
            rows.push(o);
        },
        error(error) {
            console.error("❌ Query Failed:", error);
        },
        complete() {
            if (rows.length > 0) {
                console.log("✅ Query Successful! Found record:");
                console.log(rows);
            } else {
                console.warn("⚠️ Query finished but no data found (Make sure InfluxDB is running and bucket exists).");
            }
        },
    });

} catch (e) {
    console.error("❌ Error:", e);
}
