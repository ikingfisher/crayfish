"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { JsonParser } from "@/components/json-parser"
import { XmlParser } from "@/components/xml-parser"
import { JwtDecoder } from "@/components/jwt-decoder"
import { YamlFormatter } from "@/components/yaml-formatter"
import { SqlFormatter } from "@/components/sql-formatter"
import { TextDiff } from "@/components/text-diff"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Developer Utility Tools</h1>
          <p className="text-muted-foreground text-lg">Essential tools for parsing, formatting, and decoding data</p>
        </div>

        <Tabs defaultValue="json" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="json">JSON Parser</TabsTrigger>
            <TabsTrigger value="xml">XML Parser</TabsTrigger>
            <TabsTrigger value="jwt">JWT Decoder</TabsTrigger>
            <TabsTrigger value="yaml">YAML Format</TabsTrigger>
            <TabsTrigger value="sql">SQL Format</TabsTrigger>
            <TabsTrigger value="diff">Text Diff</TabsTrigger>
          </TabsList>

          <TabsContent value="json" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>JSON Parser & Formatter</CardTitle>
                <CardDescription>Parse, validate, and format JSON data with syntax highlighting</CardDescription>
              </CardHeader>
              <CardContent>
                <JsonParser />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="xml" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>XML Parser & Formatter</CardTitle>
                <CardDescription>Parse, validate, and format XML data with proper indentation</CardDescription>
              </CardHeader>
              <CardContent>
                <XmlParser />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jwt" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>JWT Token Decoder</CardTitle>
                <CardDescription>Decode and inspect JWT tokens to view header, payload, and signature</CardDescription>
              </CardHeader>
              <CardContent>
                <JwtDecoder />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="yaml" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>YAML Formatter</CardTitle>
                <CardDescription>Format and validate YAML data with proper indentation</CardDescription>
              </CardHeader>
              <CardContent>
                <YamlFormatter />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sql" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>SQL Formatter</CardTitle>
                <CardDescription>Format and beautify SQL queries with proper indentation and keywords</CardDescription>
              </CardHeader>
              <CardContent>
                <SqlFormatter />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="diff" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Text Diff Tool</CardTitle>
                <CardDescription>
                  Compare two text blocks with syntax highlighting and line-by-line differences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TextDiff />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
