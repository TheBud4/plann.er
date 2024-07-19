import { MapPin, Calendar, Settings2, CheckCheck, X } from "lucide-react";
import { Button } from "../../components/button";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../lib/axios";
import { format } from "date-fns";
import { DateRange, DayPicker } from "react-day-picker";
import { ptBR } from "date-fns/locale";

interface Trip {
  id: string;
  destination: string;
  starts_at: string;
  ends_at: string;
  is_confirmed: boolean;
}

interface DestinationAndDateHeaderProps {
  setMessage: (message: string) => void;
}

export function DestinationAndDateHeader({
  setMessage,
}:DestinationAndDateHeaderProps) {
  const { tripId } = useParams();
  const [trip, setTrip] = useState<Trip | undefined>();
  const [destination, setDestination] = useState("");
  const [
    isAlterDestinationAndDateToggled,
    setIsAlterDestinationAndDateToggled,
  ] = useState(true);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [eventStartAndEndDate, setEventStartAndEndDate] = useState<
    DateRange | undefined
  >();
  function openAlterDestinationAndDate() {
    setIsAlterDestinationAndDateToggled(false);
  }
  function closeAlterDestinationAndDate() {
    setIsAlterDestinationAndDateToggled(true);
    alterTrip();
  }


  function openDatePicker() {
    return setIsDatePickerOpen(true);
  }

  function closeDatePicker() {
    return setIsDatePickerOpen(false);
  }

  useEffect(() => {
    api.get(`/trips/${tripId}`).then((response) => {
      setTrip(response.data.trip);
      setDestination(response.data.trip.destination);
      setEventStartAndEndDate({
        from: new Date(response.data.trip.starts_at),
        to: new Date(response.data.trip.ends_at),
      });
    });
  }, [tripId]);

  async function alterTrip() {
    if (!destination) {
      return;
    }
    if (!eventStartAndEndDate?.from || !eventStartAndEndDate?.to) {
      return;
    }

    //Gambiarra por que não temos um retorno para status 400 que funcione
    setMessage("Erro ao alterar viagem");
    const response = await api.put(`/trips/${tripId}`, {
      destination,
      starts_at: eventStartAndEndDate.from,
      ends_at: eventStartAndEndDate.to,
    });
    if (response.status === 200) {
      setMessage("Viagem alterada com sucesso!");
    }
  }

  const displayedDate =
    eventStartAndEndDate && eventStartAndEndDate.from && eventStartAndEndDate.to
      ? format(eventStartAndEndDate.from, "d ' de ' LLL", { locale: ptBR })
          .concat(" até ")
          .concat(format(eventStartAndEndDate.to, "d ' de ' LLL", { locale: ptBR }))
      : null;

  return (
    <div className="px-4 h-16 rounded-xl bg-zinc-900 shadow-shape flex items-center justify-between">
      <div className="flex items-center gap-2">
        <MapPin className="size-5 text-zinc-400" />
        <input
          type="text"
          disabled={isAlterDestinationAndDateToggled}
          placeholder={trip?.destination}
          defaultValue={trip?.destination}
          className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
          onChange={(event) => setDestination(event.target.value)}
        />
      </div>

      <div className="flex items-center gap-5">
        <button
          onClick={openDatePicker}
          disabled={isAlterDestinationAndDateToggled}
          className="flex items-center gap-2 text-left w-[240px]"
        >
          <Calendar className="size-5 text-zinc-400" />
          <span className=" text-lg text-zinc-100 w-40 flex-1">
            {displayedDate || "Quando?"}
          </span>
        </button>

        {isDatePickerOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center ">
            <div className=" rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Selecione a data</h2>
                  <button onClick={closeDatePicker}>
                    <X className="size-5 text-zinc-400" />
                  </button>
                </div>
              </div>
              <DayPicker
                mode="range"
                selected={eventStartAndEndDate}
                onSelect={setEventStartAndEndDate}
              />
            </div>
          </div>
        )}

        <div className="w-px h-6 bg-zinc-800" />
        {isAlterDestinationAndDateToggled ? (
          <Button variant="secondary" onClick={openAlterDestinationAndDate}>
            Alterar local/data
            <Settings2 className="size-5" />
          </Button>
        ) : (
          <Button onClick={closeAlterDestinationAndDate} variant="primary">
            Confirmar
            <CheckCheck className="size-5" />
          </Button>
        )}
      </div>
    </div>
  );
}
