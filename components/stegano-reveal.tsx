"use client"

import { useEffect, useState, useCallback } from "react"
import { decode } from "@/app/encoding"

interface SteganoRevealProps {
  /** O texto codificado */
  encodedText: string
  /** Label para o tipo de dados "Output" e "Decoded" */
  label?: string
}

/**
 * SteganoReveal — Componente de acessibilidade pra esteganografia Unicode.
 *
 * Detecta automaticamente mensagens ocultas com Variation Selectors
 * e mostra elas na interface, em atributos ARIA e em JSON-LD estruturado
 * para que IAs e leitores de tela consigam ler
 */
export function SteganoReveal({ encodedText, label = "Mensagem" }: SteganoRevealProps) {
  const [hiddenMessage, setHiddenMessage] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!encodedText) {
      setHiddenMessage(null)
      return
    }

    try {
      const decoded = decode(encodedText)
      if (decoded && decoded.length > 0 && decoded !== encodedText) {
        setHiddenMessage(decoded)
      } else {
        setHiddenMessage(null)
      }
    } catch {
      setHiddenMessage(null)
    }
  }, [encodedText])

  const handleCopy = useCallback(async () => {
    if (!hiddenMessage) return
    try {
      await navigator.clipboard.writeText(
        `[MENSAGEM OCULTA EM EMOJI]\n` +
        `Carrier: ${encodedText.slice(0, 2)}\n` +
        `Conteúdo: ${hiddenMessage}\n` +
        `(decodificado via Variation Selectors Unicode U+FE00-U+FE0F, U+E0100-U+E01EF)`
      )
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
    }
  }, [hiddenMessage, encodedText])

  useEffect(() => {
    if (!hiddenMessage) return

    const scriptId = "stegano-reveal-ld+json"
    let script = document.getElementById(scriptId) as HTMLScriptElement | null

    if (!script) {
      script = document.createElement("script")
      script.id = scriptId
      script.type = "application/ld+json"
      document.head.appendChild(script)
    }

    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: "Emoji com mensagem oculta",
      encodingFormat: "text/unicode-variation-selector-steganography",
      hasPart: {
        "@type": "CreativeWork",
        text: hiddenMessage,
        encodingFormat: "text/plain",
        description:
          "Mensagem oculta decodificada de Variation Selectors Unicode " +
          "(U+FE00–U+FE0F, U+E0100–U+E01EF) anexados a um caractere base.",
      },
    })

    return () => {
    }
  }, [hiddenMessage])

  if (!hiddenMessage) {
    return (
      <div
        data-stegano-reveal="no-hidden-message"
        aria-label={`${label} sem mensagem oculta detectada`}
        className="hidden"
      />
    )
  }

  return (
    <div
      data-stegano-reveal="hidden-message-detected"
      aria-label={`${label} contém mensagem oculta: ${hiddenMessage}`}
      className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm transition-all"
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left font-medium text-amber-800 hover:text-amber-900"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2">
          <span aria-hidden="true">🔓</span>
          Mensagem oculta detectada
        </span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="mt-3 space-y-3">
          {/* Mensagem revelada */}
          <div className="rounded bg-white p-2 font-mono text-xs text-amber-900 break-all">
            {hiddenMessage}
          </div>

          {/* Informação técnica */}
          <p className="text-xs text-amber-600">
            Esta mensagem está codificada via{" "}
            <a
              href="https://paulbutler.org/2025/smuggling-arbitrary-data-through-an-emoji/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-amber-800"
            >
              Variation Selectors Unicode
            </a>{" "}
            (U+FE00–U+FE0F, U+E0100–U+E01EF) — invisíveis na renderização,
            mas preservados em copiar/colar.
          </p>

          {/* Botão copiar pra IA */}
          <button
            type="button"
            onClick={handleCopy}
            className="rounded bg-amber-100 px-3 py-1.5 text-xs font-medium text-amber-800 transition-colors hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
            aria-label="Copiar mensagem decodificada para colar em uma IA"
          >
            {copied ? "✓ Copiado!" : "📋 Copiar mensagem revelada"}
          </button>
        </div>
      )}
    </div>
  )
}
