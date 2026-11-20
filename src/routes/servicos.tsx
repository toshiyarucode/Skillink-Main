import { createFileRoute } from "@tanstack/react-router";
import { Services } from "@/components/skillink/services";
import { pageHead } from "@/components/skillink/meta";

export const Route = createFileRoute("/servicos")({
  head: () => pageHead("Meus serviços", "Acompanhe serviços em andamento, pendentes, concluídos e cancelados."),
  component: Services,
});
