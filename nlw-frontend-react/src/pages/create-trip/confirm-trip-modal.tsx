import { X, User, Loader2 } from "lucide-react";
import { FormEvent } from "react";
import { Button } from "../../components/button";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ConfirmTripModalProps {
  closeConfirmTripModal: () => void;
  createTrip: (event: FormEvent<HTMLFormElement>) => void;
  setOwnerName: (name: string) => void;
  setOwnerEmail: (email: string) => void;
  loading: boolean;
  destination: string;
  eventStartAndEndDate: DateRange | undefined;
}

export function ConfirmTripModal({
  closeConfirmTripModal,
  createTrip,
  setOwnerName,
  setOwnerEmail,
  loading,
  destination,
  eventStartAndEndDate,
}: ConfirmTripModalProps) {

const displayedDate =
  eventStartAndEndDate && eventStartAndEndDate.from && eventStartAndEndDate.to
    ? format(eventStartAndEndDate.from, "d ' de ' LLL", { locale: ptBR })
        .concat(" até ")
        .concat(
          format(eventStartAndEndDate.to, "d ' de ' LLL", { locale: ptBR })
        )
        .concat(
          format(eventStartAndEndDate.to, " ' de ' yyyy", { locale: ptBR })
        )
    : null;


  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center ">
      <div className="w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Confirmar criação de viagem
            </h2>
            <button onClick={closeConfirmTripModal}>
              <X className="size-5 text-zinc-400" />
            </button>
          </div>
          <p className="text-sm text-zinc-400">
            Para concluir a criação da viagem para{" "}
            <span className="text-zinc-100 font-semibold">{destination}</span>{" "}
            nas datas de{" "}
            <span className="text-zinc-100 font-semibold">
              {displayedDate}
            </span>{" "}
            preencha seus dados abaixo:
          </p>
        </div>

        <form onSubmit={createTrip} className="space-y-3">
          <div className="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
            <User className="size-5 text-zinc-400" />
            <input
              name="name"
              placeholder="Seu nome completo"
              className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
              onChange={(event) => setOwnerName(event.target.value)}
            />
          </div>

          <div className="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
            <User className="size-5 text-zinc-400" />
            <input
              type="email"
              name="email"
              placeholder="Seu e-mail pessoal"
              className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
              onChange={(event) => setOwnerEmail(event.target.value)}
            />
          </div>
          {loading ? (
            <Button type="submit" variant="primary" size="full">
              Confirmando
              <Loader2 className="size-5 animate-spin" />
            </Button>
          ) : (
            <Button type="submit" variant="primary" size="full">
              Confirmar criação da viagem
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}
