import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/components/skillink/dashboard";
import { pageHead } from "@/components/skillink/meta";

export const Route = createFileRoute("/")({
  head: () => pageHead("Visão geral", "Seu painel Skillink: saldo, serviços em andamento e conexões."),
  component: Dashboard,
});
