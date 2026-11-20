import { createFileRoute } from "@tanstack/react-router";
import { Marketplace } from "@/components/skillink/marketplace";
import { pageHead } from "@/components/skillink/meta";

export const Route = createFileRoute("/comprar")({
  head: () => pageHead("Comprar serviços", "Encontre serviços digitais e contrate com Service Credits."),
  component: Marketplace,
});
