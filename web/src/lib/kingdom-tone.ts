import { assertNever, type Kingdom } from "@/lib/schema";

export function kingdomTone(kingdom: Kingdom): string {
  switch (kingdom) {
    case "plant":
      return "text-plant";
    case "animal":
      return "text-animal";
    case "fungi":
      return "text-fungi";
    case "algae":
      return "text-algae";
    default: {
      const _exhaustive: never = kingdom;
      return assertNever(_exhaustive, "Kingdom");
    }
  }
}
