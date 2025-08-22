"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Copy, Check } from "lucide-react"

interface DiffLine {
  type: "added" | "removed" | "unchanged"
  content: string
  lineNumber: number
}

interface SideBySideDiff {
  leftLine: { content: string; type: "removed" | "unchanged" | "empty"; lineNumber: number; diffContent?: string }
  rightLine: { content: string; type: "added" | "unchanged" | "empty"; lineNumber: number; diffContent?: string }
}

export function TextDiff() {
  const [leftText, setLeftText] = useState("")
  const [rightText, setRightText] = useState("")
  const [language, setLanguage] = useState("text")
  const [diffResult, setDiffResult] = useState<SideBySideDiff[]>([])
  const [copied, setCopied] = useState(false)

  const generateDiff = () => {
    const leftLines = leftText.split("\n")
    const rightLines = rightText.split("\n")
    const maxLines = Math.max(leftLines.length, rightLines.length)
    const result: SideBySideDiff[] = []

    for (let i = 0; i < maxLines; i++) {
      const leftLine = leftLines[i] || ""
      const rightLine = rightLines[i] || ""

      if (leftLine === rightLine) {
        result.push({
          leftLine: {
            content: leftLine,
            type: "unchanged",
            lineNumber: i + 1,
          },
          rightLine: {
            content: rightLine,
            type: "unchanged",
            lineNumber: i + 1,
          },
        })
      } else {
        // Highlight differences within the line
        const leftContent = leftLine || ""
        const rightContent = rightLine || ""
        const leftDiff = leftContent !== rightContent ? leftContent : ""
        const rightDiff = rightContent !== leftContent ? rightContent : ""

        result.push({
          leftLine: {
            content: leftContent,
            type: leftContent ? "removed" : "empty",
            lineNumber: i + 1,
            diffContent: leftDiff,
          },
          rightLine: {
            content: rightContent,
            type: rightContent ? "added" : "empty",
            lineNumber: i + 1,
            diffContent: rightDiff,
          },
        })
      }
    }

    setDiffResult(result)
  }

  const copyDiff = async () => {
    const diffText = diffResult
      .map((diff) => {
        const leftPrefix = diff.leftLine.type === "removed" ? "- " : diff.leftLine.type === "unchanged" ? "  " : ""
        const rightPrefix = diff.rightLine.type === "added" ? "+ " : diff.rightLine.type === "unchanged" ? "  " : ""
        const leftContent = leftPrefix + diff.leftLine.content
        const rightContent = rightPrefix + diff.rightLine.content
        return diff.leftLine.type === "unchanged" ? leftContent : [leftContent, rightContent].filter(Boolean).join("\n")
      })
      .join("\n")

    await navigator.clipboard.writeText(diffText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getSyntaxHighlighting = (content: string, lang: string) => {
    // Basic syntax highlighting for common languages
    if (lang === "json") {
      return content
        .replace(/"([^"]+)":/g, '<span class="text-blue-600">"$1":</span>')
        .replace(/:\s*"([^"]+)"/g, ': <span class="text-green-600">"$1"</span>')
        .replace(/:\s*(\d+)/g, ': <span class="text-purple-600">$1</span>')
    }

    if (lang === "javascript" || lang === "typescript") {
      return content
        .replace(
          /\b(const|let|var|function|return|if|else|for|while|class|import|export)\b/g,
          '<span class="text-blue-600">$1</span>',
        )
        .replace(/'([^']+)'/g, "<span class=\"text-green-600\">'$1'</span>")
        .replace(/"([^"]+)"/g, '<span class="text-green-600">"$1"</span>')
    }

    return content
  }

  const addedCount = diffResult.filter((d) => d.rightLine.type === "added").length
  const removedCount = diffResult.filter((d) => d.leftLine.type === "removed").length

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Language:</label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Plain Text</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="html">HTML</SelectItem>
              <SelectItem value="css">CSS</SelectItem>
              <SelectItem value="sql">SQL</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Badge variant="outline">{addedCount} additions</Badge>
          <Badge variant="outline">{removedCount} deletions</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Original Text</label>
          <Textarea
            placeholder="Paste original text here..."
            value={leftText}
            onChange={(e) => setLeftText(e.target.value)}
            className="min-h-[300px] font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Modified Text</label>
          <Textarea
            placeholder="Paste modified text here..."
            value={rightText}
            onChange={(e) => setRightText(e.target.value)}
            className="min-h-[300px] font-mono text-sm"
          />
        </div>
      </div>

      {diffResult.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Diff Result</label>
            <Button variant="outline" size="sm" onClick={copyDiff} className="h-8 bg-transparent">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy Diff"}
            </Button>
          </div>
          <div className="border rounded-md bg-muted/30 max-h-[400px] overflow-auto">
            <div className="grid grid-cols-2 divide-x">
              <div className="p-4">
                <div className="text-sm font-medium mb-2 text-muted-foreground">Original</div>
                <div className="font-mono text-sm space-y-1">
                  {diffResult.map((diff, index) => (
                    <div
                      key={`left-${index}`}
                      className={`flex items-start gap-2 px-2 py-1 rounded ${
                        diff.leftLine.type === "removed"
                          ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
                          : diff.leftLine.type === "empty"
                            ? "bg-gray-50 dark:bg-gray-800/30 opacity-50"
                            : "bg-transparent"
                      }`}
                    >
                      <span className="text-muted-foreground text-xs w-8 flex-shrink-0">
                        {diff.leftLine.type !== "empty" ? diff.leftLine.lineNumber : ""}
                      </span>
                      <span className="w-4 flex-shrink-0 text-center">
                        {diff.leftLine.type === "removed" ? "-" : " "}
                      </span>
                      <span
                        className="flex-1"
                        dangerouslySetInnerHTML={{
                          __html: diff.leftLine.diffContent
                            ? getSyntaxHighlighting(diff.leftLine.content.replace(diff.leftLine.diffContent, `<span class="bg-yellow-100 dark:bg-yellow-900">${diff.leftLine.diffContent}</span>`), language)
                            : getSyntaxHighlighting(diff.leftLine.content, language),
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4">
                <div className="text-sm font-medium mb-2 text-muted-foreground">Modified</div>
                <div className="font-mono text-sm space-y-1">
                  {diffResult.map((diff, index) => (
                    <div
                      key={`right-${index}`}
                      className={`flex items-start gap-2 px-2 py-1 rounded ${
                        diff.rightLine.type === "added"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                          : diff.rightLine.type === "empty"
                            ? "bg-gray-50 dark:bg-gray-800/30 opacity-50"
                            : "bg-transparent"
                      }`}
                    >
                      <span className="text-muted-foreground text-xs w-8 flex-shrink-0">
                        {diff.rightLine.type !== "empty" ? diff.rightLine.lineNumber : ""}
                      </span>
                      <span className="w-4 flex-shrink-0 text-center">
                        {diff.rightLine.type === "added" ? "+" : " "}
                      </span>
                      <span
                        className="flex-1"
                        dangerouslySetInnerHTML={{
                          __html: diff.rightLine.diffContent
                            ? getSyntaxHighlighting(diff.rightLine.content.replace(diff.rightLine.diffContent, `<span class="bg-yellow-100 dark:bg-yellow-900">${diff.rightLine.diffContent}</span>`), language)
                            : getSyntaxHighlighting(diff.rightLine.content, language),
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button onClick={generateDiff} disabled={!leftText && !rightText}>
          Generate Diff
        </Button>
        <Button
          onClick={() => {
            setLeftText("")
            setRightText("")
            setDiffResult([])
          }}
          variant="outline"
        >
          Clear All
        </Button>
      </div>
    </div>
  )
}
