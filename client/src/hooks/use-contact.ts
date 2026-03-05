import { useMutation } from "@tanstack/react-query";
import { api, type CreateMessageInput } from "@shared/routes";

export function useSubmitContact() {
  return useMutation({
    mutationFn: async (data: CreateMessageInput) => {
      // Validate input against shared schema
      const validated = api.contact.create.input.parse(data);
      
      const res = await fetch(api.contact.create.path, {
        method: api.contact.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message || "Validation failed");
        }
        throw new Error("Failed to send message");
      }

      return res.json();
    },
  });
}
