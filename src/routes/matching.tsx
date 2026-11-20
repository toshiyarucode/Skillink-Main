import { createFileRoute } from "@tanstack/react-router";
import { Matching } from "@/components/skillink/matching";
import { pageHead } from "@/components/skillink/meta";

export const Route = createFileRoute("/matching")({
  head: () => pageHead("Matching", "Descubra talentos com interesses complementares para trocas de serviços."),
  component: Matching,
});
