"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, AlertCircle } from "lucide-react"

export function JsonParser() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const isValidJson = useMemo(() => {
    if (!input) return false
    try {
      JSON.parse(input)
      return true
    } catch {
      return false
    }
  }, [input])

  const highlightJson = (jsonString: string) => {
    return jsonString
      .replace(/"([^"]+)":/g, '<span class="text-blue-600 dark:text-blue-400">"$1":</span>')
      .replace(/:\s*"([^"]+)"/g, ': <span class="text-green-600 dark:text-green-400">"$1"</span>')
      .replace(/:\s*(\d+)/g, ': <span class="text-purple-600 dark:text-purple-400">$1</span>')
      .replace(/:\s*(true|false|null)/g, ': <span class="text-orange-600 dark:text-orange-400">$1</span>')
  }

  const formatJson = () => {
    try {
      const parsed = JSON.parse(input)
      const formatted = JSON.stringify(parsed, null, 2)
      setOutput(formatted)
      setError("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON")
      setOutput("")
    }
  }

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(input)
      const minified = JSON.stringify(parsed)
      setOutput(minified)
      setError("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON")
      setOutput("")
    }
  }

  const copyToClipboard = async () => {
    if (output) {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Input JSON</label>
            <Badge variant={input && isValidJson ? "default" : "destructive"}>
              {input ? (isValidJson ? "Valid" : "Invalid") : "Empty"}
            </Badge>
          </div>
          <Textarea
            placeholder="Paste your JSON here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[300px] font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Formatted Output</label>
            {output && (
              <Button variant="outline" size="sm" onClick={copyToClipboard} className="h-8 bg-transparent">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
            )}
          </div>
          {output && (
            <div className="border rounded-md p-3 bg-muted/30 min-h-[300px] overflow-auto">
              <pre
                className="font-mono text-sm whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: highlightJson(output) }}
              />
            </div>
          )}
          {!output && (
            <Textarea
              placeholder="Formatted JSON will appear here..."
              value={output}
              readOnly
              className="min-h-[300px] font-mono text-sm"
            />
          )}
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2">
        <Button onClick={formatJson} disabled={!input}>
          Format JSON
        </Button>
        <Button onClick={minifyJson} variant="outline" disabled={!input}>
          Minify JSON
        </Button>
        <Button
          onClick={() => {
            setInput("")
            setOutput("")
            setError("")
          }}
          variant="outline"
        >
          Clear
        </Button>
      </div>
    </div>
  )
}
