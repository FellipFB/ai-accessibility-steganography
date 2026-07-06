"use client"

import { useState, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function ImageSteganographyPage() {
  const [mode, setMode] = useState<"encode" | "decode">("encode")
  const [message, setMessage] = useState("")
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [decodedMessage, setDecodedMessage] = useState("")
  const [error, setError] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setOriginalImage(ev.target?.result as string)
      setResultImage(null)
      setDecodedMessage("")
      setError("")
    }
    reader.readAsDataURL(file)
  }, [])

  const encodeMessage = useCallback(() => {
    if (!originalImage || !message) return
    const img = new Image()
    img.onload = () => {
      const canvas = canvasRef.current!
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")!
      ctx.drawImage(img, 0, 0)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      const textBytes = new TextEncoder().encode(message + "\0")
      
      if (textBytes.length * 8 > data.length) {
        setError("Mensagem muito longa para esta imagem. Escolha uma imagem maior.")
        return
      }

      let byteIndex = 0
      let bitIndex = 0
      for (let i = 0; i < data.length && byteIndex < textBytes.length; i += 4) {
        for (let c = 0; c < 3; c++) {
          if (byteIndex >= textBytes.length) break
          const currentBit = (textBytes[byteIndex] >> (7 - bitIndex)) & 1
          data[i + c] = (data[i + c] & 0xFE) | currentBit
          bitIndex++
          if (bitIndex === 8) {
            bitIndex = 0
            byteIndex++
          }
        }
      }

      ctx.putImageData(imageData, 0, 0)
      setResultImage(canvas.toDataURL("image/png"))
      setError("")
    }
    img.src = originalImage
  }, [originalImage, message])

  const decodeMessage = useCallback(() => {
    if (!originalImage) return
    const img = new Image()
    img.onload = () => {
      const canvas = canvasRef.current!
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")!
      ctx.drawImage(img, 0, 0)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      const bytes: number[] = []
      let currentByte = 0
      let bitIndex = 0

      for (let i = 0; i < data.length; i += 4) {
        for (let c = 0; c < 3; c++) {
          currentByte = (currentByte << 1) | (data[i + c] & 1)
          bitIndex++
          if (bitIndex === 8) {
            if (currentByte === 0) {
              setDecodedMessage(new TextDecoder().decode(new Uint8Array(bytes)))
              setError("")
              return
            }
            bytes.push(currentByte)
            currentByte = 0
            bitIndex = 0
          }
        }
      }

      if (bytes.length > 0) {
        setDecodedMessage(new TextDecoder().decode(new Uint8Array(bytes)))
        setError("")
      } else {
        setError("Nenhuma mensagem oculta encontrada nesta imagem.")
      }
    }
    img.src = originalImage
  }, [originalImage])

  const downloadImage = useCallback(() => {
    if (!resultImage) return
    const a = document.createElement("a")
    a.href = resultImage
    a.download = "stegano-image.png"
    a.click()
  }, [resultImage])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-center text-2xl">
              Esteganografia em Imagens
            </CardTitle>
            <Link href="/" className="text-xs text-blue-600 underline hover:text-blue-800">
              ← Unicode
            </Link>
          </div>
          <p className="text-center text-sm text-gray-500">
            Esconda mensagens em imagens PNG usando LSB (Least Significant Bit)
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={mode} onValueChange={(v) => { setMode(v as "encode" | "decode"); setError(""); setResultImage(null); setDecodedMessage("") }}>
            <TabsList className="w-full">
              <TabsTrigger value="encode" className="flex-1">Codificar</TabsTrigger>
              <TabsTrigger value="decode" className="flex-1">Decodificar</TabsTrigger>
            </TabsList>

            <TabsContent value="encode" className="space-y-4">
              <div>
                <label className="text-sm font-medium">Imagem original (PNG)</label>
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={handleImageUpload}
                  className="mt-1 w-full text-sm"
                />
              </div>

              {originalImage && (
                <div>
                  <label className="text-sm font-medium">Mensagem para esconder</label>
                  <Textarea
                    placeholder="Digite a mensagem secreta..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[80px] mt-1"
                  />
                </div>
              )}

              {originalImage && message && (
                <Button onClick={encodeMessage} className="w-full">
                  Codificar mensagem na imagem
                </Button>
              )}

              {resultImage && (
                <div className="space-y-2">
                  <p className="text-sm text-green-600 font-medium">✓ Mensagem codificada com sucesso!</p>
                  <img src={resultImage} alt="Imagem com mensagem oculta" className="w-full rounded border" />
                  <Button onClick={downloadImage} variant="outline" className="w-full">
                    Baixar imagem PNG
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="decode" className="space-y-4">
              <div>
                <label className="text-sm font-medium">Imagem com mensagem oculta</label>
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={handleImageUpload}
                  className="mt-1 w-full text-sm"
                />
              </div>

              {originalImage && (
                <Button onClick={decodeMessage} className="w-full">
                  Extrair mensagem oculta
                </Button>
              )}

              {decodedMessage && (
                <Alert>
                  <AlertDescription>
                    <p className="font-medium mb-1">Mensagem extraída:</p>
                    <p className="font-mono text-sm bg-gray-100 p-2 rounded break-all">{decodedMessage}</p>
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>

          {error && (
            <div className="text-red-500 text-sm text-center" role="alert">
              {error}
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </CardContent>
      </Card>
    </div>
  )
}
