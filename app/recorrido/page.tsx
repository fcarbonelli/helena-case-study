import type { Metadata } from "next";
import { Recorrido } from "@/components/Recorrido";

export const metadata: Metadata = {
  title: "El mostrador",
};

export default function PaginaRecorrido() {
  return <Recorrido />;
}
