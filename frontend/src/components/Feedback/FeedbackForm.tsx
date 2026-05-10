import { useState } from "react";
import { api } from "@/services/api";

export default function FeedbackForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const canSubmit = name.trim().length > 0 && message.trim().length > 0 && status !== "sending";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setStatus("sending");
    setErrorMsg("");

    try {
      await api.sendFeedback({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Erro ao enviar. Tente novamente.");
    }
  };

  if (status === "sent") {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-2xl p-8 text-center animate-fade-in">
        <div className="w-12 h-12 mx-auto mb-4 bg-green-100 dark:bg-green-800/30 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-green-800 dark:text-green-300 mb-2">Mensagem enviada!</h3>
        <p className="text-sm text-green-600 dark:text-green-400 mb-4">Obrigado pelo seu feedback. Ele será lido com atenção.</p>
        <button
          onClick={() => setStatus("idle")}
          className="text-sm text-green-700 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 font-medium underline underline-offset-2 cursor-pointer transition-colors"
        >
          Enviar outro
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="feedback-name" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">
            Nome <span className="text-red-400">*</span>
          </label>
          <input
            id="feedback-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 100))}
            placeholder="Seu nome"
            maxLength={100}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-800 dark:text-gray-200 text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-blue/30 focus:border-sky-blue/50 transition-all"
          />
        </div>
        <div>
          <label htmlFor="feedback-email" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">
            E-mail <span className="text-gray-300 dark:text-gray-600 text-xs">(opcional)</span>
          </label>
          <input
            id="feedback-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value.slice(0, 200))}
            placeholder="seu@email.com"
            maxLength={200}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-800 dark:text-gray-200 text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-blue/30 focus:border-sky-blue/50 transition-all"
          />
        </div>
      </div>

      <div>
        <label htmlFor="feedback-message" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">
          Mensagem <span className="text-red-400">*</span>
        </label>
        <textarea
          id="feedback-message"
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, 2000))}
          placeholder="Feedback sobre um artigo, sugestão de tema, dúvida..."
          maxLength={2000}
          rows={5}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-800 dark:text-gray-200 text-sm resize-none placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-blue/30 focus:border-sky-blue/50 transition-all"
        />
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-xs text-gray-300 dark:text-gray-600">{message.length}/2000</span>
        </div>
      </div>

      {status === "error" && (
        <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg px-3 py-2 animate-fade-in">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className={`
          w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-semibold
          transition-all duration-200 cursor-pointer
          ${canSubmit
            ? "bg-sky-blue text-white hover:bg-sky-blue/90 hover:shadow-lg hover:shadow-sky-blue/20 hover:-translate-y-0.5"
            : "bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
          }
        `}
      >
        {status === "sending" ? (
          <span className="inline-flex items-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Enviando...
          </span>
        ) : (
          "Enviar mensagem"
        )}
      </button>
    </form>
  );
}
