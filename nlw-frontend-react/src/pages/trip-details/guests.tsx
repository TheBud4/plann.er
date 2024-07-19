import {  CheckCircle2, CircleDashed, UserCog } from "lucide-react";
import { Button } from "../../components/button";
import { useParams } from "react-router-dom";
import { FormEvent, useEffect, useState } from "react";
import { api } from "../../lib/axios";
import { ManageGuestsModal } from "./manage-guests";

interface Participant {
  id: string;
  name: string | null;
  email: string;
  is_confirmed: boolean;
}
interface guestsProps {
  setMessage: (message: string) => void;
}

export function Guests({ setMessage }: guestsProps) {
  const { tripId } = useParams();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isManageGuestsModalOpen, setIsManageGuestsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  function openManageGuestsModal() {
    setIsManageGuestsModalOpen(true);
  }
  function closeManageGuestsModal() {
    setIsManageGuestsModalOpen(false);
  }


  useEffect(() => {
    api
      .get(`/trips/${tripId}/participants`)
      .then((response) => setParticipants(response.data.participants));
  }, [tripId]);

   async function addNewEmailToInvite(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const email = data.get("email")?.toString();
      if (!email) {
        return closeManageGuestsModal();
      }
      setLoading(true);
      const response = await api.post(`/trips/${tripId}/invites`, {
        email: email,
      });
      if(response.status === 200){
        setMessage("Convidado adicionado com sucesso!");
      }
      setLoading(false);
      closeManageGuestsModal();
    }

  return (
    <div className="space-y-6 ">
      <h2 className="font-semibold text-xl">Convidados</h2>

      <div className="space-y-5">
        {participants.map((participant, index) => {
          
          return (
            <div
              key={participant.id}
              className="flex items-center justify-between gap-4"
            >
              <div className="space-y-1.5 ">
                <span className="block font-medium text-zinc-100">
                  {participant.name ?? `Convidado ${index}`}
                </span>
                <span className="block text-sm text-zinc-400 truncate ">
                  {participant.email}
                </span>
              </div>
              {participant.is_confirmed ? (
                <CheckCircle2 className="size-5 text-green-400 shrink-0" />
              ) : (
                <CircleDashed className="size-5 text-zinc-400 shrink-0" />
              )}
            </div>
          );
        })}
      </div>

      <Button variant="secondary" size="full" onClick={openManageGuestsModal}>
        <UserCog className="size-5" />
        Gerenciar convidados
      </Button>

      {isManageGuestsModalOpen && (
        <ManageGuestsModal
          addNewEmailToInvite={addNewEmailToInvite}
          closeManageGuestsModal={closeManageGuestsModal}
          loading={loading}
        />
      )}
    </div>
  );
}
