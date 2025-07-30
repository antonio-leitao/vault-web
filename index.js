import init, { encrypt_wrapper, decrypt_wrapper } from "./pkg/vault_wasm.js";

async function run() {
  // Initialize the WASM module. This is an async operation.
  await init();

  const passwordInput = document.getElementById("password");
  const dataInput = document.getElementById("data");
  const encryptBtn = document.getElementById("encryptBtn");
  const decryptBtn = document.getElementById("decryptBtn");
  const output = document.getElementById("output");

  // ENCRYPT BUTTON LOGIC
  encryptBtn.addEventListener("click", () => {
    const password = passwordInput.value;
    const plaintext = dataInput.value;

    if (!password || !plaintext) {
      output.textContent = "Please provide a password and data to encrypt.";
      output.className = "error";
      return;
    }

    try {
      // Convert the JS string to a byte array (UTF-8)
      const plaintextBytes = new TextEncoder().encode(plaintext);
      // Call our WASM function!
      const encryptedJsonPayload = encrypt_wrapper(plaintextBytes, password);
      output.textContent = encryptedJsonPayload;
      output.className = "";
    } catch (e) {
      output.textContent = `Encryption failed: ${e}`;
      output.className = "error";
    }
  });

  // DECRYPT BUTTON LOGIC
  decryptBtn.addEventListener("click", () => {
    const password = passwordInput.value;
    const encryptedJsonPayload = dataInput.value;

    if (!password || !encryptedJsonPayload) {
      output.textContent =
        "Please provide a password and the encrypted JSON payload.";
      output.className = "error";
      return;
    }

    try {
      // Call our WASM function!
      const decryptedBytes = decrypt_wrapper(encryptedJsonPayload, password);
      // Convert the resulting byte array back to a JS string
      const plaintext = new TextDecoder().decode(decryptedBytes);
      output.textContent = plaintext;
      output.className = "";
    } catch (e) {
      output.textContent = `Decryption failed: ${e}`;
      output.className = "error";
    }
  });
}

run();
