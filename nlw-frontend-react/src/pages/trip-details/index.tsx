import { Plus, X } from "lucide-react";
import { useState } from "react";
import { CreateActivityModal } from "./create-activity-modal";
import { ImportantLinks } from "./important-links";
import { Guests } from "./guests";
import { Activities } from "./activities";
import { DestinationAndDateHeader } from "./destination-and-date-header";

export function TripDetailsPage() {
  const [isCreateActivityModalOpen, setIsCreateActivityModalOpen] =
    useState(false);
  const [message, setMessage] = useState("");

  function openCreateActivityModal() {
    setIsCreateActivityModalOpen(true);
  }
  function closeCreateActivityModal() {
    setIsCreateActivityModalOpen(false);
  }

  function closeMessage() {
    setMessage("");
  }

  return (
    <div className="max-w-6xl py-10 mx-auto space-y-8">
      <DestinationAndDateHeader setMessage={setMessage} />

      <main className="flex gap-16 px-6">
        <div className="flex-1 space-y-6">
          <div className=" flex items-center justify-between">
            <h2 className="text-3xl font-semibold">Atividades</h2>

            <button
              onClick={openCreateActivityModal}
              className="bg-lime-300 text-lime-950 rounded-lg px-5 py-2 font-medium flex items-center gap-2 hover:bg-lime-400"
            >
              <Plus className="size-5" />
              Cadastrar atividade
            </button>
          </div>

          <Activities />
        </div>
        <div className="w-80 space-y-6">
          <ImportantLinks />
          <div className="w-full h-px bg-zinc-800" />

          <Guests setMessage={setMessage} />
        </div>
      </main>

      {isCreateActivityModalOpen && (
        <CreateActivityModal
          closeCreateActivityModal={closeCreateActivityModal}
        />
      )}

      {message != "" && (
        <div className="message-slide-in fixed bottom-20 left-10 z-999 rounded-xl flex flex-col shadow-shape gap-2 bg-zinc-900 py-3 px-5">
          <div className="flex items-center justify-between">
            <span>Alerta</span>
            <button onClick={closeMessage}>
              <X />
            </button>
          </div>
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}
