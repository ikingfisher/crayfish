"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, AlertCircle } from "lucide-react"

export function SqlFormatter() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const formatSql = () => {
    try {
      const formatted = formatSqlQuery(input)
      setOutput(formatted)
      setError("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error formatting SQL")
      setOutput("")
    }
  }

  const formatSqlQuery = (sql: string): string => {
    // SQL keywords to format
    const keywords = [
      "SELECT",
      "FROM",
      "WHERE",
      "JOIN",
      "INNER JOIN",
      "LEFT JOIN",
      "RIGHT JOIN",
      "FULL JOIN",
      "ON",
      "GROUP BY",
      "HAVING",
      "ORDER BY",
      "LIMIT",
      "OFFSET",
      "INSERT",
      "INTO",
      "VALUES",
      "UPDATE",
      "SET",
      "DELETE",
      "CREATE",
      "TABLE",
      "ALTER",
      "DROP",
      "INDEX",
      "PRIMARY KEY",
      "FOREIGN KEY",
      "REFERENCES",
      "NOT NULL",
      "UNIQUE",
      "DEFAULT",
      "CHECK",
      "CONSTRAINT",
      "AND",
      "OR",
      "NOT",
      "IN",
      "EXISTS",
      "BETWEEN",
      "LIKE",
      "IS",
      "NULL",
      "DISTINCT",
      "COUNT",
      "SUM",
      "AVG",
      "MIN",
      "MAX",
      "CASE",
      "WHEN",
      "THEN",
      "ELSE",
      "END",
      "AS",
    ]

    let formatted = sql.trim()

    // Remove extra whitespace
    formatted = formatted.replace(/\s+/g, " ")

    // Add line breaks before major keywords
    const majorKeywords = ["SELECT", "FROM", "WHERE", "GROUP BY", "HAVING", "ORDER BY", "LIMIT"]
    majorKeywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi")
      formatted = formatted.replace(regex, `\n${keyword}`)
    })

    // Add line breaks before JOIN keywords
    const joinKeywords = ["JOIN", "INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN"]
    joinKeywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi")
      formatted = formatted.replace(regex, `\n${keyword}`)
    })

    // Format the lines
    const lines = formatted
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line)

    const formattedLines = lines.map((line, index) => {
      // Uppercase keywords
      let formattedLine = line
      keywords.forEach((keyword) => {
        const regex = new RegExp(`\\b${keyword}\\b`, "gi")
        formattedLine = formattedLine.replace(regex, keyword.toUpperCase())
      })

      // Add proper indentation
      if (formattedLine.match(/^(JOIN|INNER JOIN|LEFT JOIN|RIGHT JOIN|FULL JOIN|ON)/i)) {
        return `  ${formattedLine}`
      } else if (formattedLine.match(/^(AND|OR)/i) && index > 0) {
        return `  ${formattedLine}`
      }

      return formattedLine
    })

    return formattedLines.join("\n")
  }

  const minifySql = () => {
    try {
      const minified = input
        .replace(/\s+/g, " ")
        .replace(/\s*([(),;])\s*/g, "$1")
        .trim()
      setOutput(minified)
      setError("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error minifying SQL")
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

  const validateSql = () => {
    if (!input.trim()) return false
    // Basic SQL validation - check for common patterns
    const sqlPattern = /\b(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\b/i
    return sqlPattern.test(input)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Input SQL</label>
            <Badge variant={input && validateSql() ? "default" : "secondary"}>
              {input ? (validateSql() ? "SQL Detected" : "Check Query") : "Empty"}
            </Badge>
          </div>
          <Textarea
            placeholder={`-- Paste your SQL query here
SELECT u.name, u.email, COUNT(o.id) as order_count FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.active = 1 GROUP BY u.id ORDER BY order_count DESC`}
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
          <Textarea
            placeholder="Formatted SQL will appear here..."
            value={output}
            readOnly
            className="min-h-[300px] font-mono text-sm"
          />
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2">
        <Button onClick={formatSql} disabled={!input}>
          Format SQL
        </Button>
        <Button onClick={minifySql} variant="outline" disabled={!input}>
          Minify SQL
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