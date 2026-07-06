import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Base64EncoderDecoderContent } from "./encoder-decoder-content"

export default function EncoderDecoder() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Hide a message in an emoji
          </CardTitle>
        </CardHeader>
        <Suspense fallback={<CardContent><p className="text-center text-gray-500">Loading...</p></CardContent>}>
          <Base64EncoderDecoderContent />
        </Suspense>
        <CardContent>
          <p className="text-xs text-center text-gray-400 mt-4">
            <a
              href="https://github.com/FellipFB/ai-accessibility-steganography/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-600"
              aria-label="Código fonte no GitHub — MIT License"
            >
              Source on GitHub
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
