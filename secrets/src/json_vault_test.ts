import { JsonVault } from "./json_vault.ts";
import { isFile, remove } from "@gnome/fs";
import { assert as ok, assertEquals as equals } from "@std/assert";

const key = await crypto.subtle.generateKey(
    {
        name: "AES-GCM",
        length: 256,
    },
    true,
    ["encrypt", "decrypt"],
);

Deno.test("json vault", async () => {
    try {
        const vault = new JsonVault(key, "vault1.json");

        const secret1 = await vault.createSecret("secret1", "test1");
        ok(secret1);

        const names = await vault.listSecretNames();
        equals(names.length, 1);
        equals("secret1", names[0]);

        const secret2Get = await vault.getSecret("secret1");
        ok(secret2Get);
        equals(secret2Get.name, "secret1");
        equals(secret2Get.value, "test1");

        await vault.setSecretValue("secret1", "updated1");

        const secret2GetUpdated = await vault.getSecret("secret1");
        ok(secret2GetUpdated);
        equals(secret2GetUpdated.name, "secret1");
        equals(secret2GetUpdated.value, "updated1");

        await vault.deleteSecretByName("secret1");
        const secret2GetDeleted = await vault.getSecret("secret1");
        ok(!secret2GetDeleted);
    } finally {
        if (await isFile("vault1.json")) {
            await remove("vault1.json");
        }
    }
});
