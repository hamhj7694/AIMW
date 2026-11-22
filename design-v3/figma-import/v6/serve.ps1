$ErrorActionPreference = 'Stop'
$file = 'C:\Users\Administrator\Documents\Craft Anything\AIMW\design-v3\figma-import\v6\index.html'
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add('http://127.0.0.1:8766/')
$listener.Start()
Write-Output 'serving v6 on 8766'
while ($listener.IsListening) {
  $context = $listener.GetContext()
  $response = $context.Response
  $bytes = [System.IO.File]::ReadAllBytes($file)
  $response.StatusCode = 200
  $response.ContentType = 'text/html; charset=utf-8'
  $response.Headers.Add('Access-Control-Allow-Origin', '*')
  $response.ContentLength64 = $bytes.Length
  $response.OutputStream.Write($bytes, 0, $bytes.Length)
  $response.Close()
}
