import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { readPerson, writePerson, type Person } from "./context";

interface PersonState {
  person: Person | null;
  setPerson: (person: Person | null) => void;
}

const PersonContext = createContext<PersonState | null>(null);

export function PersonProvider({ children }: { children: ReactNode }) {
  const [person, setPersonState] = useState<Person | null>(readPerson);

  const value = useMemo<PersonState>(
    () => ({
      person,
      setPerson: (next) => {
        writePerson(next);
        setPersonState(next);
      },
    }),
    [person],
  );

  return <PersonContext.Provider value={value}>{children}</PersonContext.Provider>;
}

export function usePerson(): PersonState {
  const value = useContext(PersonContext);
  if (!value) throw new Error("usePerson outside PersonProvider");
  return value;
}
