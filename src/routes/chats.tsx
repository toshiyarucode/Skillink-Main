import { createFileRoute } from "@tanstack/react-router";
import { Chats } from "@/components/skillink/chats";
import { pageHead } from "@/components/skillink/meta";

export const Route = createFileRoute("/chats")({
  head: () => pageHead("Chats", "Converse e negocie condições com suas conexões."),
  component: Chats,
});
