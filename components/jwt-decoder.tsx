"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, Check, AlertCircle, Key, FileText, Shield } from "lucide-react"

interface DecodedJWT {
  header: any
  payload: any
  signature: string
}

export function JwtDecoder() {
  const [input, setInput] = useState("")
  const [decoded, setDecoded] = useState<DecodedJWT | null>(null)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState<string>("")

  const decodeJwt = () => {
    try {
      const token = input.trim()
      const parts = token.split(".")

      if (parts.length !== 3) {
        throw new Error("Invalid JWT format. JWT must have 3 parts separated by dots.")
      }

      const [headerB64, payloadB64, signature] = parts

      // Decode header
      const header = JSON.parse(atob(headerB64.replace(/-/g, "+").replace(/_/g, "/")))

      // Decode payload
      const payload = JSON.parse(atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/")))

      setDecoded({ header, payload, signature })
      setError("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JWT token")
      setDecoded(null)
    }
  }

  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(""), 2000)
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString()
  }

  const isExpired = (exp?: number) => {
    if (!exp) return false
    return Date.now() / 1000 > exp
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">JWT Token</label>
          <Badge variant={decoded ? "default" : "secondary"}>{decoded ? "Decoded" : "Enter Token"}</Badge>
        </div>
        <Textarea
          placeholder="Paste your JWT token here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-h-[100px] font-mono text-sm"
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2">
        <Button onClick={decodeJwt} disabled={!input}>
          Decode JWT
        </Button>
        <Button
          onClick={() => {
            setInput("")
            setDecoded(null)
            setError("")
          }}
          variant="outline"
        >
          Clear
        </Button>
      </div>

      {decoded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Header */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Key className="h-5 w-5" />
                Header
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(JSON.stringify(decoded.header, null, 2), "header")}
                  className="ml-auto h-8"
                >
                  {copied === "header" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-muted p-3 rounded-md overflow-auto">
                {JSON.stringify(decoded.header, null, 2)}
              </pre>
            </CardContent>
          </Card>

          {/* Payload */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5" />
                Payload
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(JSON.stringify(decoded.payload, null, 2), "payload")}
                  className="ml-auto h-8"
                >
                  {copied === "payload" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-muted p-3 rounded-md overflow-auto max-h-[300px]">
                {JSON.stringify(decoded.payload, null, 2)}
              </pre>

              {/* Token Info */}
              <div className="mt-4 space-y-2">
                {decoded.payload.exp && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Expires:</span>
                    <Badge variant={isExpired(decoded.payload.exp) ? "destructive" : "default"}>
                      {formatTimestamp(decoded.payload.exp)}
                    </Badge>
                  </div>
                )}
                {decoded.payload.iat && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Issued:</span>
                    <span>{formatTimestamp(decoded.payload.iat)}</span>
                  </div>
                )}
                {decoded.payload.iss && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Issuer:</span>
                    <span className="font-mono">{decoded.payload.iss}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Signature */}
          <Card className="md:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5" />
                Signature
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(decoded.signature, "signature")}
                  className="ml-auto h-8"
                >
                  {copied === "signature" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-3 rounded-md">
                <code className="text-sm break-all">{decoded.signature}</code>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                The signature is used to verify that the token hasn't been tampered with.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
