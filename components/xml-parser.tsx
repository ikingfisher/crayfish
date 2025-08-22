"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, AlertCircle } from "lucide-react"

export function XmlParser() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const highlightXml = (xml: string) => {
    // First escape HTML entities to prevent XML from being rendered as HTML
    const escaped = xml
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")

    // Apply syntax highlighting to the escaped content
    return escaped
      .replace(/(&lt;\/?[a-zA-Z0-9-_:]+)/g, '<span class="text-blue-600 dark:text-blue-400 font-semibold">$1</span>')
      .replace(/(&gt;)/g, '<span class="text-blue-600 dark:text-blue-400">$1</span>')
      .replace(
        /([a-zA-Z0-9-_:]+)=(&quot;[^&]*?&quot;|&#39;[^&]*?&#39;)/g,
        '<span class="text-orange-600 dark:text-orange-400">$1</span>=<span class="text-green-600 dark:text-green-400">$2</span>',
      )
      .replace(/(&lt;!--.*?--&gt;)/g, '<span class="text-gray-500 dark:text-gray-400 italic">$1</span>')
      .replace(/(&lt;\?.*?\?&gt;)/g, '<span class="text-purple-600 dark:text-purple-400">$1</span>')
  }

  const formatXml = () => {
    try {
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(input, "text/xml")

      // Check for parsing errors
      const parserError = xmlDoc.getElementsByTagName("parsererror")
      if (parserError.length > 0) {
        throw new Error("Invalid XML structure")
      }

      const formatted = formatXmlString(input)
      setOutput(formatted)
      setError("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid XML")
      setOutput("")
    }
  }

  const formatXmlString = (xml: string): string => {
    const PADDING = "  "
    const reg = /(>)(<)(\/*)/g
    const formatted = xml.replace(reg, "$1\r\n$2$3")
    let pad = 0

    return formatted
      .split("\r\n")
      .map((node) => {
        let indent = 0
        if (node.match(/.+<\/\w[^>]*>$/)) {
          indent = 0
        } else if (node.match(/^<\/\w/) && pad > 0) {
          pad -= 1
        } else if (node.match(/^<\w[^>]*[^/]>.*$/)) {
          indent = 1
        } else {
          indent = 0
        }

        pad += indent
        return PADDING.repeat(pad - indent) + node
      })
      .join("\r\n")
  }

  const minifyXml = () => {
    try {
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(input, "text/xml")

      const parserError = xmlDoc.getElementsByTagName("parsererror")
      if (parserError.length > 0) {
        throw new Error("Invalid XML structure")
      }

      const minified = input.replace(/>\s+</g, "><").trim()
      setOutput(minified)
      setError("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid XML")
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

  const validateXml = () => {
    if (!input.trim()) return false
    try {
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(input, "text/xml")
      const parserError = xmlDoc.getElementsByTagName("parsererror")
      return parserError.length === 0
    } catch {
      return false
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Input XML</label>
            <Badge variant={input && validateXml() ? "default" : "destructive"}>
              {input ? (validateXml() ? "Valid" : "Invalid") : "Empty"}
            </Badge>
          </div>
          <Textarea
            placeholder="Paste your XML here..."
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
                dangerouslySetInnerHTML={{ __html: highlightXml(output) }}
              />
            </div>
          )}
          {!output && (
            <Textarea
              placeholder="Formatted XML will appear here..."
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
        <Button onClick={formatXml} disabled={!input}>
          Format XML
        </Button>
        <Button onClick={minifyXml} variant="outline" disabled={!input}>
          Minify XML
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
