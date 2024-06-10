# @gnome/secrets

<div height=30" vertical-align="top">
<image src="https://raw.githubusercontent.com/gnomejs/gnomejs/main/assets/icon.png"
    alt="logo" width="60" valign="middle" />
<span>Work less. Do more. </span>
</div>

## Overview

The secrets module provides a secret generator, a secret masker, a `Vault`
interface, and two vault implementations: json and memory.

The secret generator uses a cryptographic random number generator (csrng)
defaults to NIST requirements e.g length > 8, 1 upper, 1 lower, 1 digit, and
1 special character.

The `Vault` interface exists to switch implementations in your application
e.g. KeePass, Azure Key Vault, AWS KMS, Hashicorp Vault, etc.

The JsonVault uses AesGcm and expects you to provide the key and file path.

The secret masker works by adding secrets and variants to the masker and then it
will replace the secret with '*********' which is useful to protect secrets
from logs or CI/CD standard output.

## Basic Usage

```typescript
import { DefaultSecretGenerator, JsonVault, secretMasker } from "@gnome/secrets";
import { assertEquals as equals } from "@std/assert"

// secret generator / password generator
const generator = new DefaultSecretGenerator();
generator.addDefaults();

console.log(generator.generate());
console.log(generator.generate(30));

// secret masker
const masker = secretMasker;
masker.add("super secret");
masker.add("another secret");
masker.addGenerator((secret: string) => {
    return secret.toUpperCase();
});

equals(masker.mask("super secret"), "*******");
equals(masker.mask("SUPER SECRET"), "*******");
equals(masker.mask("another secret"), "*******");
equals(masker.mask("ANOTHER SECRET"), "*******");

const key = await crypto.subtle.generateKey(
    {
        name: "AES-GCM",
        length: 256,
    },
    true,
    ["encrypt", "decrypt"],
);

const vault = new JsonVault(key, "vault1.json");

const secret1 = await vault.createSecret("secret1", "test1");
console.log(secret1);

const names = await vault.listSecretNames();
console.log(names);

const secret2Get = await vault.getSecret("secret1");
console.log(secret2Get);
await vault.setSecretValue("secret1", "updated1");

const value = await vault.getSecretValue("secret1");
console.log(value);
```

[MIT License](./LICENSE.md)
