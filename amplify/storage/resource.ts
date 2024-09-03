import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "amplifyClientsStorage",
  access: (allow) => ({
    "clients/{entity_id}/*": [
      allow.entity("identity").to(["read", "write", "delete"]),
    ],
  }),
});
