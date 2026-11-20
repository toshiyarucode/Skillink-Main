import { createFileRoute } from "@tanstack/react-router";
import { Wallet } from "@/components/skillink/wallet";
import { pageHead } from "@/components/skillink/meta";

export const Route = createFileRoute("/carteira")({
  head: () => pageHead("Carteira SC", "Seu saldo, créditos reservados e histórico de movimentações."),
  component: Wallet,
});
