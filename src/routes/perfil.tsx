import { createFileRoute } from "@tanstack/react-router";
import { Profile } from "@/components/skillink/profile";
import { pageHead } from "@/components/skillink/meta";

export const Route = createFileRoute("/perfil")({
  head: () => pageHead("Meu perfil", "Suas informações, serviços oferecidos, procurados e avaliações."),
  component: Profile,
});
