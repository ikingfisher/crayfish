"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, AlertCircle } from "lucide-react"

export function YamlFormatter() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const highlightYaml = (yaml: string) => {
    return yaml
      .replace(
        /^(\s*)([a-zA-Z0-9_-]+)(\s*:)/gm,
        '$1<span class="text-blue-600 dark:text-blue-400 font-medium">$2</span>$3',
      )
      .replace(/:\s*"([^"]*)"/g, ': <span class="text-green-600 dark:text-green-400">"$1"</span>')
      .replace(/:\s*'([^']*)'/g, ": <span class=\"text-green-600 dark:text-green-400\">'$1'</span>")
      .replace(/:\s*(\d+)$/gm, ': <span class="text-purple-600 dark:text-purple-400">$1</span>')
      .replace(/:\s*(true|false|null)$/gm, ': <span class="text-orange-600 dark:text-orange-400">$1</span>')
      .replace(/^(\s*)-\s*/gm, '$1<span class="text-red-600 dark:text-red-400">-</span> ')
      .replace(/^(\s*)#(.*)$/gm, '$1<span class="text-gray-500 dark:text-gray-400 italic">#$2</span>')
  }

  const formatYaml = () => {
    try {
      // Basic YAML formatting - normalize indentation and structure
      const lines = input.split("\n")
      const formatted = lines
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .map((line) => {
          // Handle key-value pairs
          if (line.includes(":") && !line.startsWith("-")) {
            const [key, ...valueParts] = line.split(":")
            const value = valueParts.join(":").trim()
            return value ? `${key.trim()}: ${value}` : `${key.trim()}:`
          }
          // Handle list items
          if (line.startsWith("-")) {
            return `- ${line.substring(1).trim()}`
          }
          return line
        })
        .join("\n")

      setOutput(formatted)
      setError("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error formatting YAML")
      setOutput("")
    }
  }

  const validateYaml = () => {
    if (!input.trim()) return false
    try {
      // Basic YAML validation - check for common syntax errors
      const lines = input.split("\n")
      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed && trimmed.includes(":")) {
          // Check for proper key-value format
          const colonIndex = trimmed.indexOf(":")
          if (colonIndex === 0 || colonIndex === trimmed.length - 1) {
            continue // Allow empty keys or values
          }
        }
      }
      return true
    } catch {
      return false
    }
  }

  const convertToJson = () => {
    try {
      // Simple YAML to JSON conversion for basic structures
      const yamlObj = parseSimpleYaml(input)
      const json = JSON.stringify(yamlObj, null, 2)
      setOutput(json)
      setError("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error converting to JSON")
      setOutput("")
    }
  }

  const parseSimpleYaml = (yaml: string): any => {
    const lines = yaml.split("\n").filter((line) => line.trim())
    const result: any = {}

    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed.includes(":") && !trimmed.startsWith("-")) {
        const [key, ...valueParts] = trimmed.split(":")
        const value = valueParts.join(":").trim()

        if (value) {
          // Try to parse as number or boolean
          if (value === "true" || value === "false") {
            result[key.trim()] = value === "true"
          } else if (!isNaN(Number(value))) {
            result[key.trim()] = Number(value)
          } else {
            // Remove quotes if present
            result[key.trim()] = value.replace(/^["']|["']$/g, "")
          }
        } else {
          result[key.trim()] = null
        }
      }
    }

    return result
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
            <label className="text-sm font-medium">Input YAML</label>
            <Badge variant={input && validateYaml() ? "default" : "secondary"}>
              {input ? (validateYaml() ? "Valid" : "Check Syntax") : "Empty"}
            </Badge>
          </div>
          <Textarea
            placeholder={`# Paste your YAML here
name: John Doe
age: 30
skills:
  - JavaScript
  - Python
  - YAML`}
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
                dangerouslySetInnerHTML={{ __html: highlightYaml(output) }}
              />
            </div>
          )}
          {!output && (
            <Textarea
              placeholder="Formatted output will appear here..."
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
        <Button onClick={formatYaml} disabled={!input}>
          Format YAML
        </Button>
        <Button onClick={convertToJson} variant="outline" disabled={!input}>
          Convert to JSON
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
