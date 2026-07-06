import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Sobre o SteganoChar
          </CardTitle>
          <p className="text-center text-sm text-gray-500">
            Esteganografia Unicode — esconda mensagens onde ninguém vê
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h2 className="text-lg font-semibold mb-2">O que é?</h2>
            <p className="text-sm text-gray-700">
              SteganoChar é uma ferramenta que codifica mensagens invisíveis dentro de emojis
              e caracteres Unicode usando <strong>Variation Selectors</strong>
              (U+FE00–U+FE0F e U+E0100–U+E01EF). Estes caracteres são invisíveis na
              renderização, mas são preservados ao copiar/colar o texto.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">Como funciona?</h2>
            <p className="text-sm text-gray-700">
              Cada byte da sua mensagem é convertido em um Variation Selector Unicode.
              Estes selectors são anexados ao emoji "carrier". Quando alguém copia o
              emoji e cola aqui no modo Decode, os selectors são lidos de volta e
              convertidos para o texto original.
            </p>
          </section>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="use-cases">
              <AccordionTrigger>Casos de uso</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                  <li><strong>Comunicação encoberta</strong> — passe informações em comentários públicos</li>
                  <li><strong>Watermarking</strong> — marque textos com sua identidade</li>
                  <li><strong>Acessibilidade</strong> — o componente SteganoReveal expõe a mensagem para leitores de tela e IAs</li>
                  <li><strong>CTF e challenges</strong> — esconda flags em desafios de cybersecurity</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="tech">
              <AccordionTrigger>Detalhes técnicos</AccordionTrigger>
              <AccordionContent>
                <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto">
                  {`VARIATION_SELECTOR_START = U+FE00  (VS1  - VS16)
VARIATION_SELECTOR_SUPPLEMENT_START = U+E0100 (VS17 - VS256)

Bytes 0-15   → U+FE00..U+FE0F
Bytes 16-255 → U+E0100..U+E01EF

Mensagem "Oi" = [0x4F, 0x69]
→ 😀 + U+FE4F + U+FE69`}
                </pre>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="creator">
              <AccordionTrigger>Sobre o criador</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-gray-700">
                  Criado por <strong>FellipFB</strong> como uma evolução do projeto original
                  de Paul Butler, adicionando acessibilidade, detecção automática de mensagens
                  ocultas e uma interface moderna.
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  <Link
                    href="https://github.com/FellipFB/ai-accessibility-steganography"
                    target="_blank"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    Ver código fonte no GitHub →
                  </Link>
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="text-center pt-4">
            <Link
              href="/"
              className="text-sm text-blue-600 underline hover:text-blue-800"
            >
              ← Voltar para a ferramenta
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
