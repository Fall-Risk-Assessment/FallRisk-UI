
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const profileId = "mat_sensor";
  
  // Check if exists
  const exists = await prisma.deviceProfile.findUnique({
    where: { profile_id: profileId }
  });

  if (!exists) {
    console.log(`Creating profile: ${profileId}...`);
    await prisma.deviceProfile.create({
      data: {
        profile_id: profileId,
        name: "Sensor (Arduino)",
        data_type: "sensor",
        schema_definition: { 
            format: "JSON",
            fields: ["distance", "temperature", "humidity"]
        }
      }
    });
    console.log("✅ Profile created successfully!");
  } else {
    console.log(`ℹ️ Profile '${profileId}' already exists.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
